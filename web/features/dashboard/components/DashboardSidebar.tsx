"use client"

import Link from "next/link"
import { motion } from "motion/react"
import {
  ArrowUpRight,
  ChevronDown,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ThemeSelector } from "@/features/home/components/ThemeSelector"
import type { UserProfile } from "@/features/shared/types/api"

const items = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Account", href: "/account", icon: CircleUserRound },
]

// Reuse the same full dashboard navigation in the desktop sidebar and mobile drawer.
export function DashboardSidebar({
  pathname,
  user,
  signingOut,
  onSignOut,
  mobileOpen,
  onMobileOpenChange,
}: {
  pathname: string
  user: UserProfile
  signingOut: boolean
  onSignOut: () => void
  mobileOpen: boolean
  onMobileOpenChange: (open: boolean) => void
}) {
  const renderContent = () => (
    <>
      <div className="flex items-center gap-3 border-b border-border/70 px-5 py-5">
        <Link
          aria-label="Google Drive MCP home"
          className="group flex items-center gap-2.5"
          href="/"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative block size-10 shrink-0 overflow-hidden rounded-sm transition-transform duration-300 group-hover:scale-105"
          >
            <img
              src="/google-drive-mcp-logo.svg"
              alt=""
              className="size-full object-cover"
            />
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="flex flex-col leading-none"
          >
            <span className="whitespace-nowrap text-[17px] font-semibold tracking-[-0.7px] text-foreground">
              Google Drive
            </span>
            <span className="mt-1 whitespace-nowrap text-[11px] font-semibold tracking-[0.24em] text-primary">
              MCP
            </span>
          </motion.span>
        </Link>
      </div>

      <div className="mx-4 mt-5 rounded-xl border border-border/70 bg-muted/40 p-3">
        <div className="flex items-center gap-2 text-xs font-medium text-foreground">
          <span className="size-2 rounded-full bg-emerald-500" />
          Your AI workspace
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          Manage your Google Drive connection and MCP access.
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
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
                aria-current={active ? "page" : undefined}
                onClick={() => onMobileOpenChange(false)}
                className={`flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] transition-colors duration-200 ${
                  active
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-4" strokeWidth={1.8} />
                <span>{item.label}</span>
                {active ? (
                  <span className="ml-auto size-1.5 rounded-full bg-primary" />
                ) : null}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto rounded-xl border border-border/70 bg-muted/40 p-4">
          <span className="block text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Your access
          </span>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            You can review or revoke your Drive connection whenever you need to.
          </p>
          <Link
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary transition-opacity hover:opacity-75"
            href="/account"
            onClick={() => onMobileOpenChange(false)}
          >
            Manage account <ChevronDown className="size-3 -rotate-90" />
          </Link>
        </div>
      </div>

      <div className="border-t border-border/70 p-3">
        <ThemeSelector />
        <Link
          href="/account"
          aria-label="Account profile"
          onClick={() => onMobileOpenChange(false)}
          className="flex min-w-0 items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted"
        >
          <Avatar className="size-9 shrink-0 border border-border">
            <AvatarImage src={user.picture ?? undefined} alt="" />
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {user.name?.slice(0, 1) ?? user.email.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold">
              {user.name ?? "Your account"}
            </span>
            <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
              {user.email}
            </span>
          </span>
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Sign out"
          className="mt-1 w-full justify-start px-3 text-muted-foreground"
          disabled={signingOut}
          onClick={onSignOut}
        >
          <LogOut className="size-4 shrink-0" />
          {signingOut ? "Signing out…" : "Sign out"}
        </Button>
      </div>
    </>
  )

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-16 flex-col border-r border-border/70 bg-background text-foreground sm:flex lg:w-64">
        {renderContent()}
      </aside>

      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent
          side="left"
          className="w-64 max-w-[85vw] border-r border-border/70 bg-background p-0 text-foreground sm:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Dashboard navigation</SheetTitle>
            <SheetDescription>
              Navigate your Google Drive MCP workspace.
            </SheetDescription>
          </SheetHeader>
          <aside className="flex h-full w-full flex-col">{renderContent()}</aside>
        </SheetContent>
      </Sheet>
    </>
  )
}
