import React, { useState } from "react";
import { X, History, Folder, Search, Trash2 } from "lucide-react";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/config";
import { doc, deleteDoc, writeBatch } from "firebase/firestore";

export default function HistoryPanel({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("Chats")
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();

  const handleSelectionChange = (chatId: string, isSelected: boolean) => {
    setSelectedChatIds(prevSelected =>
      isSelected
        ? [...prevSelected, chatId]
        : prevSelected.filter(id => id !== chatId)
    );
  };

  const handleDeleteSelected = async () => {
    if (!user || !user.email || selectedChatIds.length === 0) return;
    
    setIsDeleting(true);
    console.log(`Attempting to delete ${selectedChatIds.length} chats...`);

    const batch = writeBatch(db);
    const userChatsBasePath = `savedHistory/${user.email}/chats`;

    selectedChatIds.forEach(chatId => {
      const chatDocRef = doc(db, userChatsBasePath, chatId);
      batch.delete(chatDocRef);
    });

    try {
      await batch.commit();
      console.log("Selected chats deleted successfully.");
      setSelectedChatIds([]);
    } catch (error) {
      console.error("Error deleting selected chats:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelSelection = () => {
    setSelectedChatIds([]);
  };

  return (
    <div className="flex flex-col h-full bg-white w-[380px] border-l flex-shrink-0 dark:bg-gray-900 dark:border-gray-800">
      {/* Header - Make sticky */}
      <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white dark:bg-gray-900 dark:border-gray-800 z-10">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          <span className="text-base font-semibold text-gray-800 dark:text-white">History</span>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      {/* Content Area - Make scrollable */}
      <div className="flex-1 px-2 pb-4 flex flex-col overflow-y-auto">
        <div className="text-xs font-semibold text-gray-500 px-2 mb-2 mt-2">Folders</div>
        <div className="px-2 flex-1 flex flex-col">
          <div className="text-sm font-medium text-gray-700 mb-2">Chat History</div>
          <div className="flex-1 pr-1">
            <ChatHistorySidebar 
              selectedChatIds={selectedChatIds}
              onSelectionChange={handleSelectionChange}
            />
          </div>
        </div>
      </div>

      {selectedChatIds.length > 0 && (
        <div className="flex items-center justify-between p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {selectedChatIds.length} selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCancelSelection} disabled={isDeleting}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDeleteSelected} 
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
              ) : (
                <Trash2 className="h-4 w-4 mr-1.5" />
              )}
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 