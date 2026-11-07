"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
  Cable,
  ChevronDown,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  Settings2,
} from "lucide-react"

import { ThemeToggle } from "@/features/home/components/ThemeToggle"
import { authApi } from "@/features/shared/api/client"
import type { UserProfile } from "@/features/shared/types/api"

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Account", href: "/account", icon: CircleUserRound },
]

type DashboardShellProps = {
  children: React.ReactNode
  user: UserProfile
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  async function signOut() {
    setSigningOut(true)
    try {
      await authApi.logout()
    } catch {
      // Return to the public page even if the session already expired.
    } finally {
      router.replace("/")
    }
  }

  return (
    <div className="min-h-svh bg-[#f3f2ea] text-foreground dark:bg-[#171a16]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col bg-[#25291f] px-5 py-6 text-[#f5f4ed] lg:flex">
        <Link
          aria-label="Drivebridge home"
          className="flex items-center gap-3 px-2"
          href="/"
        >
          <span className="grid size-10 place-items-center rounded-[14px] bg-[#d5ed70] text-[#25291f]">
            <Cable className="size-5" />
          </span>
          <span className="font-serif text-[21px] tracking-[-0.06em]">
            drivebridge
          </span>
        </Link>

        <p className="mt-12 mb-3 px-3 font-mono text-[9px] tracking-[0.18em] text-white/40">
          WORKSPACE
        </p>
        <nav aria-label="Workspace navigation" className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[12px] transition ${active ? "bg-white/10 text-[#d5ed70]" : "text-white/65 hover:bg-white/5 hover:text-white"}`}
                href={item.href}
                key={item.href}
              >
                <Icon className="size-4" strokeWidth={1.7} /> {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto rounded-[18px] border border-white/10 bg-white/[0.04] p-4">
          <span className="font-mono text-[9px] tracking-[0.16em] text-[#c5d87b]">
            YOUR ACCESS
          </span>
          <p className="mt-2 text-[11px] leading-5 text-white/65">
            You can revoke your Drive connection whenever you need to.
          </p>
          <Link
            className="mt-3 inline-flex items-center gap-1 text-[10px] text-white/90 hover:text-[#d5ed70]"
            href="/account"
          >
            Manage account <ChevronDown className="size-3 -rotate-90" />
          </Link>
        </div>
      </aside>

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex h-[66px] items-center justify-between border-b border-foreground/[0.08] bg-background/90 px-5 backdrop-blur sm:px-8">
          <Link className="flex items-center gap-2.5 lg:hidden" href="/">
            <span className="grid size-8 place-items-center rounded-[11px] bg-[#d5ed70] text-[#25291f]">
              <Cable className="size-4" />
            </span>
            <span className="font-serif text-[19px] tracking-[-0.06em]">
              drivebridge
            </span>
          </Link>
          <p className="hidden font-mono text-[9px] tracking-[0.18em] text-muted-foreground lg:block">
            YOUR DRIVE, IN THE FLOW
          </p>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              className="flex items-center gap-2 rounded-full border border-foreground/10 py-1.5 pr-3 pl-1.5 text-left"
              onClick={() => router.push("/account")}
              type="button"
            >
              {user.picture ? (
                <img
                  alt=""
                  className="size-7 rounded-full object-cover"
                  src={user.picture}
                />
              ) : (
                <span className="grid size-7 place-items-center rounded-full bg-[#dce6c2] text-[10px] font-semibold text-[#4f6132] dark:bg-[#38442d] dark:text-[#d5ed70]">
                  {user.name?.slice(0, 1) ??
                    user.email.slice(0, 1).toUpperCase()}
                </span>
              )}
              <span className="hidden max-w-36 truncate text-[10px] sm:inline">
                {user.name ?? user.email}
              </span>
              <Settings2 className="size-3.5 text-muted-foreground" />
            </button>
          </div>
        </header>

        <nav
          aria-label="Workspace navigation"
          className="flex gap-2 overflow-x-auto border-b border-foreground/[0.08] bg-background px-5 py-2.5 lg:hidden"
        >
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[10px] ${pathname === item.href ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}
                href={item.href}
                key={item.href}
              >
                <Icon className="size-3.5" />
                {item.label}
              </Link>
            )
          })}
          <button
            className="ml-auto flex shrink-0 items-center gap-1.5 px-3 text-[10px] text-muted-foreground disabled:opacity-50"
            disabled={signingOut}
            onClick={signOut}
            type="button"
          >
            <LogOut className="size-3.5" /> Sign out
          </button>
        </nav>

        <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          {children}
        </main>
        <div className="hidden lg:fixed lg:bottom-5 lg:left-5 lg:block lg:w-[208px]">
          <button
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[11px] text-white/55 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
            disabled={signingOut}
            onClick={signOut}
            type="button"
          >
            <LogOut className="size-4" />{" "}
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  )
}
