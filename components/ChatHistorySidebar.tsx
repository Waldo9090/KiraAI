"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSkeleton } from '@/components/ui/sidebar'; // Assuming sidebar components are available
import { MessageSquare } from 'lucide-react'; // Or another suitable icon
import { cn } from '@/lib/utils'; // For conditional classes

interface ChatHistoryItem {
  id: string;
  title: string;
  createdAt: Timestamp;
}

export default function ChatHistorySidebar() {
  const { user, loading: authLoading } = useAuth();
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const pathname = usePathname(); // To highlight the active chat

  useEffect(() => {
    if (!user || !user.email) {
      setIsLoadingHistory(false); // Stop loading if no user/email
      setChatHistory([]); // Clear history if user logs out
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

  // --- Render Logic ---

  if (authLoading) {
    // Show skeletons while auth is loading
    return (
      <SidebarMenu>
        {[...Array(3)].map((_, i) => (
          <SidebarMenuItem key={i}>
            <SidebarMenuSkeleton showIcon />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    );
  }

  if (isLoadingHistory) {
     // Show skeletons specifically for history loading
     return (
       <SidebarMenu>
         {[...Array(3)].map((_, i) => (
           <SidebarMenuItem key={i}>
             <SidebarMenuSkeleton showIcon />
           </SidebarMenuItem>
         ))}
       </SidebarMenu>
     );
  }

  if (!user) {
    return null; // Don't render history if not logged in
  }

  return (
    <SidebarMenu>
      {chatHistory.length === 0 && !isLoadingHistory && (
        <SidebarMenuItem>
          <div className="px-2 py-4 text-center text-xs text-gray-500">
            No chat history yet.
          </div>
        </SidebarMenuItem>
      )}
      {chatHistory.map((chat) => {
        const isActive = pathname === `/chat/${chat.id}`;
        // Fallback for missing/empty title
        const chatTitle = chat.title && chat.title.trim() ? chat.title : 'Untitled';
        return (
          <SidebarMenuItem key={chat.id}>
            <Link href={`/chat/${chat.id}`} passHref legacyBehavior>
              <SidebarMenuButton
                isActive={isActive}
                className={cn(
                  "hover:bg-gray-100 active:bg-gray-200 w-full justify-start",
                  isActive && "bg-gray-100 font-medium" // Example active style
                )}
                tooltip={chatTitle} // Show full title on hover when collapsed
              >
                <MessageSquare className="h-4 w-4 mr-3 flex-shrink-0 text-gray-600" />
                <span className="truncate text-xs">{chatTitle}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
} 