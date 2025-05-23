"use client"

import { useState, useRef, useEffect, useContext } from "react"
import { useRouter, useSearchParams } from 'next/navigation'; // Import useRouter and useSearchParams
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import { Paperclip, Globe, Send, Sparkles, BarChart2, ImageIcon, Calculator, Search, FileText, Settings2, RefreshCw, Copy, ThumbsUp, ThumbsDown, ArrowDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { db } from "@/lib/firebase/config"; // Import db
import { collection, addDoc, serverTimestamp, updateDoc, arrayUnion, doc, Timestamp } from "firebase/firestore"; // Import Firestore functions and Timestamp
import { PromptPasteContext } from "./layout";

// Define message type
interface ChatMessage {
  id: number
  sender: "user" | "ai"
  text: string
  model?: string // e.g., "Gemini 2.5 Flash" or "GPT 4o Mini"
  timestamp?: any // Use Firestore Timestamp type later if needed, `any` for now
}

export default function NewChatPage() {
  const [prompt, setPrompt] = useState("")
  // const [messages, setMessages] = useState<ChatMessage[]>([]) // No longer needed here
  const [isChatStarted, setIsChatStarted] = useState(false) // Keep for conditional render logic initially
  const [isLoading, setIsLoading] = useState(false)
  const [greeting, setGreeting] = useState("")
  // const chatEndRef = useRef<HTMLDivElement>(null) // No longer needed here
  const { user, loading: authLoading } = useAuth(); // Get user and loading state
  const router = useRouter();
  const { setPromptSetter } = useContext(PromptPasteContext);
  const searchParams = useSearchParams();

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

  // Register prompt setter when component mounts
  useEffect(() => {
    setPromptSetter(setPrompt);
    return () => setPromptSetter(null);
  }, [setPromptSetter]);

  useEffect(() => {
    const initialPrompt = searchParams.get('initialPrompt');
    if (initialPrompt) setPrompt(initialPrompt);
  }, [searchParams]);

  const handleSend = async () => {
    if (!prompt.trim() || isLoading || !user || !user.email) {
      console.error("User or user email is not available.");
      alert("Error: User email not found. Cannot save chat.");
      setIsLoading(false); // Ensure loading state is reset
      return; 
    }
    if (!db) {
      console.error("Firestore instance (db) is not available.");
      setIsLoading(false);
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

        // 3. Redirect to the new dynamic chat page
        // The route itself doesn't contain the email, only the chatId
        router.push(`/dashboard/chat/${newChatRef.id}`);

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
            <div className="flex items-center justify-between p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl"> {/* Added dark mode bg/border and rounded-b */}
               {/* Left Controls - Simplified */}
               <div className="flex items-center space-x-4">
                  <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"> 
                     <Paperclip className="h-5 w-5 text-gray-500 dark:text-gray-400" /> 
                  </button>
                  {/* Web button removed */}
                  {/* GPT 4o Mini button removed */}
               </div>
               {/* Right Controls - Simplified */}
               <div className="flex items-center space-x-4">
                 {/* Kira Magic section removed */}
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