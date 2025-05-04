"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp, Timestamp, onSnapshot, collection } from "firebase/firestore"; 
import { Paperclip, Globe, Send, Sparkles, Settings2, RefreshCw, Copy, ThumbsUp, ThumbsDown, ArrowDown, ArrowLeft, Search as SearchIcon, ChevronDown, Check, Edit3 } from "lucide-react";
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

export default function ChatPage() {
  const params = useParams();
  const chatId = params.chatId as string; 
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const { setPromptSetter, historyOpen, isPromptsOpen } = useContext(PromptPasteContext);

  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [messages, setMessages] = useState<FirestoreMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const [isFetchingChat, setIsFetchingChat] = useState(true); 
  const chatEndRef = useRef<HTMLDivElement>(null);

  // State to track if the initial prompt has been sent
  const [initialPromptSent, setInitialPromptSent] = useState(false);

  const [selectedModelId, setSelectedModelId] = useState<string>('gpt-4o-mini');
  const [isModelSelectOpen, setIsModelSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null); 

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
    if (!user || !user.email || !chatId) {
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

  const handleSend = async () => {
    if (!prompt.trim() || isLoading || !user || !user.email || !chatId) return;
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
  
  const handleRegenerate = async (originalUserPrompt: string, regenerationModelId: string, messageIndex: number) => {
    setIsLoading(true);
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
      const updatedAiMessage: FirestoreMessage = { sender: "ai", text: regeneratedResponseText, model: regenerationModel.name, timestamp: Timestamp.now() };
      const updatedMessages = [...messages];
      updatedMessages[messageIndex + 1] = updatedAiMessage;
      setMessages(updatedMessages);
      if (user?.email && chatId) {
        const chatDocPath = `savedHistory/${user.email}/chats/${chatId}`;
        const chatDocRef = doc(db, chatDocPath);
        const docSnap = await getDoc(chatDocRef);
        if (docSnap.exists()) {
          const chatData = docSnap.data() as ChatData;
          const firestoreMessages = chatData.messages || [];
          if (firestoreMessages[messageIndex + 1]?.sender === 'ai') {
            firestoreMessages[messageIndex + 1] = updatedAiMessage;
            await updateDoc(chatDocRef, { messages: firestoreMessages });
          }
        }
      }
    } catch (error) {
      console.error("Error regenerating AI response:", error);
    } finally {
      setIsLoading(false);
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
    if (!user || !user.email || !chatId || !chatData || !newTitle || newTitle === chatData.title) {
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
    if (isLoading || !user || !user.email || !chatId) return; // Basic guards
    
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

  if (authLoading || isFetchingChat) {
     return (
       <div className="flex flex-grow flex-col items-center justify-center p-6">
         <div className="w-full max-w-3xl space-y-4">
           <ChatMessageSkeleton />
           <ChatMessageSkeleton />
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
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      {/* --- Reintroduced Chat Page Header --- */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-950 z-10 h-16 flex-shrink-0">
        <div className="flex items-center min-w-0"> {/* Added min-w-0 for flex truncation */}
          {/* Display Title and Edit Button Triggering Dialog */}
          <Dialog open={isTitleDialogOpen} onOpenChange={setIsTitleDialogOpen}>
              <div className="flex items-center gap-2 group">
                <h1 className="text-lg font-medium truncate min-w-0" title={chatData?.title || "Chat"}>
                  {chatData?.title || "Chat"}
                </h1>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setDialogEditableTitle(chatData?.title || "")} // Set title on dialog open
                  >
                     <Edit3 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </div>
              
              {/* Dialog Content for Editing */}
              <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:text-gray-100">
                <DialogHeader>
                  <DialogTitle>Edit Chat Title</DialogTitle>
                  {/* <DialogDescription>Make changes to your chat title here. Click save when you're done.</DialogDescription> */}
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    id="chat-title-edit"
                    value={dialogEditableTitle}
                    onChange={(e) => setDialogEditableTitle(e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600"
                    maxLength={100}
                    onKeyDown={(e) => {if (e.key === 'Enter') {handleSaveTitleInDialog(); e.preventDefault();}}} // Save on Enter
                  />
                </div>
                <DialogFooter>
                   <DialogClose asChild>
                      <Button type="button" variant="secondary">Cancel</Button>
                   </DialogClose>
                  <Button type="button" onClick={handleSaveTitleInDialog}>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </div>
        {/* Optional: Add other header elements here if needed */}
      </div>
      {/* --- End Chat Page Header --- */}

      {/* Chat Messages Area - Remove h-full, let header and footer define height */}
      <div className="flex-grow overflow-y-auto p-6 pb-24">
        <div className="max-w-3xl mx-auto w-full space-y-4">
          {messages.map((msg, index) => (
            <div key={`${chatId}-${index}`} className="flex items-start gap-3 w-full">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                {msg.sender === 'user' ? (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <Image src={userAvatar} alt={userName} width={32} height={32} />
                  </div>
                ) : (
                  <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-blue-500"/>
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col">
                 <div className="flex items-center text-sm font-medium mb-1">
                   {msg.sender === 'user' ? (user.displayName || userName) : (msg.model || "AI")}
                   {msg.sender === 'ai' && (
                     <span className="text-xs text-gray-500 dark:text-gray-400 font-normal ml-2">
                        • {msg.timestamp?.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) || '...'}
                     </span>
                   )}
                 </div>
                 <div className={`max-w-full p-0 rounded-lg`}>
                   <p className="text-base text-gray-800 dark:text-gray-100" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }}></p>
                   {msg.sender === 'ai' && (
                       <div className="flex items-center mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex gap-2">
                                 <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => handleCopy(msg.text, index)}>
                                   {copiedMessageIndex === index ? <Check className="h-4 w-4 text-green-600"/> : <Copy className="h-4 w-4"/>}
                                 </Button>
                                 <DropdownMenu>
                                   <DropdownMenuTrigger asChild>
                                     <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center">
                                       <RefreshCw className="h-4 w-4"/>
                                       <ChevronDown className="h-3 w-3 ml-0.5" />
                                     </Button>
                                   </DropdownMenuTrigger>
                                   <DropdownMenuContent align="start" className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                                     <DropdownMenuItem onClick={() => handleRegenerate(messages[index - 1].text, selectedModelId, index - 1)} className="cursor-pointer hover:!bg-gray-700">
                                       Regenerate (Current: {selectedModel.name})
                                     </DropdownMenuItem>
                                     {AVAILABLE_MODELS.map((model) => (
                                       <DropdownMenuItem key={model.id} onClick={() => handleRegenerate(messages[index - 1].text, model.id, index - 1)} className="cursor-pointer hover:!bg-gray-700">
                                          <div className="flex items-center justify-between w-full">
                                             <span className="flex items-center">
                                               {model.icon && <model.icon className="h-4 w-4 mr-2"/>} 
                                               {model.name}
                                             </span>
                                             {model.isPro && <Badge variant="outline" className="ml-2 px-1.5 py-0 text-xs font-semibold border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400">PRO</Badge>}
                                          </div>
                                       </DropdownMenuItem>
                                     ))}
                                   </DropdownMenuContent>
                                 </DropdownMenu>
                                 <div className="flex gap-1 ml-auto">
                                   <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"><ThumbsUp className="h-4 w-4"/></Button>
                                   <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"><ThumbsDown className="h-4 w-4"/></Button>
                                 </div>
                            </div>
                       </div>
                   )}
                 </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
          {isLoading && ( <div className="py-2"><ChatMessageSkeleton /></div> )}
        </div>
      </div>

      {/* Fixed Input Area - Conditionally adjust right offset based on panel state */}
      <div className={cn(
         "fixed bottom-0 left-[240px] p-4 bg-gradient-to-t from-white dark:from-gray-950 via-white/90 dark:via-gray-950/90 to-transparent z-10 transition-[right] duration-300 ease-in-out",
         (historyOpen || isPromptsOpen) ? "right-[380px]" : "right-0"
         // The panel width is 380px, so we set right offset to that when a panel is open
      )}>
         <div className="relative w-full max-w-4xl mx-auto shadow-lg rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900">
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
                      {isLoading ? ( <span className="flex items-center justify-center w-5 h-5"><span className="animate-bounce inline-block w-2 h-2 bg-current rounded-full mr-1"></span><span className="animate-bounce inline-block w-2 h-2 bg-current rounded-full mr-1" style={{ animationDelay: '0.1s' }}></span><span className="animate-bounce inline-block w-2 h-2 bg-current rounded-full" style={{ animationDelay: '0.2s' }}></span></span> ) : <Send className="h-5 w-5" />}
                    </Button>
                </div>
           </div>
         </div>
      </div>
    </div>
  );
} 