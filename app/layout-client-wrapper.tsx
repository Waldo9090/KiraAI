"use client"

import React from "react"
import { usePathname } from 'next/navigation'
import SharedNav from "./shared-nav"

export default function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // Hide SharedNav if path starts with /chat or /dashboard
  const hideNav = pathname.startsWith('/chat') || pathname.startsWith('/dashboard');

  return (
    <>
      {!hideNav && <SharedNav />}
      {children}
    </>
  )
} 