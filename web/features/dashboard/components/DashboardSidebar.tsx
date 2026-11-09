"use client"

import Link from "next/link"
import { motion } from "motion/react"
import {
  Cable,
  ChevronDown,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const items = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Account", href: "/account", icon: CircleUserRound },
]

// Render the desktop workspace sidebar and its navigation.
export function DashboardSidebar({
  pathname,
  signingOut,
  onSignOut,
}: {
  pathname: string
  signingOut: boolean
  onSignOut: () => void
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col overflow-hidden bg-primary px-5 py-6 text-primary-foreground lg:flex">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-primary-foreground/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 size-72 rounded-full bg-blue-400/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 bottom-1/3 size-56 rounded-full bg-violet-400/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -left-20 size-48 rounded-full bg-cyan-300/10 blur-3xl"
      />

      <div className="relative z-10 flex h-full flex-col">
        <Link
          aria-label="Drivebridge home"
          className="flex items-center gap-3 px-2"
          href="/"
        >
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-foreground/15"
          >
            <Cable className="size-5" />
          </motion.span>
          <span className="font-serif text-2xl tracking-tight">
            drivebridge
          </span>
        </Link>

        <p className="mt-12 mb-3 px-3 font-mono text-xs tracking-widest opacity-60">
          WORKSPACE
        </p>
        <nav aria-label="Workspace navigation" className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors duration-200 ${active ? "bg-primary-foreground/15 text-primary-foreground" : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"}`}
              >
                <Icon className="size-4" strokeWidth={1.7} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-4 backdrop-blur-sm">
          <span className="block font-mono text-xs tracking-widest opacity-80">
            YOUR ACCESS
          </span>
          <p className="mt-2 text-xs leading-5 text-primary-foreground/70">
            You can revoke your Drive connection whenever you need to.
          </p>
          <Link
            className="mt-3 inline-flex items-center gap-1 text-xs text-primary-foreground/90 transition-opacity hover:opacity-100"
            href="/account"
          >
            Manage account <ChevronDown className="size-3 -rotate-90" />
          </Link>
        </div>

        <Button
          variant="ghost"
          className="mt-5 w-full justify-start gap-3 rounded-xl px-3 py-3 text-left text-sm text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
          disabled={signingOut}
          onClick={onSignOut}
          type="button"
        >
          <LogOut className="size-4" />
          {signingOut ? "Signing out…" : "Sign out"}
        </Button>
      </div>
    </aside>
  )
}
