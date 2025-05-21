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
import { PromptPasteContext } from "../layout";

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
      {/* ... Rest of the JSX ... */}
    </div>
  );
} 