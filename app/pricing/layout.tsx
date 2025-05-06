import type React from "react"
import SharedNav from "../shared-nav"

export default function PricingLayout({
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
