"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp, Timestamp, onSnapshot, collection } from "firebase/firestore"; // Import Firestore functions, added collection
import { Paperclip, Globe, Send, Sparkles, Settings2, RefreshCw, Copy, ThumbsUp, ThumbsDown, ArrowDown, ArrowLeft, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils";
import ChatMessageSkeleton from "@/components/ChatMessageSkeleton";

// Define message type specifically for Firestore data
interface FirestoreMessage {
  sender: "user" | "ai";
  text: string;
  model?: string;
  timestamp: Timestamp; // Use Firestore Timestamp
}

interface ChatData {
    userId: string;
    title: string;
    createdAt: Timestamp;
    messages: FirestoreMessage[];
}

// --- Sample Model Definition ---
interface AIModel {
  id: string; // Identifier used for API calls
  name: string; // Display name
  provider: string; // e.g., OpenAI, Google, Anthropic
  description: string;
  icon?: React.ComponentType<{ className?: string }>; // Optional icon component
}

// NOTE: This list needs to correspond to models your BACKEND supports
const AVAILABLE_MODELS: AIModel[] = [
  // OpenAI
  { id: 'gpt-4o-mini', name: 'GPT 4o Mini', provider: 'OpenAI', description: "OpenAI's simple and fast text generation model", icon: Sparkles },
  { id: 'gpt-4.1-nano', name: 'GPT 4.1 Nano', provider: 'OpenAI', description: "OpenAI's fastest text generation model", icon: Sparkles },
  { id: 'gpt-4.1', name: 'GPT 4.1', provider: 'OpenAI', description: "OpenAI's flagship model for complex tasks", icon: Sparkles }, // Example from image

  // Google
  { id: 'gemini-1.5-flash-latest', name: 'Gemini 1.5 Flash', provider: 'Google', description: "Google's fast, multimodal model for general tasks", icon: Sparkles },
  { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro', provider: 'Google', description: "Google's most capable multimodal model", icon: Sparkles },
  // { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro', provider: 'Google', description: "Original Gemini Pro model", icon: Sparkles },

  // Anthropic
  { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'Anthropic', description: "Anthropic's fastest, most compact model", icon: Sparkles },
  { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', provider: 'Anthropic', description: "Balanced intelligence and speed", icon: Sparkles },
  { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'Anthropic', description: "Anthropic's most powerful model for complex tasks", icon: Sparkles },

  // Llama (Example: via Groq)
  { id: 'llama3-8b-8192', name: 'Llama 3 8B', provider: 'Groq/Meta', description: "Meta's efficient Llama 3 model (8B parameters)", icon: Sparkles },
  { id: 'llama3-70b-8192', name: 'Llama 3 70B', provider: 'Groq/Meta', description: "Meta's powerful Llama 3 model (70B parameters)", icon: Sparkles },

  // Mistral (Example: via Groq or Mistral AI)
  { id: 'mistral-7b-instruct', name: 'Mistral 7B Instruct', provider: 'Groq/Mistral', description: "Mistral's fast 7B instruction-following model", icon: Sparkles }, 
  { id: 'mixtral-8x7b-instruct', name: 'Mixtral 8x7B Instruct', provider: 'Groq/Mistral', description: "Mistral's high-quality sparse mixture-of-experts model", icon: Sparkles },
  // { id: 'mistral-large-latest', name: 'Mistral Large', provider: 'Mistral AI', description: "Mistral's top-tier reasoning model", icon: Sparkles }, // If using Mistral API directly

  // Grok (Example: via Groq - if available)
  { id: 'grok-1', name: 'Grok 1', provider: 'Groq/xAI', description: "xAI's model, focused on real-time information (via Groq)", icon: Sparkles },

];
// Add more models here as needed

export default function ChatPage() {
  const params = useParams();
  const chatId = params.chatId as string; // Get chat ID from route
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [messages, setMessages] = useState<FirestoreMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For sending new messages
  const [isFetchingChat, setIsFetchingChat] = useState(true); // For initial load
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- New State for Model Selection ---
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

  // Simulate User Info
  const userName = "User"; // Fallback
  const userAvatar = "/placeholder.svg?height=40&width=40";

  // Fetch initial chat data and listen for updates
  useEffect(() => {
    // Wait for user, email, and chatId
    if (!user || !user.email || !chatId) {
      console.log("Waiting for user, email, or chatId...");
      setIsFetchingChat(true); // Keep loading state until ready
      return;
    }

    console.log(`Setting up listener for chat ${chatId} under ${user.email}`);
    setIsFetchingChat(true);
    // Construct the correct path using the user's email and chatId
    const chatDocPath = `savedHistory/${user.email}/chats/${chatId}`;
    const chatDocRef = doc(db, chatDocPath);

    const unsubscribe = onSnapshot(chatDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as ChatData;
        // Security check: Ensure the logged-in user's UID matches the stored one
        // This is an extra layer on top of security rules
        if (data.userId === user.uid) {
          setChatData(data);
          setMessages(data.messages || []);
        } else {
          console.error("User UID mismatch for this chat.");
          router.push('/dashboard/new');
        }
      } else {
        console.error("Chat document not found at path:", chatDocPath);
        router.push('/dashboard/new');
      }
      setIsFetchingChat(false);
    }, (error) => {
        console.error("Error fetching chat data:", error);
        setIsFetchingChat(false);
    });

    return () => unsubscribe();

  }, [chatId, user, router]); // user object includes email, so it triggers re-run if needed

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending new messages within this specific chat
  const handleSend = async () => {
    if (!prompt.trim() || isLoading || !user || !user.email || !chatId) {
      console.error("Cannot send message: Missing user, email, or chatId");
      return;
    }

    const userMessageText = prompt.trim();
    const userMessageForFirestore = {
      sender: "user",
      text: userMessageText,
      timestamp: Timestamp.now()
    };

    // Construct the correct path again for updating
    const chatDocPath = `savedHistory/${user.email}/chats/${chatId}`;
    const chatDocRef = doc(db, chatDocPath);

    try {
      console.log("Adding user message (client time) to:", chatDocPath);
      await updateDoc(chatDocRef, {
          messages: arrayUnion(userMessageForFirestore)
      });
    } catch (error) {
        console.error("Error saving user message:", error);
        return;
    }

    setPrompt("");
    setIsLoading(true);

    try {
      console.log(`Calling API with model: ${selectedModelId}`); // Log selected model
      const apiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: userMessageText,
          modelId: selectedModelId // Send the selected model ID to backend
        }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || `API error! status: ${apiResponse.status}`);
      }

      const data = await apiResponse.json();
      const aiResponseText = data.response;

      const aiMessageForFirestore = {
        sender: "ai",
        text: aiResponseText,
        model: selectedModel.name, // Use the selected model's display name
        timestamp: Timestamp.now()
      };

      // Add AI response to Firestore using the same chatDocRef
      console.log("Adding AI message (client time) to:", chatDocPath);
      await updateDoc(chatDocRef, {
          messages: arrayUnion(aiMessageForFirestore)
      });

    } catch (error) {
      console.error("Error getting/saving AI response:", error);
       const errorResponseForFirestore = {
            sender: "ai",
            text: `Sorry, I encountered an error processing your request. ${error instanceof Error ? error.message : ''}`,
            model: "System", // Keep as system for errors
            timestamp: Timestamp.now()
       };
       // Attempt to add error message to Firestore
       try {
            await updateDoc(chatDocRef, {
                messages: arrayUnion(errorResponseForFirestore)
            });
       } catch (saveError) {
            console.error("Error saving error message:", saveError);
       }
    } finally {
      setIsLoading(false);
    }
  };

  // --- New function for model selection ---
  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
    setIsModelSelectOpen(false); // Close the dialog
    setSearchTerm(""); // Reset search term
  };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  // Render Loading/Content
  if (authLoading || isFetchingChat) {
     return <div className="flex flex-grow items-center justify-center">Loading Chat...</div>;
  }

  if (!user || !user.email) {
     // Should be handled by layout/redirect or initial useEffect
     console.log("Redirecting, user or email missing in render.");
     router.push('/login');
     return null;
  }

   if (!chatData) {
     return <div className="flex flex-grow items-center justify-center">Chat not found or access denied.</div>;
   }

  // Actual Chat View
  return (
     <div className="flex flex-col h-full bg-white">
       {/* Chat Page Header */}
       <div className="flex items-center p-4 border-b sticky top-0 bg-white z-10">
         <Link href="/dashboard/new" className="mr-4 p-2 rounded-full hover:bg-gray-100">
           <ArrowLeft className="h-5 w-5 text-gray-600" />
         </Link>
         <h1 className="text-lg font-medium truncate">{chatData?.title || "Chat"}</h1>
       </div>

       {/* Chat Messages Area - Centered with Max Width */}
       <div className="flex-grow overflow-y-auto p-6">
         {/* Inner container for max-width and centering */}
         <div className="max-w-3xl mx-auto w-full space-y-4">
           {messages.map((msg, index) => (
             // Each message is now a self-contained block
             <div key={`${chatId}-${index}`} className="flex items-start gap-3 w-full">
               {/* Avatar Column */}
               <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                 {msg.sender === 'user' ? (
                   <div className="w-full h-full bg-gray-200 rounded-full overflow-hidden">
                     <Image src={userAvatar} alt={user.displayName || userName} width={32} height={32} />
                   </div>
                 ) : (
                   <div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center">
                     <Sparkles className="w-5 h-5 text-blue-500"/>
                   </div>
                 )}
               </div>

               {/* Message Content Column */}
               <div className="flex-1 flex flex-col">
                  {/* Sender Name / Header */}
                  <div className="flex items-center text-sm font-medium mb-1">
                    {msg.sender === 'user' ? (user.displayName || userName) : (msg.model || "AI")}
                    {msg.sender === 'ai' && (
                      <span className="text-xs text-gray-500 font-normal ml-2">
                         • {msg.timestamp?.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) || '...'}
                      </span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-full p-0 rounded-lg`}>
                    {/* Message Text - Increased font size */}
                    <p className="text-base text-gray-800" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }}></p>

                    {/* AI Actions - Adjusted margin/padding */}
                    {msg.sender === 'ai' && (
                        <div className="flex items-center mt-2 pt-2 border-t border-gray-100">
                             <div className="flex gap-1">
                               <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:bg-gray-100"><Copy className="h-4 w-4"/></Button>
                               <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:bg-gray-100"><RefreshCw className="h-4 w-4"/></Button>
                             </div>
                             <div className="flex gap-1 ml-auto">
                               <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:bg-gray-100"><ThumbsUp className="h-4 w-4"/></Button>
                               <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:bg-gray-100"><ThumbsDown className="h-4 w-4"/></Button>
                             </div>
                        </div>
                    )}
                     {/* User Actions (Optional) - Add if needed, similar structure */}
                     {/* {msg.sender === 'user' && ( ... )} */} 
                  </div>
               </div>
             </div>
           ))}
           <div ref={chatEndRef} />
           {/* Loading indicator */}
           {isLoading && (
               <div className="py-2">
                 <ChatMessageSkeleton />
               </div>
           )}
         </div>
       </div>

       {/* Bottom Input Area - Updated */}
       <div className="p-4 border-t bg-white">
          <div className="relative w-full max-w-4xl mx-auto shadow-sm rounded-xl border bg-white">
            {/* Textarea */}
            <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type your prompt here..." rows={1} className="w-full p-4 pr-12 rounded-t-xl resize-none focus:outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"/>
            {/* Controls - Updated */}
            <div className="flex items-center justify-between p-3 border-t">
                {/* Left controls */}
                <div className="flex items-center space-x-4">
                     <button className="p-1.5 hover:bg-gray-100 rounded-full"><Paperclip className="h-5 w-5 text-gray-500" /></button>
                     <div className="flex items-center space-x-1 px-2 py-1 rounded-full hover:bg-gray-100 cursor-pointer"><Globe className="h-5 w-5 text-blue-500" /> <span className="text-sm">Web</span></div>
                     
                     {/* --- Model Selector Trigger --- */}
                     <Dialog open={isModelSelectOpen} onOpenChange={setIsModelSelectOpen}>
                       <DialogTrigger asChild>
                         <button className="flex items-center space-x-1 px-2 py-1 rounded-full hover:bg-gray-100 cursor-pointer">
                           {selectedModel.icon && <selectedModel.icon className="h-5 w-5 text-blue-500"/>}
                           <span className="text-sm">{selectedModel.name}</span>
                           {/* Optional: Add dropdown icon */}
                         </button>
                       </DialogTrigger>
                       <DialogContent className="sm:max-w-[600px] p-0">
                         <DialogHeader className="p-6 pb-4">
                           <DialogTitle>Select Model</DialogTitle>
                           {/* Optional: <DialogDescription>...</DialogDescription> */}
                         </DialogHeader>
                         <div className="px-6 pb-4">
                            <div className="relative">
                               <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                               <Input 
                                 type="search" 
                                 placeholder="Search models..." 
                                 className="pl-9" 
                                 value={searchTerm}
                                 onChange={(e) => setSearchTerm(e.target.value)}
                               />
                            </div>
                         </div>
                         {/* Model List - Add max height and overflow */}
                         <div className="max-h-[50vh] overflow-y-auto px-6 pb-6 space-y-2">
                           {/* Can add sections like Base Models / All Models if needed */}
                           {filteredModels.length > 0 ? (
                             filteredModels.map((model) => (
                               <button 
                                 key={model.id} 
                                 onClick={() => handleModelSelect(model.id)}
                                 className={cn(
                                   "w-full text-left p-3 rounded-lg hover:bg-gray-100 flex items-center justify-between",
                                   selectedModelId === model.id && "bg-gray-100"
                                 )}
                               >
                                 <div className="flex items-center space-x-3">
                                   {model.icon && <model.icon className="h-5 w-5 text-gray-600 flex-shrink-0"/>}
                                   <div>
                                     <div className="font-medium text-sm">{model.name}</div>
                                     <div className="text-xs text-gray-500">{model.description}</div>
                                   </div>
                                 </div>
                                 {/* Optional: Add cost/speed indicators like in the image */}
                               </button>
                             ))
                           ) : (
                             <p className="text-center text-sm text-gray-500 py-4">No models found.</p>
                           )}
                         </div>
                       </DialogContent>
                     </Dialog>
                     {/* --- End Model Selector --- */}
                     
                </div>
                {/* Right controls */}
                <div className="flex items-center space-x-4">
                     <div className="flex items-center space-x-2"><Settings2 className="h-5 w-5 text-gray-500"/><span className="text-sm text-gray-600">Kira Magic</span><div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer"><div className="absolute inset-y-0 left-0 w-5 h-5 bg-white rounded-full shadow"></div></div></div>
                     <Button onClick={handleSend} size="icon" className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full w-8 h-8" disabled={isLoading}><Send className="h-4 w-4" /></Button>
                 </div>
            </div>
           </div>
       </div>
     </div>
   );
} 