"use client"

import Link from "next/link"
import { CircleUserRound, LayoutDashboard, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"

const items = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Account", href: "/account", icon: CircleUserRound },
]

// Render the compact navigation bar used on smaller screens.
export function DashboardMobileNav({
  pathname,
  signingOut,
  onSignOut,
}: {
  pathname: string
  signingOut: boolean
  onSignOut: () => void
}) {
  return (
    <nav
      aria-label="Workspace navigation"
      className="flex w-full min-w-0 items-center gap-1 border-b border-border bg-background px-3 py-2 sm:gap-2 sm:px-6 lg:hidden"
    >
      {items.map((item) => {
        const Icon = item.icon
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-2.5 text-[11px] transition-colors sm:flex-none sm:gap-2 sm:px-4 sm:text-xs ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
          >
            <Icon className="size-4" /> {item.label}
          </Link>
        )
      })}
      <Button
        variant="ghost"
        size="sm"
        className="ml-auto shrink-0 px-2 text-[11px] text-muted-foreground sm:px-3 sm:text-xs"
        disabled={signingOut}
        onClick={onSignOut}
        type="button"
      >
        <LogOut className="size-4" />
        {signingOut ? "Signing out…" : "Sign out"}
      </Button>
    </nav>
  )
}
