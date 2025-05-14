import type React from "react"
import SharedNav from "../shared-nav"

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SharedNav />
      {children}
    </>
  )
}
