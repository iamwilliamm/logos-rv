"use client"

import { SessionProvider } from "next-auth/react"
import { SearchProvider } from "@/components/search/search-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SearchProvider>{children}</SearchProvider>
    </SessionProvider>
  )
}
