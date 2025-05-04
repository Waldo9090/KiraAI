"use client"

import { useState, useRef, useEffect, useContext } from "react"
import { useRouter } from 'next/navigation'; // Import useRouter
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import { Paperclip, Globe, Send, Sparkles, Settings2, RefreshCw, Search as SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { db } from "@/lib/firebase/config"; // Import db
import { collection, addDoc, serverTimestamp, updateDoc, arrayUnion, doc, Timestamp } from "firebase/firestore"; // Import Firestore functions and Timestamp
import { PromptPasteContext } from "@/app/dashboard/layout"; // Import the context
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge" // Import Badge if using isPro

// Define message type
interface ChatMessage {
  id: number
  sender: "user" | "ai"
  text: string
  model?: string // e.g., "Gemini 2.5 Flash" or "GPT 4o Mini"
  timestamp?: any // Use Firestore Timestamp type later if needed, `any` for now
}

// --- Copied Model Definitions --- 
interface AIModel {
  id: string; 
  name: string; 
  provider: string; 
  description: string;
  icon?: React.ComponentType<{ className?: string }>; 
  isPro?: boolean; // Add isPro flag
}

// Copy the AVAILABLE_MODELS array from the chat page
const AVAILABLE_MODELS: AIModel[] = [
  // Google
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', description: "Google's most advanced model", icon: Sparkles }, 
  { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro', provider: 'Google', description: "Google's most capable multimodal model", icon: Sparkles },
  { id: 'gemini-1.5-flash-latest', name: 'Gemini 1.5 Flash', provider: 'Google', description: "Google's fast, multimodal model for general tasks", icon: Sparkles },
  // Anthropic
  { id: 'claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', provider: 'Anthropic', description: "Anthropic's latest Sonnet model with PRO features", icon: Sparkles, isPro: true }, 
  { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'Anthropic', description: "Anthropic's most powerful model for complex tasks", icon: Sparkles },
  { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', provider: 'Anthropic', description: "Balanced intelligence and speed", icon: Sparkles },
  { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'Anthropic', description: "Anthropic's fastest, most compact model", icon: Sparkles },
  // OpenAI
  { id: 'gpt-4.1', name: 'GPT 4.1', provider: 'OpenAI', description: "OpenAI's flagship model for complex tasks", icon: Sparkles },
  { id: 'gpt-4o-mini', name: 'GPT 4o Mini', provider: 'OpenAI', description: "OpenAI's simple and fast text generation model", icon: Sparkles },
  { id: 'gpt-4.1-nano', name: 'GPT 4.1 Nano', provider: 'OpenAI', description: "OpenAI's fastest text generation model", icon: Sparkles },
  // xAI
  { id: 'grok-3', name: 'Grok 3', provider: 'xAI', description: "xAI's latest model (via API if available)", icon: Sparkles }, 
  // DeepSeek
  { id: 'deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek', description: "DeepSeek R1 model (via API)", icon: Sparkles }, 
  // Llama (Example: via Groq)
  { id: 'llama3-70b-8192', name: 'Llama 3 70B', provider: 'Groq/Meta', description: "Meta's powerful Llama 3 model (70B parameters)", icon: Sparkles },
  { id: 'llama3-8b-8192', name: 'Llama 3 8B', provider: 'Groq/Meta', description: "Meta's efficient Llama 3 model (8B parameters)", icon: Sparkles },
  // Mistral (Example: via Groq or Mistral AI)
  { id: 'mixtral-8x7b-instruct', name: 'Mixtral 8x7B Instruct', provider: 'Groq/Mistral', description: "Mistral's high-quality sparse mixture-of-experts model", icon: Sparkles },
  { id: 'mistral-7b-instruct', name: 'Mistral 7B Instruct', provider: 'Groq/Mistral', description: "Mistral's fast 7B instruction-following model", icon: Sparkles }, 
];
// --- End Copied Model Definitions ---

export default function NewChatPage() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [greeting, setGreeting] = useState("")
  const { user, loading: authLoading } = useAuth(); // Get user and loading state
  const router = useRouter();
  const { setPromptSetter } = useContext(PromptPasteContext); // Use context to get setter registration function

  // --- Add state for model selection ---
  const [selectedModelId, setSelectedModelId] = useState<string>('gpt-4o-mini'); // Default model
  const [isModelSelectOpen, setIsModelSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Find the full model object based on the selected ID
  const selectedModel = AVAILABLE_MODELS.find(m => m.id === selectedModelId) || AVAILABLE_MODELS[0];

  // Filter models for the popup search
  const filteredModels = AVAILABLE_MODELS.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // --- End model selection state ---

  const userName = user?.displayName || "User"; // Simplified user name logic

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours()
      if (hour < 12) return "Good morning"
      if (hour < 18) return "Good afternoon"
      return "Good evening"
    }
    setGreeting(getGreeting());
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Register/Unregister the prompt setter with the context
  useEffect(() => {
    if (setPromptSetter) {
        setPromptSetter(setPrompt);
    }
    // Cleanup function to unregister when component unmounts
    return () => {
        if (setPromptSetter) {
            setPromptSetter(null); // Pass null or an empty function to indicate unregistration
        }
    };
  }, [setPromptSetter]); // Depend on the context function

  const handleSend = async () => {
    if (!prompt.trim() || isLoading || !user || !user.email) {
      console.error("User or user email is not available.");
      alert("Error: User email not found. Cannot save chat.");
      setIsLoading(false); // Ensure loading state is reset
      return; 
    }

    const currentPrompt = prompt.trim();
    setPrompt("");
    setIsLoading(true);

    // Construct the path to the user's specific chat collection
    const userChatsCollectionPath = `savedHistory/${user.email}/chats`;
    console.log("Target collection path:", userChatsCollectionPath);

    try {
        console.log("Attempting to create chat shell for:", user.email);
        // 1. Create the initial chat document WITHOUT the messages array
        const initialChatData = {
            userId: user.uid, // Keep userId for potential cross-referencing or rule flexibility
            title: currentPrompt.substring(0, 50),
            createdAt: serverTimestamp(),
        };
        console.log("Initial Chat Data:", initialChatData);

        // Use the dynamic path here
        const newChatRef = await addDoc(collection(db, userChatsCollectionPath), initialChatData);
        console.log("Chat shell created with ID:", newChatRef.id, "under", user.email);

        // 2. Update the new document to add the first message
        const firstMessage = {
            sender: "user",
            text: currentPrompt,
            timestamp: Timestamp.now()
        };
        console.log("Adding first message (client time):", firstMessage);
        await updateDoc(newChatRef, {
            messages: arrayUnion(firstMessage)
        });
        console.log("First message added successfully.");

        // 3. Redirect WITH the selected model ID to the new path within dashboard
        router.push(`/dashboard/chat/${newChatRef.id}?model=${selectedModelId}`);

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

  // --- Add model selection handler ---
  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
    setIsModelSelectOpen(false); // Close the dialog
    setSearchTerm(""); // Reset search term
  };
  // --- End model selection handler ---

  if (authLoading) {
      return <div className="flex h-full flex-grow items-center justify-center">Loading...</div>;
  }

  if (!user) {
      return <div className="flex h-full flex-grow items-center justify-center">Redirecting...</div>;
  }

  // Simplified UI Render
  return (
    // Main container - Added dark mode text/bg
    <div className="flex h-full flex-grow flex-col items-center justify-center p-6 space-y-10 bg-gray-50 dark:bg-gray-950">
      
      {/* 1. Greeting - Added dark mode text */}
      <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-gray-200">
        {greeting ? `${greeting}, ${userName}!` : `Hey there, ${userName}!`} 
      </h1>

      {/* 2. Input Box Section */} 
      <div className="w-full max-w-2xl mx-auto">
        {/* Input Box Container - Added dark mode bg/border */}
        <div className="w-full rounded-xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700/80 shadow-sm">
          <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Kira anything..."
              className="w-full p-4 rounded-t-xl resize-none focus:outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none bg-transparent text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              rows={3} 
          />
          {/* Input Controls - Added dark mode bg/border */} 
          <div className="flex items-center justify-between p-2 border-t border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-b-xl">
             {/* Left Controls - Added dark mode button styles */} 
             <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 w-8 h-8">
                  <Paperclip className="h-4 w-4" /> 
                </Button>
                <Dialog open={isModelSelectOpen} onOpenChange={setIsModelSelectOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 px-2 py-1 h-8">
                       {selectedModel.icon && <selectedModel.icon className="h-4 w-4 mr-1.5 text-blue-500"/>}
                       {selectedModel.name}
                       {/* Optional: Add dropdown icon here if desired */}
                    </Button>
                  </DialogTrigger>
                  {/* Model Dialog Content - Add accessibility association */}
                  <DialogContent 
                    aria-labelledby="model-select-title"
                    className="sm:max-w-[600px] p-0 dark:bg-gray-800 dark:text-gray-100"
                   > 
                     <DialogHeader className="p-6 pb-4">
                       <DialogTitle id="model-select-title">Select Model</DialogTitle>
                     </DialogHeader>
                     {/* Add Search Input and Model List Here */}
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
                       {filteredModels.length > 0 ? (
                         filteredModels.map((model) => (
                           <button 
                             key={model.id} 
                             onClick={() => handleModelSelect(model.id)}
                             className={cn(
                               "w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between",
                               selectedModelId === model.id && "bg-gray-100 dark:bg-gray-700"
                             )}
                           >
                             <div className="flex items-center space-x-3">
                               {model.icon && <model.icon className="h-5 w-5 text-gray-600 dark:text-gray-300 flex-shrink-0"/>}
                               <div>
                                 <div className="font-medium text-sm flex items-center">{model.name} {model.isPro && <Badge variant="outline" className="ml-2 px-1.5 py-0 text-xs font-semibold border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400">PRO</Badge>}</div>
                                 <div className="text-xs text-gray-500 dark:text-gray-400">{model.description}</div>
                               </div>
                             </div>
                           </button>
                         ))
                       ) : (
                         <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">No models found.</p>
                       )}
                     </div>
                     {/* End Search Input and Model List */}
                  </DialogContent>
                </Dialog>
             </div>
             {/* Right Controls - Added dark mode button styles */} 
             <div>
               <Button 
                 onClick={handleSend} 
                 size="icon" 
                 className="bg-black hover:bg-gray-800 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900 rounded-lg w-8 h-8" 
                 disabled={isLoading || !prompt.trim()}
                 aria-label="Send message"
               >
                 {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} 
               </Button>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
}