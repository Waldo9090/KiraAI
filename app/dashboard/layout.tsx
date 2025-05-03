"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import {
  PlusCircle,
  History,
  MessageSquare,
  MoreHorizontal,
  LogOut,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import HistoryPanel from "@/components/HistoryPanel"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <SidebarProvider>
      <ResizablePanelGroup direction="horizontal" className="h-screen">
        <ResizablePanel defaultSize={20} minSize={15} className="flex">
          <Sidebar className="bg-white border-r flex-1">
            <SidebarHeader className="p-4">
              <Link href="/" className="flex items-center">
                <div className="h-10 w-10 mr-2">
                  <Image src="/logo.png" alt="Kira AI Logo" width={40} height={40} />
                </div>
                <span className="text-xl font-bold text-gray-900">Kira AI</span>
              </Link>
            </SidebarHeader>

            <SidebarContent className="px-3">
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link href="/dashboard/new" passHref legacyBehavior>
                    <SidebarMenuButton className="hover:bg-gray-100 active:bg-gray-200">
                      <PlusCircle className="h-5 w-5 mr-3 text-gray-700" />
                      <span>New</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                    className="hover:bg-gray-100 active:bg-gray-200"
                  >
                    <History className="h-5 w-5 mr-3 text-gray-700" />
                    <span>History</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <Link href="/dashboard/prompts" passHref legacyBehavior>
                    <SidebarMenuButton className="hover:bg-gray-100 active:bg-gray-200">
                      <MessageSquare className="h-5 w-5 mr-3 text-gray-700" />
                      <span>Prompts</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <Link href="/dashboard/more" passHref legacyBehavior>
                    <SidebarMenuButton className="hover:bg-gray-100 active:bg-gray-200">
                      <MoreHorizontal className="h-5 w-5 mr-3 text-gray-700" />
                      <span>Tools</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="p-4 mt-auto border-t">
              <Link href="/" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                  <Image src="/placeholder.svg?height=40&width=40" alt="User avatar" width={40} height={40} />
                </div>
                <div className="flex-1">
                  <div className="font-medium">User Profile</div>
                  <div className="text-xs text-gray-500">Back to Home</div>
                </div>
                <LogOut className="h-4 w-4 text-gray-400" />
              </Link>
            </SidebarFooter>
          </Sidebar>
          {isHistoryOpen && (
            <HistoryPanel onClose={() => setIsHistoryOpen(false)} />
          )}
        </ResizablePanel>

        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={isHistoryOpen ? 60 : 80}>
          <div className="h-full overflow-auto">
            {children}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </SidebarProvider>
  )
}
