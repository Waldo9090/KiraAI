import type React from "react"
import SharedNav from "../shared-nav"

export default function TeamsLayout({
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
