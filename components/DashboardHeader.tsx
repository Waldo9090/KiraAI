"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useUsage } from '@/context/UsageContext';
import UsagePopup from "@/components/UsagePopup";
import { Plus, Zap } from "lucide-react";

interface DashboardHeaderProps {
  pageTitle: string;
}

export default function DashboardHeader({ pageTitle }: DashboardHeaderProps) {
  const { queriesRemaining } = useUsage(); // Call useUsage here

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b dark:border-gray-800 h-16 flex-shrink-0 bg-white dark:bg-gray-950 sticky top-0 z-20">
      <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate" title={pageTitle}>{pageTitle}</span>
      <div className="flex items-center gap-4">
        {/* Usage Display & Popover Trigger */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="cursor-pointer">
              <Zap className="h-4 w-4 mr-1.5 text-yellow-500" />
              {queriesRemaining}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-transparent border-none shadow-none">
            <UsagePopup />
          </PopoverContent>
        </Popover>
        {/* End Usage Display */}
        <Link href="/dashboard/new" passHref>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            New Chat
          </Button>
        </Link>
      </div>
    </header>
  );
} 