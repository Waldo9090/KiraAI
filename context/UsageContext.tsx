"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

const MAX_FREE_QUERIES = 5; // Set the free query limit

interface UsageContextType {
  queriesRemaining: number;
  totalQueries: number;
  decrementQueryCount: () => void;
  resetQueryCount: () => void; // Optional: For renewal logic
}

const UsageContext = createContext<UsageContextType | undefined>(undefined);

export const UsageProvider = ({ children }: { children: ReactNode }) => {
  // TODO: Initialize from local storage or backend later for persistence
  const [queriesRemaining, setQueriesRemaining] = useState(MAX_FREE_QUERIES);
  const totalQueries = MAX_FREE_QUERIES;

  const decrementQueryCount = useCallback(() => {
    setQueriesRemaining((prev) => {
      const newVal = Math.max(0, prev - 1);
      // TODO: Persist newVal to local storage or backend
      console.log("Query count decremented. Remaining:", newVal); // For debugging
      return newVal;
    });
  }, []);

  const resetQueryCount = useCallback(() => {
    setQueriesRemaining(MAX_FREE_QUERIES);
     // TODO: Persist reset to local storage or backend
    console.log("Query count reset."); // For debugging
  }, []);

  // Add renewal logic here if needed (e.g., based on a timer)

  const value = {
    queriesRemaining,
    totalQueries,
    decrementQueryCount,
    resetQueryCount,
  };

  return (
    <UsageContext.Provider value={value}>
      {children}
    </UsageContext.Provider>
  );
};

export const useUsage = (): UsageContextType => {
  const context = useContext(UsageContext);
  if (context === undefined) {
    throw new Error('useUsage must be used within a UsageProvider');
  }
  return context;
}; 