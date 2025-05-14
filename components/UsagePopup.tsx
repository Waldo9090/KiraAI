"use client";

import React from 'react';
import Link from 'next/link';
import { useUsage } from '@/context/UsageContext';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress";
import { Zap } from 'lucide-react';

export default function UsagePopup() {
  const { queriesRemaining, totalQueries } = useUsage();
  const usagePercentage = totalQueries > 0 ? (queriesRemaining / totalQueries) * 100 : 0;

  // TODO: Add logic for renewal time if needed
  const renewalText = "Renews soon"; // Placeholder

  return (
    <div className="w-72 rounded-lg bg-black p-6 text-white shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Usage</h3>
        <span className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-xs font-medium">
          <Zap className="mr-1 h-3 w-3 text-yellow-400" />
          Free
        </span>
      </div>

      <div className="mb-2">
        <span className="text-3xl font-bold">{queriesRemaining}</span>
        <span className="ml-2 text-xl font-medium text-gray-400">queries left</span>
      </div>

      <div className="mb-4">
        <span className="inline-block rounded-full bg-gray-700 px-3 py-1 text-xs">
          {renewalText} {/* Replace with dynamic renewal info later */}
        </span>
      </div>

      <p className="mb-5 text-sm text-gray-300">
        You can still send up to {queriesRemaining} more message{queriesRemaining !== 1 ? 's' : ''} today.
      </p>

      <div className="mb-1">
        <Progress value={usagePercentage} className="h-2 bg-gray-700 [&>*]:bg-yellow-400" />
      </div>
      <div className="mb-6 flex justify-between text-xs text-gray-400">
        <span>{totalQueries - queriesRemaining} Used</span>
        <span>{totalQueries} Total</span>
      </div>

      <Link href="/pricing" passHref>
        <Button className="w-full bg-white text-black hover:bg-gray-200">
          Upgrade to Pro
          <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </Button>
      </Link>
    </div>
  );
} 