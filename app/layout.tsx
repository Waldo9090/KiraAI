import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import LayoutClientWrapper from "./layout-client-wrapper"
import { ThemeProvider } from "next-themes"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ChatAI | AI Assistant for Research, Summarization, Math, and More",
  description: "Your AI assistant for everything. Prompt for answers, images, essays, etc.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <LayoutClientWrapper>{children}</LayoutClientWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
