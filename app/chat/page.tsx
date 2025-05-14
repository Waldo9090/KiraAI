"use client"

import { useState, useRef, useEffect, useContext } from "react"
import { useRouter, useSearchParams } from 'next/navigation'; // Import useRouter and useSearchParams
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import { PromptPasteContext } from "@/app/dashboard/layout"; // Add this import
import { Paperclip, Globe, Send, Sparkles, BarChart2, ImageIcon, Calculator, Search, FileText, Settings2, RefreshCw, Copy, ThumbsUp, ThumbsDown, ArrowDown, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { db } from "@/lib/firebase/config"; // Import db
import { collection, addDoc, serverTimestamp, updateDoc, arrayUnion, doc, Timestamp } from "firebase/firestore"; // Import Firestore functions and Timestamp
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search as SearchIcon } from "lucide-react"

// Define message type
interface ChatMessage {
  id: number
  sender: "user" | "ai"
  text: string
  model?: string // e.g., "Gemini 2.5 Flash" or "GPT 4o Mini"
  timestamp?: any // Use Firestore Timestamp type later if needed, `any` for now
}

// Add AIModel interface and AVAILABLE_MODELS array
interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  isPro?: boolean;
}

const AVAILABLE_MODELS: AIModel[] = [
  { id: 'claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', provider: 'Anthropic', description: "Anthropic's latest Sonnet model with PRO features", icon: Sparkles, isPro: true },
  { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'Anthropic', description: "Anthropic's most powerful model for complex tasks", icon: Sparkles },
  { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', provider: 'Anthropic', description: "Balanced intelligence and speed", icon: Sparkles },
  { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'Anthropic', description: "Anthropic's fastest, most compact model", icon: Sparkles },
  { id: 'gpt-4.1', name: 'GPT 4.1', provider: 'OpenAI', description: "OpenAI's flagship model for complex tasks", icon: Sparkles },
  { id: 'gpt-4o-mini', name: 'GPT 4o Mini', provider: 'OpenAI', description: "OpenAI's simple and fast text generation model", icon: Sparkles },
  { id: 'gpt-4.1-nano', name: 'GPT 4.1 Nano', provider: 'OpenAI', description: "OpenAI's fastest text generation model", icon: Sparkles },
];

export default function NewChatPage() {
  const [prompt, setPrompt] = useState("")
  const searchParams = useSearchParams();
  // const [messages, setMessages] = useState<ChatMessage[]>([]) // No longer needed here
  const [isChatStarted, setIsChatStarted] = useState(false) // Keep for conditional render logic initially
  const [isLoading, setIsLoading] = useState(false)
  const [greeting, setGreeting] = useState("")
  // const chatEndRef = useRef<HTMLDivElement>(null) // No longer needed here
  const { user, loading: authLoading } = useAuth(); // Get user and loading state
  const router = useRouter();
  const { pastePrompt, setPromptSetter } = useContext(PromptPasteContext); // Add setPromptSetter
  const [selectedModelId, setSelectedModelId] = useState<string>('gpt-4o-mini');
  const [isModelSelectOpen, setIsModelSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Simulate User Info (replace with actual auth context later)
  const userName = "User" // Fallback username
  // const userAvatar = "/placeholder.svg?height=40&width=40" // No longer needed here

  // Set greeting only on client-side after mount
  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours()
      if (hour < 12) return "Good morning"
      if (hour < 18) return "Good afternoon"
      return "Good evening"
    }
    setGreeting(getGreeting());
  }, []);

  // Redirect if not logged in after loading
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Auto-scroll to bottom - No longer needed here
  // useEffect(() => {
  //   chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  // }, [messages])

  // Add this useEffect to handle prompt pasting
  useEffect(() => {
    if (typeof pastePrompt === 'string') {
      setPrompt(pastePrompt);
    }
  }, [pastePrompt]);

  // Add useEffect to register setPrompt
  useEffect(() => {
    setPromptSetter(setPrompt);
    return () => {
      setPromptSetter(null);
    };
  }, [setPromptSetter]);

  // Add useEffect to handle URL parameter
  useEffect(() => {
    const promptFromUrl = searchParams.get('prompt');
    if (promptFromUrl) {
      setPrompt(decodeURIComponent(promptFromUrl));
    }
  }, [searchParams]);

  const selectedModel = AVAILABLE_MODELS.find(m => m.id === selectedModelId) || AVAILABLE_MODELS[0];
  const filteredModels = AVAILABLE_MODELS.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSend = async () => {
    if (!prompt.trim() || isLoading || !user || !user.email) {
      console.error("User or user email is not available.");
      alert("Error: User email not found. Cannot save chat.");
      setIsLoading(false);
      return;
    }

    const currentPrompt = prompt.trim();
    setPrompt("");
    setIsLoading(true);

    // Format the prompt text if it contains markdown headers
    const formattedPrompt = currentPrompt
      .replace(/###/g, '**')
      .replace(/####/g, '*')
      .replace(/---/g, '---\n')
      .replace(/\n-/g, '\n•');

    const userChatsCollectionPath = `savedHistory/${user.email}/chats`;
    console.log("Target collection path:", userChatsCollectionPath);

    try {
      console.log("Attempting to create chat shell for:", user.email);
      const initialChatData = {
        userId: user.uid,
        title: currentPrompt.substring(0, 50),
        createdAt: serverTimestamp(),
        modelId: selectedModelId, // Add the selected model ID
      };
      console.log("Initial Chat Data:", initialChatData);

      const newChatRef = await addDoc(collection(db, userChatsCollectionPath), initialChatData);
      console.log("Chat shell created with ID:", newChatRef.id, "under", user.email);

      const firstMessage = {
        sender: "user",
        text: formattedPrompt,
        timestamp: Timestamp.now()
      };
      console.log("Adding first message (client time):", firstMessage);
      await updateDoc(newChatRef, {
        messages: arrayUnion(firstMessage)
      });
      console.log("First message added successfully.");

      // Redirect to the new chat page with the model ID
      router.push(`/chat/${newChatRef.id}?model=${selectedModelId}`);

    } catch (error) {
      console.error("Error creating new chat:", error);
      alert("Failed to create new chat. Please try again.");
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  // --- Render logic ---
  if (authLoading) {
      return <div className="flex flex-grow items-center justify-center">Loading user...</div>; // Or a spinner
  }

  if (!user) {
      // This might be brief as the useEffect redirect should kick in
      return <div className="flex flex-grow items-center justify-center">Redirecting to login...</div>;
  }

  // Show initial centered input if user is logged in
  return (
    // Outermost div handles centering - use min-h-screen and w-full
    <div className="flex min-h-screen w-full items-center justify-center">
      {/* Inner container for max-width and centering */}
      <div className="w-full max-w-3xl flex flex-col items-center">

        {/* 1. Greeting - Remains centered */}
        <h1 className="text-3xl font-medium mb-8 text-center">
          {greeting ? `${greeting}, ${user.displayName || userName}!` : `Hey there, ${user.displayName || userName}!`}
        </h1>

        {/* 2. Input Box Section - Stays within the max-width container */}
        <div className="w-full mb-8">
          <div className="relative w-full shadow-sm rounded-xl border bg-white">
            <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your prompt here"
                className="w-full p-6 rounded-t-xl resize-none h-32 focus:outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
            />
            {/* Input Controls - Updated */}
            <div className="flex items-center justify-between p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl">
               {/* Left Controls - Simplified */}
               <div className="flex items-center space-x-4">
                  <Dialog open={isModelSelectOpen} onOpenChange={setIsModelSelectOpen}>
                    <DialogTrigger asChild>
                      <button className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer border border-gray-200 dark:border-gray-700">
                        {selectedModel.icon && <selectedModel.icon className="h-5 w-5 text-blue-500"/>}
                        <span className="text-sm font-medium dark:text-gray-300">{selectedModel.name}</span>
                        <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] p-0 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                      <DialogHeader className="p-6 pb-4">
                        <DialogTitle>Select Model</DialogTitle>
                      </DialogHeader>
                      <div className="px-6 pb-4">
                        <div className="relative">
                          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <Input
                            type="search"
                            placeholder="Search models..."
                            className="pl-9 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="max-h-[50vh] overflow-y-auto px-6 pb-6 space-y-2">
                        {filteredModels.map((model) => (
                          <button
                            key={model.id}
                            onClick={() => {
                              setSelectedModelId(model.id);
                              setIsModelSelectOpen(false);
                              setSearchTerm("");
                            }}
                            className={cn(
                              "w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between",
                              selectedModelId === model.id && "bg-gray-100 dark:bg-gray-700"
                            )}
                          >
                            <div className="flex items-center space-x-3">
                              {model.icon && <model.icon className="h-5 w-5 text-gray-600 dark:text-gray-300 flex-shrink-0"/>}
                              <div>
                                <div className="font-medium text-sm flex items-center">
                                  {model.name}
                                  {model.isPro && (
                                    <Badge variant="outline" className="ml-2 px-1.5 py-0 text-xs font-semibold border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400">
                                      PRO
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{model.description}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                        {filteredModels.length === 0 && (
                          <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">No models found.</p>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
               </div>
               {/* Right Controls - Simplified */}
               <div className="flex items-center space-x-4">
                 <Button 
                    onClick={handleSend} 
                    size="icon" 
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full w-8 h-8" 
                    disabled={isLoading}
                 >
                   {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} 
                 </Button>
               </div>
            </div>
          </div>
        </div>

        {/* Action buttons removed */}

      </div>
    </div>
  );

  // This part of the component (the chat view) is no longer reached
  // return null;
}
