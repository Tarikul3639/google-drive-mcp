"use client"

import Link from "next/link"
import { motion } from "motion/react"
import {
  ArrowUpRight,
  Cable,
  ChevronDown,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThemeSelector } from "@/features/home/components/ThemeSelector"
import type { UserProfile } from "@/features/shared/types/api"

const items = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Account", href: "/account", icon: CircleUserRound },
]

// Keep a compact icon rail on mobile and the full sidebar on desktop.
export function DashboardSidebar({
  pathname,
  user,
  signingOut,
  onSignOut,
}: {
  pathname: string
  user: UserProfile
  signingOut: boolean
  onSignOut: () => void
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-16 flex-col border-r border-border/70 bg-background text-foreground lg:w-64">
      <div className="flex items-center justify-center gap-3 border-b border-border/70 px-2 py-5 lg:justify-start lg:px-5">
        <Link href="/" className="group flex items-center gap-3">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105"
          >
            <Cable className="size-5" strokeWidth={1.8} />
          </motion.span>
          <span className="hidden font-serif text-[22px] font-black tracking-tight lg:inline">
            Drivebridge
          </span>
        </Link>
      </div>

      <div className="mx-4 mt-5 hidden rounded-xl border border-border/70 bg-muted/40 p-3 lg:block">
        <div className="flex items-center gap-2 text-xs font-medium text-foreground">
          <span className="size-2 rounded-full bg-emerald-500" />
          Your AI workspace
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          Manage your Google Drive connection and MCP access.
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-1 py-5 lg:px-3">
        <p className="mb-2 hidden px-3 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase lg:block">
          Workspace
        </p>
        <nav aria-label="Workspace navigation" className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={`flex h-10 items-center justify-center gap-3 rounded-lg px-1 text-[13px] transition-colors duration-200 lg:justify-start lg:px-3 ${
                  active
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-4" strokeWidth={1.8} />
                <span className="hidden lg:inline">{item.label}</span>
                {active ? (
                  <span className="ml-auto hidden size-1.5 rounded-full bg-primary lg:block" />
                ) : null}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto hidden rounded-xl border border-border/70 bg-muted/40 p-4 lg:block">
          <span className="block text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Your access
          </span>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            You can review or revoke your Drive connection whenever you need to.
          </p>
          <Link
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary transition-opacity hover:opacity-75"
            href="/account"
          >
            Manage account <ChevronDown className="size-3 -rotate-90" />
          </Link>
        </div>
      </div>

      <div className="border-t border-border/70 p-2 lg:p-3">
        <div className="hidden lg:block">
          <ThemeSelector />
        </div>
        <Link
          href="/account"
          aria-label="Account profile"
          className="flex min-w-0 items-center justify-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted lg:justify-start"
        >
          <Avatar className="size-9 shrink-0 border border-border">
            <AvatarImage src={user.picture ?? undefined} alt="" />
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {user.name?.slice(0, 1) ?? user.email.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden min-w-0 flex-1 lg:block">
            <span className="block truncate text-xs font-semibold">
              {user.name ?? "Your account"}
            </span>
            <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
              {user.email}
            </span>
          </span>
          <ArrowUpRight className="hidden size-4 shrink-0 text-muted-foreground lg:block" />
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Sign out"
          className="mt-1 w-full justify-center px-2 text-muted-foreground lg:justify-start lg:px-3"
          disabled={signingOut}
          onClick={onSignOut}
        >
          <LogOut className="size-4 shrink-0" />
          <span className="hidden lg:inline">
            {signingOut ? "Signing out…" : "Sign out"}
          </span>
        </Button>
      </div>
    </aside>
  )
}
