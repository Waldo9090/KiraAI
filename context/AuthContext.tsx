"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, Auth } from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  photoURL: string | null;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, photoURL: null });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  useEffect(() => {
    // Only run auth state observer on the client side
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    // Skip if auth is not initialized (server-side or missing config)
    if (!firebaseAuth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      console.log("AuthContext: onAuthStateChanged fired. User:", currentUser);
      setUser(currentUser);
      setPhotoURL(currentUser?.photoURL || null);
      console.log("AuthContext: Setting authLoading to false.");
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, photoURL }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 