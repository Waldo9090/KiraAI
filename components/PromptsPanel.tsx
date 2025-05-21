"use client";

import React, { useState, useEffect, useContext } from "react";
import { X, FileText, Search as SearchIcon } from "lucide-react";
import { PromptPasteContext } from "@/app/dashboard/layout";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/config";
import { collection, query, onSnapshot, orderBy, Timestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const COMMUNITY_PROMPTS = [
  {
    title: "Summarize Any Article",
    text: "Summarize the following article in 5 bullet points, focusing on the main ideas and key takeaways. Use clear, concise language suitable for a general audience.",
    tags: ["summary", "reading"]
  },
  {
    title: "Email Reply Generator",
    text: "Write a polite and professional reply to the following email. Address all questions, maintain a positive tone, and keep the response under 150 words.",
    tags: ["email", "communication"]
  },
  {
    title: "Brainstorm Startup Ideas",
    text: "Generate 5 unique startup ideas in the field of health tech. For each, include a one-sentence description and the main problem it solves.",
    tags: ["brainstorm", "startup", "ideas"]
  },
  {
    title: "Explain Like I'm 5",
    text: "Explain the concept of blockchain technology as if I am a 5-year-old. Use simple analogies and avoid technical jargon.",
    tags: ["explain", "education", "simple"]
  },
  {
    title: "Personalized Workout Plan",
    text: "Create a 4-week beginner workout plan for someone who wants to get fit at home with no equipment. Include a weekly schedule and brief daily routines.",
    tags: ["fitness", "health", "plan"]
  },
  {
    title: "Travel Itinerary Planner",
    text: "Plan a 3-day itinerary for a first-time visitor to Tokyo, Japan. Include must-see attractions, local food recommendations, and tips for getting around.",
    tags: ["travel", "planning", "Japan"]
  },
  {
    title: "Job Interview Practice",
    text: "Act as an interviewer for a software engineering position. Ask me 3 technical questions and 2 behavioral questions, one at a time, and wait for my response after each.",
    tags: ["career", "interview", "practice"]
  },
  {
    title: "Recipe Generator",
    text: "Suggest a creative dinner recipe using only these ingredients: chicken breast, broccoli, garlic, and rice. Include step-by-step instructions and estimated cooking time.",
    tags: ["cooking", "recipe", "food"]
  },
  {
    title: "Social Media Post Writer",
    text: "Write a catchy LinkedIn post announcing a new product launch for a SaaS company. Highlight the main features and include a call to action.",
    tags: ["social media", "marketing", "writing"]
  },
  {
    title: "Daily Motivation",
    text: "Share an original, uplifting motivational quote to help someone start their day with positivity and confidence.",
    tags: ["motivation", "quote", "wellness"]
  }
];

interface SavedPrompt {
  id: string;
  prompt: string;
  createdAt?: Timestamp;
}

interface PromptsPanelProps {
  onClose?: () => void;
  isStandalonePage?: boolean;
}

export default function PromptsPanel({ onClose, isStandalonePage = false }: PromptsPanelProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"community" | "saved">("community");
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const { user } = useAuth();
  const { pastePrompt } = useContext(PromptPasteContext);
  const router = useRouter();

  useEffect(() => {
    if (activeTab !== 'saved' || !user || !user.email) {
      setSavedPrompts([]);
      return;
    }

    setIsLoadingSaved(true);
    const promptsCollectionPath = `savedHistory/${user.email}/prompts`;
    const promptsCollectionRef = collection(db, promptsCollectionPath);
    const q = query(promptsCollectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPrompts: SavedPrompt[] = [];
      snapshot.forEach((doc) => {
        fetchedPrompts.push({ id: doc.id, ...doc.data() } as SavedPrompt);
      });
      setSavedPrompts(fetchedPrompts);
      setIsLoadingSaved(false);
    }, (error) => {
      console.error("Error fetching saved prompts:", error);
      setIsLoadingSaved(false);
    });

    return () => unsubscribe();

  }, [activeTab, user]);

  const filteredCommunityPrompts = COMMUNITY_PROMPTS.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.text.toLowerCase().includes(search.toLowerCase())
  );
  const filteredSavedPrompts = savedPrompts.filter(p =>
    p.prompt.toLowerCase().includes(search.toLowerCase())
  );

  const promptsToShow = activeTab === 'community' ? filteredCommunityPrompts : filteredSavedPrompts;
  const isLoading = activeTab === 'saved' && isLoadingSaved;

  const handlePromptClick = (promptText: string) => {
    // First paste the prompt using context
    pastePrompt(promptText);
    
    // Then navigate to chat if not already there
    const currentPath = window.location.pathname;
    if (!currentPath.startsWith('/chat')) {
      router.push('/chat');
    }
  };

  return (
    <div className={cn(
        "flex flex-col h-full bg-white w-[380px] border-r flex-shrink-0 dark:bg-gray-900 dark:border-gray-800",
        isStandalonePage && "some-other-classes-if-needed"
     )}>
      <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          <span className="text-base font-semibold text-gray-800 dark:text-white">Prompt Library</span>
        </div>
        {!isStandalonePage && onClose && (
           <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
             <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
           </button>
        )}
      </div>
      
      <div className="px-4 pt-3 pb-2 border-b dark:border-gray-800 sticky top-[65px] z-10 bg-white dark:bg-gray-900">
          <div className="flex gap-2">
              <Button 
                 variant={activeTab === 'community' ? "secondary" : "ghost"}
                 size="sm"
                 onClick={() => setActiveTab('community')}
              >
                  Community
              </Button>
              <Button 
                 variant={activeTab === 'saved' ? "secondary" : "ghost"}
                 size="sm"
                 onClick={() => setActiveTab('saved')}
              >
                  Saved
              </Button>
          </div>
      </div>

      <div className="p-4 pb-2 bg-white sticky top-[117px] z-10 dark:bg-gray-900">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'community' ? 'Community' : 'Saved'} Prompts`}
            className="w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:ring-indigo-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <ul className="flex-1 px-2 pb-4 divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto">
        {isLoading && (
            <li><div className="text-center text-gray-400 dark:text-gray-500 py-8">Loading saved prompts...</div></li>
        )}
        {!isLoading && promptsToShow.length === 0 && (
          <li>
            <div className="text-center text-gray-400 dark:text-gray-500 py-8">No {activeTab} prompts found.</div>
          </li>
        )}
        {!isLoading && activeTab === 'community' && filteredCommunityPrompts.map((prompt, idx) => (
          <li key={`comm-${idx}`}>
            <button
              className="w-full text-left py-4 px-2 focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-800 transition rounded-none"
              onClick={() => handlePromptClick(prompt.text)}
            >
              <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-base">{prompt.title}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 leading-snug">{prompt.text}</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {prompt.tags.map(tag => (
                  <span key={tag} className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-[10px] px-2 py-0.5 rounded-full">#{tag}</span>
                ))}
              </div>
            </button>
          </li>
        ))}
        {!isLoading && activeTab === 'saved' && filteredSavedPrompts.map((prompt) => (
          <li key={prompt.id}>
             <button
               className="w-full text-left py-4 px-2 focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-800 transition rounded-none"
               onClick={() => handlePromptClick(prompt.prompt)}
               title={prompt.prompt}
             >
               <div className="text-sm text-gray-800 dark:text-gray-200 mb-1 leading-snug truncate">{prompt.prompt}</div>
             </button>
          </li>
        ))}
      </ul>
    </div>
  );
} 