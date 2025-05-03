import type React from "react"
import SharedNav from "../shared-nav"

export default function AffiliateLayout({
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
