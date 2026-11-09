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
      className="flex gap-2 overflow-x-auto border-b border-border bg-background px-5 py-2.5 lg:hidden"
    >
      {items.map((item) => {
        const Icon = item.icon
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs transition-colors ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
          >
            <Icon className="size-4" /> {item.label}
          </Link>
        )
      })}
      <Button
        variant="ghost"
        size="sm"
        className="ml-auto shrink-0 text-xs text-muted-foreground"
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
