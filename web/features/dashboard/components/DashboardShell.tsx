
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "motion/react"
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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Account", href: "/account", icon: CircleUserRound },
]

const scrollViewport = {
  once: false,
  amount: 0.2,
  margin: "-5% 0px -5% 0px",
} as const

const smoothReveal = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as const,
}

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  whileInView: { opacity: 1, y: 0 },
  viewport: scrollViewport,
}

type DashboardShellProps = {
  children: React.ReactNode
  user: UserProfile
}

export function DashboardShell({
  children,
  user,
}: DashboardShellProps) {
  const pathname = usePathname()
  const router = useRouter()

  const [signingOut, setSigningOut] = useState(false)

  async function signOut() {
    if (signingOut) return

    setSigningOut(true)

    try {
      await authApi.logout()
    } catch {
      // Session may already be expired.
    } finally {
      router.replace("/")
    }
  }

  return (
    <div className="min-h-svh overflow-x-clip bg-muted/30 text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col overflow-hidden bg-primary px-5 py-6 text-primary-foreground lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary-foreground/15 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 size-72 rounded-full bg-blue-400/20 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-1/3 -right-28 size-56 rounded-full bg-violet-400/15 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-1/3 size-48 rounded-full bg-cyan-300/10 blur-3xl"
        />

        <div className="relative z-10 flex h-full flex-col">
          <Link
            aria-label="Drivebridge home"
            className="flex items-center gap-3 px-2"
            href="/"
          >
            <motion.span
              {...fadeUp}
              transition={smoothReveal}
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-foreground/15"
            >
              <Cable className="size-5" />
            </motion.span>

            <motion.span
              {...fadeUp}
              transition={{ ...smoothReveal, delay: 0.05 }}
              className="font-serif text-2xl tracking-tight"
            >
              drivebridge
            </motion.span>
          </Link>

          <motion.p
            {...fadeUp}
            transition={{ ...smoothReveal, delay: 0.1 }}
            className="mb-3 mt-12 px-3 font-mono text-xs tracking-widest opacity-60"
          >
            WORKSPACE
          </motion.p>

          <nav
            aria-label="Workspace navigation"
            className="space-y-1"
          >
            {navItems.map((item, index) => {
              const Icon = item.icon
              const active = pathname === item.href

              return (
                <Link
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors duration-200 ${active
                      ? "bg-primary-foreground/15 text-primary-foreground"
                      : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    }`}
                  href={item.href}
                  key={item.href}
                >
                  <motion.span
                    {...fadeUp}
                    transition={{
                      ...smoothReveal,
                      delay: 0.12 + index * 0.06,
                    }}
                    className="flex items-center gap-3"
                  >
                    <Icon
                      className="size-4"
                      strokeWidth={1.7}
                    />
                    <span>{item.label}</span>
                  </motion.span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-4 backdrop-blur-sm">
            <motion.span
              {...fadeUp}
              transition={smoothReveal}
              className="block font-mono text-xs tracking-widest opacity-80"
            >
              YOUR ACCESS
            </motion.span>

            <motion.p
              {...fadeUp}
              transition={{ ...smoothReveal, delay: 0.05 }}
              className="mt-2 text-xs leading-5 text-primary-foreground/70"
            >
              You can revoke your Drive connection whenever you need to.
            </motion.p>

            <Link
              className="mt-3 inline-flex items-center gap-1 text-xs text-primary-foreground/90 transition-opacity hover:opacity-100"
              href="/account"
            >
              <motion.span
                {...fadeUp}
                transition={{ ...smoothReveal, delay: 0.1 }}
              >
                Manage account
              </motion.span>

              <ChevronDown className="size-3 -rotate-90" />
            </Link>
          </div>

          <Button
            variant="ghost"
            className="mt-5 w-full justify-start gap-3 rounded-xl px-3 py-3 text-left text-sm text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            disabled={signingOut}
            onClick={signOut}
            type="button"
          >
            <motion.span
              whileHover={{ rotate: -8 }}
              whileTap={{ scale: 0.9 }}
              className="inline-flex"
            >
              <LogOut className="size-4" />
            </motion.span>

            <motion.span
              {...fadeUp}
              transition={smoothReveal}
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </motion.span>
          </Button>
        </div>
      </aside>

      <div className="relative isolate min-h-svh lg:pl-64">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-20 -z-10 size-96 rounded-full bg-primary/16 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-[35%] -z-10 size-80 rounded-full bg-primary/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 bottom-10 -z-10 size-112 rounded-full bg-primary/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/3 top-[65%] -z-10 size-72 rounded-full bg-primary/5 blur-3xl"
        />

        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur-xl sm:px-8">
          <Link
            className="flex items-center gap-2.5 lg:hidden"
            href="/"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Cable className="size-4" />
            </span>

            <span className="font-serif text-xl tracking-tight">
              drivebridge
            </span>
          </Link>

          <motion.p
            {...fadeUp}
            transition={smoothReveal}
            className="hidden font-mono text-xs tracking-widest text-muted-foreground lg:block"
          >
            YOUR DRIVE, IN THE FLOW
          </motion.p>

          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />

            <Button
              variant="ghost"
              className="h-auto gap-2 rounded-full border border-border py-1.5 pl-1.5 pr-3 text-left"
              onClick={() => router.push("/account")}
              type="button"
            >
              <Avatar className="size-7">
                <AvatarImage
                  src={user.picture ?? undefined}
                  alt=""
                />

                <AvatarFallback className="bg-primary/10 text-xs text-primary">
                  {user.name?.slice(0, 1) ??
                    user.email.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <span className="hidden max-w-36 truncate text-xs sm:inline">
                {user.name ?? user.email}
              </span>

              <Settings2 className="size-4 text-muted-foreground" />
            </Button>
          </div>
        </header>

        <nav
          aria-label="Workspace navigation"
          className="flex gap-2 overflow-x-auto border-b border-border bg-background px-5 py-2.5 lg:hidden"
        >
          {navItems.map((item, index) => {
            const Icon = item.icon
            const active = pathname === item.href

            return (
              <Link
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs transition-colors ${active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                href={item.href}
                key={item.href}
              >
                <motion.span
                  {...fadeUp}
                  transition={{
                    ...smoothReveal,
                    delay: index * 0.05,
                  }}
                  className="flex items-center gap-2"
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </motion.span>
              </Link>
            )
          })}

          <Button
            variant="ghost"
            size="sm"
            className="ml-auto shrink-0 text-xs text-muted-foreground"
            disabled={signingOut}
            onClick={signOut}
            type="button"
          >
            <motion.span
              whileHover={{ rotate: -8 }}
              whileTap={{ scale: 0.9 }}
              className="inline-flex"
            >
              <LogOut className="size-4" />
            </motion.span>

            <span>
              {signingOut ? "Signing out…" : "Sign out"}
            </span>
          </Button>
        </nav>

        <main className="relative mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          {children}
        </main>
      </div>
    </div>
  )
}
