"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';

interface ChatHistoryItem {
  id: string;
  title: string;
  createdAt: Timestamp;
}

// Define Props for the component
interface ChatHistorySidebarProps {
  selectedChatIds: string[];
  onSelectionChange: (chatId: string, isSelected: boolean) => void;
}

export default function ChatHistorySidebar({ selectedChatIds, onSelectionChange }: ChatHistorySidebarProps) {
  const { user, loading: authLoading } = useAuth();
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user || !user.email || !db) {
      setChatHistory([]);
      setIsLoadingHistory(false);
      return;
    }

    setIsLoadingHistory(true);
    const userChatsCollectionPath = `savedHistory/${user.email}/chats`;
    const chatsCollectionRef = collection(db, userChatsCollectionPath);

    // Query to get chats ordered by creation date, descending
    const q = query(chatsCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const history: ChatHistoryItem[] = [];
      querySnapshot.forEach((doc) => {
        // Ensure createdAt exists before pushing
        const data = doc.data();
        if (data.createdAt) {
             history.push({
               id: doc.id,
               title: data.title || 'Untitled Chat',
               createdAt: data.createdAt,
             });
        } else {
            console.warn("Chat document missing createdAt:", doc.id);
        }
      });
      setChatHistory(history);
      setIsLoadingHistory(false);
    }, (error) => {
      console.error("Error fetching chat history:", error);
      setIsLoadingHistory(false);
      // Optionally show an error state in the UI
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [user]); // Re-run when user changes

  // Skeleton Loader for Auth or History Loading
  const renderSkeletons = (count = 3) => (
    <div className="space-y-1 p-2">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3 w-full rounded" />
        </div>
      ))}
    </div>
  );

  if (authLoading || isLoadingHistory) {
    return renderSkeletons();
  }

  if (!user) {
    return null;
  }

  // New click handler function
  const handleChatClick = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  return (
    <ul className="flex w-full min-w-0 flex-col gap-1 p-2">
      {chatHistory.length === 0 && (
        <li>
          <div className="px-2 py-4 text-center text-xs text-gray-500">
            No chat history yet.
          </div>
        </li>
      )}
      {chatHistory.map((chat) => {
        const isActive = pathname === `/dashboard/chat/${chat.id}`;
        const chatTitle = chat.title && chat.title.trim() ? chat.title : 'Untitled';
        const isSelected = selectedChatIds.includes(chat.id);

        return (
          <li
            key={chat.id}
            className={cn(
              "flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition group",
              selectedChatIds.includes(chat.id) && "bg-gray-100 dark:bg-gray-800"
            )}
            onClick={() => handleChatClick(chat.id)}
          >
            <MessageSquare className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <span className="truncate flex-1 min-w-0 text-gray-900 dark:text-gray-100 text-base" title={chat.title}>
              {chat.title}
            </span>
          </li>
        );
      })}
    </ul>
  );
} 