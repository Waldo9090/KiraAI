"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/config"; // Import auth from your config file
import { GoogleAuthProvider, signInWithPopup, AuthError } from "firebase/auth";
import { useState } from 'react';
import { RefreshCw } from "lucide-react"; // For loading state

// Simple Google Icon SVG (replace with a better one if available)
const GoogleIcon = () => (
  <svg className="w-4 h-4 mr-2" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.53-4.18 7.22-10.36 7.22-17.65z"></path>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // User signed in successfully
      console.log("Google Sign-In successful:", result.user);
      // Redirect to dashboard
      router.push('/dashboard'); // Redirects to /dashboard, which then redirects to /new
    } catch (err) {
      const authError = err as AuthError;
      console.error("Google Sign-In Error:", authError);
      setError(`Sign-in failed: ${authError.message} (Code: ${authError.code})`);
      setIsLoading(false);
    }
    // No need to setIsLoading(false) on success, as the page will navigate away
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold mb-6">Login to Kira AI</h1>
        <Button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center"
          variant="outline"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> // Add loading spinner if needed
          ) : (
            <GoogleIcon />
          )}
          Continue with Google
        </Button>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
} 