"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp, Timestamp, onSnapshot, collection } from "firebase/firestore";
import { Paperclip, Globe, Send, Sparkles, Settings2, RefreshCw, Copy, ThumbsUp, ThumbsDown, ArrowLeft, Search as SearchIcon, ChevronDown, Check } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Define message type specifically for Firestore data
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
  
  // Llama
  { id: 'llama3-70b-8192', name: 'Llama 3 70B', provider: 'Groq/Meta', description: "Meta's powerful Llama 3 model (70B parameters)", icon: Sparkles },
  { id: 'llama3-8b-8192', name: 'Llama 3 8B', provider: 'Groq/Meta', description: "Meta's efficient Llama 3 model (8B parameters)", icon: Sparkles },

  // Mistral
  { id: 'mixtral-8x7b-instruct', name: 'Mixtral 8x7B Instruct', provider: 'Groq/Mistral', description: "Mistral's high-quality sparse mixture-of-experts model", icon: Sparkles },
  { id: 'mistral-7b-instruct', name: 'Mistral 7B Instruct', provider: 'Groq/Mistral', description: "Mistral's fast 7B instruction-following model", icon: Sparkles }, 
];

export default function ChatPageClient() {
  const params = useParams();
  const chatId = params.chatId as string;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [messages, setMessages] = useState<FirestoreMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingChat, setIsFetchingChat] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [selectedModelId, setSelectedModelId] = useState<string>('gpt-4o-mini');
  const [isModelSelectOpen, setIsModelSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);

  const selectedModel = AVAILABLE_MODELS.find(m => m.id === selectedModelId) || AVAILABLE_MODELS[0];

  const filteredModels = AVAILABLE_MODELS.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userName = "User";
  const userAvatar = "/placeholder.svg?height=40&width=40";

  useEffect(() => {
    if (!user || !user.email || !chatId || !db) {
      console.log("Waiting for user, email, chatId, or db...");
      setIsFetchingChat(true);
      return;
    }

    console.log(`Setting up listener for chat ${chatId} under ${user.email}`);
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
  }, [chatId, user, router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!prompt.trim() || isLoading || !user || !user.email || !chatId || !db) {
      console.error("Cannot send message: Missing user, email, chatId, or db");
      return;
    }

    const userMessageText = prompt.trim();
    const userMessageForFirestore = {
      sender: "user",
      text: userMessageText,
      timestamp: Timestamp.now()
    };

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
      console.log(`Calling API with model: ${selectedModelId}`);
      const apiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: userMessageText,
          modelId: selectedModelId
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
        model: selectedModel.name,
        timestamp: Timestamp.now()
      };

      console.log("Adding AI message (client time) to:", chatDocPath);
      await updateDoc(chatDocRef, {
        messages: arrayUnion(aiMessageForFirestore)
      });

    } catch (error) {
      console.error("Error getting/saving AI response:", error);
      const errorResponseForFirestore = {
        sender: "ai",
        text: `Sorry, I encountered an error processing your request. ${error instanceof Error ? error.message : ''}`,
        model: "System",
        timestamp: Timestamp.now()
      };
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

  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
    setIsModelSelectOpen(false);
    setSearchTerm("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleRegenerate = async (originalUserPrompt: string, regenerationModelId: string, messageIndex: number) => {
    if (!db) {
      console.error("Cannot regenerate: db is not initialized");
      return;
    }

    console.log(`Regenerating response for message ${messageIndex} using model: ${regenerationModelId}`);
    setIsLoading(true);

    try {
      const apiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: originalUserPrompt,
          modelId: regenerationModelId
        }),
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
            console.log("Firestore message updated successfully.");
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
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

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
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center p-4 border-b sticky top-0 bg-white z-10">
        <Link href="/dashboard/new" className="mr-4 p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <h1 className="text-lg font-medium truncate">{chatData?.title || "Chat"}</h1>
      </div>

      <div className="flex-grow overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto w-full space-y-4">
          {messages.map((msg, index) => (
            <div key={`${chatId}-${index}`} className="flex items-start gap-3 w-full">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                {msg.sender === 'user' ? (
                  <div className="w-full h-full bg-gray-200 rounded-full overflow-hidden">
                    <Image 
                      src={user.photoURL || userAvatar} 
                      alt={user.displayName || userName} 
                      width={32} 
                      height={32} 
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-blue-500"/>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex items-center text-sm font-medium mb-1">
                  {msg.sender === 'user' ? (user.displayName || userName) : (msg.model || "AI")}
                  {msg.sender === 'ai' && (
                    <span className="text-xs text-gray-500 font-normal ml-2">
                      • {msg.timestamp?.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) || '...'}
                    </span>
                  )}
                </div>

                <div className={`max-w-full p-0 rounded-lg`}>
                  <p className="text-base text-gray-800" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }}></p>

                  {msg.sender === 'ai' && (
                    <div className="flex items-center mt-2 pt-2 border-t border-gray-100">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-gray-500 hover:bg-gray-100"
                          onClick={() => handleCopy(msg.text, index)}
                        >
                          {copiedMessageIndex === index ? <Check className="h-4 w-4 text-green-600"/> : <Copy className="h-4 w-4"/>}
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:bg-gray-100 flex items-center">
                              <RefreshCw className="h-4 w-4"/>
                              <ChevronDown className="h-3 w-3 ml-0.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => handleRegenerate(messages[index - 1].text, selectedModelId, index - 1)}>
                              Regenerate (Current: {selectedModel.name})
                            </DropdownMenuItem>
                            {AVAILABLE_MODELS.map((model) => (
                              <DropdownMenuItem key={model.id} onClick={() => handleRegenerate(messages[index - 1].text, model.id, index - 1)}>
                                <div className="flex items-center justify-between w-full">
                                  <span className="flex items-center">
                                    {model.icon && <model.icon className="h-4 w-4 mr-2"/>} 
                                    {model.name}
                                  </span>
                                  {model.isPro && <Badge variant="outline" className="ml-2 px-1.5 py-0 text-xs font-semibold border-purple-600 text-purple-600">PRO</Badge>}
                                </div>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="flex gap-1 ml-auto">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:bg-gray-100"><ThumbsUp className="h-4 w-4"/></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:bg-gray-100"><ThumbsDown className="h-4 w-4"/></Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
          {isLoading && (
            <div className="py-2">
              <ChatMessageSkeleton />
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-gradient-to-t from-white via-white/90 to-transparent">
        <div className="relative w-full max-w-4xl mx-auto shadow-lg rounded-2xl border border-gray-200/80 bg-white">
          <Textarea 
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)} 
            onKeyDown={handleKeyDown} 
            placeholder="Type your prompt here..." 
            rows={1} 
            className="w-full p-4 pr-12 rounded-t-2xl resize-none focus:outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-base text-gray-900 bg-transparent"
          />
          <div className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm rounded-b-2xl">
            <div className="flex items-center space-x-4">
              <button className="p-1.5 hover:bg-gray-100 rounded-full"><Paperclip className="h-5 w-5 text-gray-500" /></button>
              <div className="flex items-center space-x-1 px-2 py-1 rounded-full hover:bg-gray-100 cursor-pointer"><Globe className="h-5 w-5 text-blue-500" /> <span className="text-sm">Web</span></div>
              
              <Dialog open={isModelSelectOpen} onOpenChange={setIsModelSelectOpen}>
                <DialogTrigger asChild>
                  <button className="flex items-center space-x-1 px-2 py-1 rounded-full hover:bg-gray-100 cursor-pointer">
                    {selectedModel.icon && <selectedModel.icon className="h-5 w-5 text-blue-500"/>}
                    <span className="text-sm">{selectedModel.name}</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] p-0">
                  <DialogHeader className="p-6 pb-4">
                    <DialogTitle>Select Model</DialogTitle>
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
                  <div className="max-h-[50vh] overflow-y-auto px-6 pb-6 space-y-2">
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
                        </button>
                      ))
                    ) : (
                      <p className="text-center text-sm text-gray-500 py-4">No models found.</p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Settings2 className="h-5 w-5 text-gray-500"/>
                <span className="text-sm text-gray-600">Kira Magic</span>
                <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer">
                  <div className="absolute inset-y-0 left-0 w-5 h-5 bg-white rounded-full shadow"></div>
                </div>
              </div>
              <Button 
                onClick={handleSend} 
                size="icon" 
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full w-8 h-8" 
                disabled={isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 