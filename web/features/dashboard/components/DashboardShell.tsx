"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { useLogoutMutation } from "@/features/auth/api/auth-api"
import type { UserProfile } from "@/features/shared/types/api"

import { DashboardSidebar } from "./DashboardSidebar"
import { DashboardHeader } from "./DashboardHeader"

// Keep the workspace sidebar on the left at every screen size.
export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode
  user: UserProfile
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [logoutRequest] = useLogoutMutation()

  async function signOut() {
    if (signingOut) return
    setSigningOut(true)
    try {
      await logoutRequest().unwrap()
    } catch {
      // The server session may already have expired.
    } finally {
      router.replace("/")
    }
  }

  return (
    <div className="min-h-svh w-full min-w-0 overflow-x-clip bg-muted/30 text-foreground">
      <DashboardSidebar
        pathname={pathname}
        user={user}
        signingOut={signingOut}
        onSignOut={signOut}
        mobileOpen={mobileSidebarOpen}
        onMobileOpenChange={setMobileSidebarOpen}
      />

      <div className="relative isolate min-h-svh min-w-0 pl-0 lg:pl-64">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-20 -right-32 -z-10 size-96 rounded-full bg-primary/16 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[35%] -left-32 -z-10 size-80 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-10 -left-40 -z-10 size-112 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[65%] left-1/3 -z-10 size-72 rounded-full bg-primary/5 blur-3xl"
        />
        <DashboardHeader onOpenSidebar={() => setMobileSidebarOpen(true)} />
        <main className="relative mx-auto w-full max-w-7xl min-w-0 px-3 py-5 sm:px-6 sm:py-8 lg:px-10 lg:py-12">
          {children}
        </main>
      </div>
    </div>
  )
}
