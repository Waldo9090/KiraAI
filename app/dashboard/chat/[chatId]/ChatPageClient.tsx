"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp, Timestamp, onSnapshot, collection, addDoc } from "firebase/firestore"; 
import { Paperclip, Globe, Send, Sparkles, Settings2, RefreshCw, Copy, ThumbsUp, ThumbsDown, ArrowDown, ArrowLeft, Search as SearchIcon, ChevronDown, Check, Edit3, X, Save, Bookmark } from "lucide-react";
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
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils";
import ChatMessageSkeleton from "@/components/ChatMessageSkeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { PromptPasteContext } from "@/app/dashboard/layout";

interface FirestoreMessage {
  sender: "user" | "ai";
  text: string;
  model?: string;
  timestamp: Timestamp; 
}

interface ChatData {
    userId: string;
    title: string;
    createdAt: Timestamp;
    messages: FirestoreMessage[];
}

interface AIModel {
  id: string; 
  name: string; 
  provider: string; 
  description: string;
  icon?: React.ComponentType<{ className?: string }>; 
  isPro?: boolean; 
}

const AVAILABLE_MODELS: AIModel[] = [
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', description: "Google's most advanced model", icon: Sparkles },
  { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro', provider: 'Google', description: "Google's most capable multimodal model", icon: Sparkles },
  { id: 'gemini-1.5-flash-latest', name: 'Gemini 1.5 Flash', provider: 'Google', description: "Google's fast, multimodal model for general tasks", icon: Sparkles },
  { id: 'claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', provider: 'Anthropic', description: "Anthropic's latest Sonnet model with PRO features", icon: Sparkles, isPro: true },
  { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'Anthropic', description: "Anthropic's most powerful model for complex tasks", icon: Sparkles },
  { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', provider: 'Anthropic', description: "Balanced intelligence and speed", icon: Sparkles },
  { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'Anthropic', description: "Anthropic's fastest, most compact model", icon: Sparkles },
  { id: 'gpt-4.1', name: 'GPT 4.1', provider: 'OpenAI', description: "OpenAI's flagship model for complex tasks", icon: Sparkles },
  { id: 'gpt-4o-mini', name: 'GPT 4o Mini', provider: 'OpenAI', description: "OpenAI's simple and fast text generation model", icon: Sparkles },
  { id: 'gpt-4.1-nano', name: 'GPT 4.1 Nano', provider: 'OpenAI', description: "OpenAI's fastest text generation model", icon: Sparkles },
  { id: 'grok-3', name: 'Grok 3', provider: 'xAI', description: "xAI's latest model (via API if available)", icon: Sparkles }, 
  { id: 'deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek', description: "DeepSeek R1 model (via API)", icon: Sparkles }, 
  { id: 'llama3-70b-8192', name: 'Llama 3 70B', provider: 'Groq/Meta', description: "Meta's powerful Llama 3 model (70B parameters)", icon: Sparkles },
  { id: 'llama3-8b-8192', name: 'Llama 3 8B', provider: 'Groq/Meta', description: "Meta's efficient Llama 3 model (8B parameters)", icon: Sparkles },
  { id: 'mixtral-8x7b-instruct', name: 'Mixtral 8x7B Instruct', provider: 'Groq/Mistral', description: "Mistral's high-quality sparse mixture-of-experts model", icon: Sparkles },
  { id: 'mistral-7b-instruct', name: 'Mistral 7B Instruct', provider: 'Groq/Mistral', description: "Mistral's fast 7B instruction-following model", icon: Sparkles }, 
];

interface SavedPrompt {
  id: string;
  prompt: string;
  createdAt?: Timestamp;
}

export default function ChatPageClient() {
  const params = useParams();
  const chatId = params.chatId as string; 
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const { setPromptSetter, historyOpen, isPromptsOpen, isToolsOpen } = useContext(PromptPasteContext);

  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [messages, setMessages] = useState<FirestoreMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const [isFetchingChat, setIsFetchingChat] = useState(true); 
  const [promptsVisible, setPromptsVisible] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // State to track if the initial prompt has been sent
  const [initialPromptSent, setInitialPromptSent] = useState(false);

  const [selectedModelId, setSelectedModelId] = useState<string>('gpt-4o-mini');
  const [isModelSelectOpen, setIsModelSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null); 
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null); // State for regenerating message

  // --- State for Feedback Form ---
  const [feedbackMessageIndex, setFeedbackMessageIndex] = useState<number | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<'up' | 'down' | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  // --- End Feedback State ---

  // --- State for Title Edit Dialog ---
  const [isTitleDialogOpen, setIsTitleDialogOpen] = useState(false);
  const [dialogEditableTitle, setDialogEditableTitle] = useState("");
  // --- End Dialog State ---

  const selectedModel = AVAILABLE_MODELS.find(m => m.id === selectedModelId) || AVAILABLE_MODELS[0];
  const filteredModels = AVAILABLE_MODELS.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userName = user?.displayName || "User";
  const userAvatar = user?.photoURL || "/placeholder.svg?height=40&width=40";

  useEffect(() => {
    const modelFromQuery = searchParams.get('model');
    if (modelFromQuery && AVAILABLE_MODELS.some(m => m.id === modelFromQuery)) {
      setSelectedModelId(modelFromQuery);
      console.log(`Initial model set from query: ${modelFromQuery}`);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user || !user.email || !chatId || !db) {
      setIsFetchingChat(true); 
      return;
    }
    setIsFetchingChat(true);
    const chatDocPath = `savedHistory/${user.email}/chats/${chatId}`;
    const chatDocRef = doc(db, chatDocPath);
    const unsubscribe = onSnapshot(chatDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as ChatData;
        if (data.userId === user.uid) {
          setChatData(data);
          setMessages(data.messages || []);
        } else {
          console.error("User UID mismatch for this chat.");
          router.push('/dashboard/new'); // Redirect to dashboard new
        }
      } else {
        console.error("Chat document not found at path:", chatDocPath);
        router.push('/dashboard/new'); // Redirect to dashboard new
      }
      setIsFetchingChat(false);
    }, (error) => {
        console.error("Error fetching chat data:", error);
        setIsFetchingChat(false);
    });
    return () => unsubscribe();
  }, [chatId, user, router]);

  // --- Effect to send initial prompt if needed ---
  useEffect(() => {
    if (!isFetchingChat && chatData && messages.length === 1 && messages[0].sender === 'user' && !initialPromptSent) {
      const initialUserPrompt = messages[0].text;
      const modelIdFromQuery = searchParams.get('model') || selectedModelId; // Use query param or state
      console.log(`Detected new chat. Sending initial prompt: "${initialUserPrompt}" with model: ${modelIdFromQuery}`);
      sendInitialPrompt(initialUserPrompt, modelIdFromQuery);
      setInitialPromptSent(true); // Mark as sent
    }
  // Run only when loading finishes, chatData is available, messages array changes, or initialPromptSent changes
  // Avoid dependency on selectedModelId directly here to prevent potential loops if model changes while sending
  }, [isFetchingChat, chatData, messages, initialPromptSent, searchParams]);
  // --- End Effect ---

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (setPromptSetter) {
        setPromptSetter(setPrompt);
    }
    return () => {
        if (setPromptSetter) {
            setPromptSetter(null); 
        }
    };
  }, [setPromptSetter]);

  // --- Effect for prompt visibility delay ---
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    if (!isFetchingChat && chatData && messages.length > 0) {
      // Start timer only after initial fetch is complete and there are messages
      timerId = setTimeout(() => {
        setPromptsVisible(true);
      }, 1500); // 1.5 second delay
    } else if (isFetchingChat) {
       // Reset visibility if we start fetching again (e.g., user changes)
       setPromptsVisible(false);
    }

    return () => {
      // Cleanup timer on unmount or if dependencies change before timeout
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  // Depend on isFetchingChat to trigger when loading finishes
  // Depend on chatData and messages length to ensure we have data before starting timer
  }, [isFetchingChat, chatData, messages]);
  // --- End Effect ---

  const handleSend = async () => {
    if (!prompt.trim() || isLoading || !user || !user.email || !chatId || !db) return;
    const userMessageText = prompt.trim();
    const userMessageForFirestore = { sender: "user", text: userMessageText, timestamp: Timestamp.now() };
    const chatDocPath = `savedHistory/${user.email}/chats/${chatId}`;
    const chatDocRef = doc(db, chatDocPath);
    try {
      await updateDoc(chatDocRef, { messages: arrayUnion(userMessageForFirestore) });
    } catch (error) {
      console.error("Error saving user message:", error); return;
    }
    setPrompt("");
    setIsLoading(true);
    try {
      const apiResponse = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessageText, modelId: selectedModelId }),
      });
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || `API error! status: ${apiResponse.status}`);
      }
      const data = await apiResponse.json();
      const aiResponseText = data.response;
      const aiMessageForFirestore = { sender: "ai", text: aiResponseText, model: selectedModel.name, timestamp: Timestamp.now() };
      await updateDoc(chatDocRef, { messages: arrayUnion(aiMessageForFirestore) });
    } catch (error) {
      console.error("Error getting/saving AI response:", error);
      const errorResponseForFirestore = { sender: "ai", text: `Sorry, I encountered an error processing your request. ${error instanceof Error ? error.message : ''}`, model: "System", timestamp: Timestamp.now() };
      try { await updateDoc(chatDocRef, { messages: arrayUnion(errorResponseForFirestore) }); } catch (saveError) { console.error("Error saving error message:", saveError); }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => { 
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); handleSend(); }
  };
  
  const handleModelSelect = (modelId: string) => { 
    setSelectedModelId(modelId); setIsModelSelectOpen(false); setSearchTerm(""); 
  };
  
  const handleRegenerate = async (originalUserPrompt: string, regenerationModelId: string, aiMessageIndex: number) => { // Target AI message index directly
    // Check if the index is valid and corresponds to an AI message
    if (aiMessageIndex <= 0 || aiMessageIndex >= messages.length || messages[aiMessageIndex].sender !== 'ai' || !db) {
        console.error("Invalid index or not an AI message for regeneration:", aiMessageIndex);
        return;
    }

    setRegeneratingIndex(aiMessageIndex); // Set loading state for the specific message
    setIsLoading(true); // Keep overall loading state for input disable etc.
    try {
      const apiResponse = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: originalUserPrompt, modelId: regenerationModelId }),
      });
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || `API error! status: ${apiResponse.status}`);
      }
      const data = await apiResponse.json();
      const regeneratedResponseText = data.response;
      const regenerationModel = AVAILABLE_MODELS.find(m => m.id === regenerationModelId) || { name: regenerationModelId };

      const updatedAiMessage: FirestoreMessage = {
        sender: "ai",
        text: regeneratedResponseText,
        model: regenerationModel.name,
        timestamp: Timestamp.now()
      };

      // Update the local state by replacing the message at the specific index
      setMessages(currentMessages => {
         const updated = [...currentMessages];
         updated[aiMessageIndex] = updatedAiMessage;
         return updated;
      });

      // Update Firestore
      if (user?.email && chatId) {
        const chatDocPath = `savedHistory/${user.email}/chats/${chatId}`;
        const chatDocRef = doc(db, chatDocPath);
        // Read the latest messages from Firestore to avoid race conditions if possible
        // Or simply update the specific message if structure allows (more complex)
        // For simplicity here, we'll update the whole array based on the *new* local state
        const updatedFirestoreMessages = messages.map((msg, index) => 
            index === aiMessageIndex ? updatedAiMessage : msg
        );
        await updateDoc(chatDocRef, { messages: updatedFirestoreMessages });
      }
    } catch (error) {
      console.error("Error regenerating AI response:", error);
      // Optionally update the message with an error indicator, or revert
    } finally {
      setIsLoading(false); // Clear overall loading state
      setRegeneratingIndex(null); // Clear specific message loading state
    }
  };
  
  const handleCopy = (text: string, index: number) => { 
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMessageIndex(index); 
      setTimeout(() => setCopiedMessageIndex(null), 1500); 
    }).catch(err => { console.error('Failed to copy text: ', err); });
  };

  // --- Dialog Title Save Handler ---
  const handleSaveTitleInDialog = async () => {
    const newTitle = dialogEditableTitle.trim();
    if (!user || !user.email || !chatId || !chatData || !newTitle || newTitle === chatData.title || !db) {
      setIsTitleDialogOpen(false); // Close if no change or invalid state
      return;
    }

    const chatDocPath = `savedHistory/${user.email}/chats/${chatId}`;
    const chatDocRef = doc(db, chatDocPath);

    try {
      await updateDoc(chatDocRef, { title: newTitle });
      setIsTitleDialogOpen(false); // Close dialog on success
    } catch (error) {
      console.error("Error updating chat title:", error);
      // Optionally show an error to the user (e.g., using a toast library)
      // Keep dialog open on error?
    }
  };
  // --- End Dialog Handler ---

  // --- Function to send the very first prompt automatically ---
  const sendInitialPrompt = async (initialPromptText: string, modelId: string) => {
    if (isLoading || !user || !user.email || !chatId || !db) return; // Basic guards
    
    setIsLoading(true);
    const chatDocPath = `savedHistory/${user.email}/chats/${chatId}`;
    const chatDocRef = doc(db, chatDocPath);
    const initialModel = AVAILABLE_MODELS.find(m => m.id === modelId) || AVAILABLE_MODELS[0];
    
    try {
      console.log(`Calling API for initial prompt with model: ${modelId}`);
      const apiResponse = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: initialPromptText, modelId: modelId }),
      });
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || `API error! status: ${apiResponse.status}`);
      }
      const data = await apiResponse.json();
      const aiResponseText = data.response;
      const aiMessageForFirestore = { sender: "ai", text: aiResponseText, model: initialModel.name, timestamp: Timestamp.now() };
      // Add AI response to Firestore 
      console.log("Adding initial AI message (client time) to:", chatDocPath);
      await updateDoc(chatDocRef, { messages: arrayUnion(aiMessageForFirestore) });
    } catch (error) {
      console.error("Error getting/saving initial AI response:", error);
      const errorResponseForFirestore = { sender: "ai", text: `Sorry, I encountered an error processing your initial request. ${error instanceof Error ? error.message : ''}`, model: "System", timestamp: Timestamp.now() };
      try { await updateDoc(chatDocRef, { messages: arrayUnion(errorResponseForFirestore) }); } catch (saveError) { console.error("Error saving initial error message:", saveError); }
    } finally {
      setIsLoading(false);
    }
  };
  // --- End Function --- 

  // --- Feedback Handlers ---
  const handleOpenFeedback = (index: number, rating: 'up' | 'down') => {
    console.log(`Opening feedback for message index: ${index}, rating: ${rating}`);
    setFeedbackMessageIndex(index);
    setFeedbackRating(rating);
    setFeedbackText(""); // Reset text when opening
    setIsSubmittingFeedback(false);
  };

  const handleCancelFeedback = () => {
    console.log("Cancelling feedback form");
    setFeedbackMessageIndex(null);
    setFeedbackRating(null);
    setFeedbackText("");
    setIsSubmittingFeedback(false);
  };

  const handleSubmitFeedback = async () => {
     if (feedbackMessageIndex === null || feedbackRating === null) return;
     console.log("Attempting to submit feedback...");
     setIsSubmittingFeedback(true);
     console.log("Submitting feedback data:", {
       chatId,
       messageIndex: feedbackMessageIndex,
       rating: feedbackRating,
       text: feedbackText,
       model: messages[feedbackMessageIndex]?.model || 'Unknown', // Get model from message
       messageText: messages[feedbackMessageIndex]?.text || 'Unknown', // Get message text
     });

     // --- TODO: Send feedback to API endpoint --- 
     // Placeholder for actual API call
     await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
     console.log("Simulated feedback submission complete.");
     setIsSubmittingFeedback(false);
     handleCancelFeedback(); // Close form
   };
  // --- End Feedback Handlers ---

  // --- Placeholder Handlers for User Message Actions ---
  const handleEditUserMessage = (index: number) => {
      console.log(`TODO: Implement edit for user message at index: ${index}`);
      // Complex: Would need UI for editing, state management, API call to update potentially, Firestore update
  };

  const handleSavePrompt = async (text: string, index: number) => {
      console.log(`TODO: Implement save prompt for user message at index: ${index}`, text);
      if (!user || !user.email || !db) {
          console.error("Cannot save prompt, user not logged in.");
          return; // Or show a message
      }

      const promptsCollectionPath = `savedHistory/${user.email}/prompts`;
      const promptsCollectionRef = collection(db, promptsCollectionPath);

      try {
          // addDoc automatically generates a unique ID
          const docRef = await addDoc(promptsCollectionRef, {
              prompt: text,
              createdAt: serverTimestamp() // Optional: track when it was saved
          });
          console.log("Prompt saved successfully with ID: ", docRef.id);
          // Optionally show a success toast/message to the user
      } catch (error) {
          console.error("Error saving prompt:", error);
          // Optionally show an error toast/message to the user
      }
  };
  // --- End Placeholder Handlers ---

  if (authLoading) {
     return (
       <div className="flex flex-col h-full">
         <div className="flex-1 overflow-y-auto p-4 space-y-4">
           <ChatMessageSkeleton />
           <ChatMessageSkeleton />
         </div>
         <div className="p-4 border-t">
           <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
         </div>
       </div>
     );
  }

  if (!user || !user.email) {
     console.log("Redirecting, user or email missing in render.");
     router.push('/login');
     return null;
  }

   if (!chatData) {
     return <div className="flex flex-grow items-center justify-center">Chat not found or access denied.</div>;
   }

  return (
    <div className={cn(
      "flex flex-col h-full transition-all duration-300 ease-in-out",
      historyOpen ? "md:mr-[380px]" : "mr-0",
      (isPromptsOpen || isToolsOpen) ? "md:ml-[380px]" : "ml-0"
    )}>
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto w-full space-y-4">
          {/* Initial Loading Skeletons */} 
          {!promptsVisible && messages.length > 0 && (
            messages.map((_, index) => (
               <ChatMessageSkeleton key={`skeleton-${index}`} />
            ))
          )}

          {/* Actual Messages */} 
          {promptsVisible && messages.map((msg, index) => (
            <div key={`${chatId}-${index}`} className="flex items-start gap-3 w-full">
              {/* Avatar */} 
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                {msg.sender === 'user' ? (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <Image src={userAvatar} alt={userName} width={32} height={32} />
                  </div>
                ) : (
                  <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                    {isLoading && !regeneratingIndex && index === messages.length -1 ? 
                       <Sparkles className="w-5 h-5 text-blue-500 animate-pulse-sparkle"/> 
                       : <Sparkles className="w-5 h-5 text-blue-500"/>
                    }
                  </div>
                )}
              </div>

              {/* Message Content Column */} 
              <div className="flex-1 flex flex-col">
                {/* Name/Model & Timestamp */} 
                <div className="flex items-center text-sm font-medium mb-1">
                  {msg.sender === 'user' ? (user.displayName || userName) : (msg.model || "AI")}
                  {msg.sender === 'ai' && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-normal ml-2">
                       • {msg.timestamp?.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) || '...'}
                    </span>
                  )}
                </div>

                {/* Message Bubble */} 
                {msg.sender === 'user' && (
                  <div className={`max-w-full p-0 rounded-lg group`}> 
                    <p className="text-base text-gray-800 dark:text-gray-100" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }}></p>
                    {/* User Action Buttons (Show on Hover) */} 
                    <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 dark:text-gray-400" onClick={() => handleCopy(msg.text, index)} title="Copy">
                         {copiedMessageIndex === index ? <Check className="h-4 w-4 text-green-600"/> : <Copy className="h-4 w-4"/>}
                       </Button>
                       <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 dark:text-gray-400" onClick={() => handleSavePrompt(msg.text, index)} title="Save as Prompt">
                         <Bookmark className="h-4 w-4"/> 
                       </Button>
                       <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 dark:text-gray-400" onClick={() => handleEditUserMessage(index)} title="Edit Prompt">
                         <Edit3 className="h-4 w-4"/>
                       </Button>
                    </div>
                  </div>
                )}

                {/* --- AI MESSAGE BUBBLE (or Skeleton) --- */} 
                {msg.sender === 'ai' && (
                  <> 
                    {regeneratingIndex === index ? (
                      <div className="py-2 w-full max-w-xs md:max-w-md lg:max-w-2xl">
                         <ChatMessageSkeleton />
                      </div>
                    ) : (
                      <div className={`max-w-full p-0 rounded-lg`}> 
                         <p className="text-base text-gray-800 dark:text-gray-100" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }}></p>
                         {/* AI Actions & Feedback */} 
                         <div className="flex flex-col mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                           {/* ... AI actions row ... */} 
                           <div className="flex gap-2 w-full items-center"> 
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => handleCopy(msg.text, index)} title="Copy">
                                 {copiedMessageIndex === index ? <Check className="h-4 w-4 text-green-600"/> : <Copy className="h-4 w-4"/>}
                              </Button>
                              {index > 0 && messages[index - 1]?.sender === 'user' && (
                                 <DropdownMenu> {/* ... Regen Dropdown ... */} </DropdownMenu>
                              )}
                              <div className="flex gap-1 ml-auto">
                                 <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => handleOpenFeedback(index, 'up')} disabled={feedbackMessageIndex === index} title="Good Response"><ThumbsUp className="h-4 w-4"/></Button>
                                 <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => handleOpenFeedback(index, 'down')} disabled={feedbackMessageIndex === index} title="Bad Response"><ThumbsDown className="h-4 w-4"/></Button>
                              </div>
                           </div>
                           {/* ... Feedback form ... */} 
                           {feedbackMessageIndex === index && (
                              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                 {/* --- Feedback form UI --- */}
                                 <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
                                   Provide additional feedback ({feedbackRating === 'up' ? 'positive' : 'negative'}):
                                 </p>
                                 <Textarea
                                   value={feedbackText}
                                   onChange={(e) => setFeedbackText(e.target.value)}
                                   placeholder="Tell us more..."
                                   rows={3}
                                   className="w-full text-sm mb-2 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
                                 />
                                 <div className="flex justify-end gap-2">
                                   <Button variant="ghost" size="sm" onClick={handleCancelFeedback} disabled={isSubmittingFeedback}>
                                     Cancel
                                   </Button>
                                   <Button size="sm" onClick={handleSubmitFeedback} disabled={isSubmittingFeedback || !feedbackText.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
                                     {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                                   </Button>
                                 </div>
                                 {/* --- End Feedback form UI --- */}
                              </div>
                            )}
                         </div>
                      </div>
                    )}
                  </>
                 )}
              </div>
            </div>
          ))}
          
          {/* --- Loading Placeholder for NEW AI Response --- */} 
          {isLoading && !regeneratingIndex && (
             <div key={`${chatId}-loading`} className="flex items-start gap-3 w-full group">
                {/* Animated AI Avatar */} 
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                   <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                       <Sparkles className="w-5 h-5 text-blue-500 animate-pulse-sparkle"/> {/* Added animation class */} 
                   </div>
                </div>
                {/* Placeholder Bubble */} 
                <div className="flex-1 flex flex-col">
                   <div className="flex items-center text-sm font-medium mb-1">
                      AI
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-normal ml-2">is thinking...</span>
                   </div>
                   <div className="py-2 w-full max-w-xs md:max-w-md">
                       <ChatMessageSkeleton /> {/* Use skeleton for the text part */} 
                   </div>
                </div>
             </div>
          )}
          {/* --- End Loading Placeholder --- */} 
          
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* --- Input Area MOVED here, inside scroll container --- */} 
      <div className={cn(
         "mt-6 w-full max-w-4xl mx-auto" // Removed fixed positioning, added margin-top 
      )}>
         <div className="relative shadow-lg rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900">
           <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type your prompt here..." rows={1} className="w-full p-4 pr-12 rounded-t-2xl resize-none focus:outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-base text-gray-900 dark:text-gray-100 bg-transparent dark:placeholder:text-gray-400"/>
           <div className="flex items-center justify-between p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-b-2xl">
               <div className="flex items-center space-x-4">
                    <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"><Paperclip className="h-5 w-5 text-gray-400 dark:text-gray-500" /></button>
                    <Dialog open={isModelSelectOpen} onOpenChange={setIsModelSelectOpen}>
                      <DialogTrigger asChild>
                        <button className="flex items-center space-x-1 px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                          {selectedModel.icon && <selectedModel.icon className="h-5 w-5 text-blue-500"/>}
                          <span className="text-sm dark:text-gray-300">{selectedModel.name}</span>
                        </button>
                      </DialogTrigger>
                      <DialogContent aria-labelledby="model-select-title" className="sm:max-w-[600px] p-0 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                        <DialogHeader className="p-6 pb-4">
                           <DialogTitle id="model-select-title">Select Model</DialogTitle>
                         </DialogHeader>
                         <div className="px-6 pb-4">
                            <div className="relative">
                               <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                               <Input type="search" placeholder="Search models..." className="pl-9 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                         </div>
                         <div className="max-h-[50vh] overflow-y-auto px-6 pb-6 space-y-2">
                           {filteredModels.map((model) => (
                             <button key={model.id} onClick={() => handleModelSelect(model.id)} className={cn("w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between", selectedModelId === model.id && "bg-gray-100 dark:bg-gray-700")}>
                               <div className="flex items-center space-x-3">
                                 {model.icon && <model.icon className="h-5 w-5 text-gray-600 dark:text-gray-300 flex-shrink-0"/>}
                                 <div>
                                   <div className="font-medium text-sm flex items-center">{model.name} {model.isPro && <Badge variant="outline" className="ml-2 px-1.5 py-0 text-xs font-semibold border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400">PRO</Badge>}</div>
                                   <div className="text-xs text-gray-500 dark:text-gray-400">{model.description}</div>
                                 </div>
                               </div>
                             </button>
                           ))}
                           {filteredModels.length === 0 && (<p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">No models found.</p>)}
                         </div>
                      </DialogContent>
                    </Dialog>
               </div>
               <div className="flex items-center space-x-4">
                    <Button onClick={handleSend} size="icon" className={cn("rounded-full w-10 h-10 transition", prompt.trim() ? "bg-black text-white hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 dark:text-gray-900" : "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-not-allowed")} disabled={isLoading || !prompt.trim()}>
                      {isLoading ? (
                        <span className="flex items-end justify-center w-5 h-5" aria-label="Loading...">
                          <span className="animate-scale-y inline-block w-1 h-4 bg-current rounded-full mr-1" style={{ animationDelay: '0s' }}></span>
                          <span className="animate-scale-y inline-block w-1 h-4 bg-current rounded-full mr-1" style={{ animationDelay: '0.2s' }}></span>
                          <span className="animate-scale-y inline-block w-1 h-4 bg-current rounded-full" style={{ animationDelay: '0.4s' }}></span>
                        </span>
                       ) : <Send className="h-5 w-5" />}
                    </Button>
                </div>
           </div>
         </div>
      </div>
      {/* --- End Input Area --- */}
    </div>
  );
} 