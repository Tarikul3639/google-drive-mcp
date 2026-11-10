"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowUpRight } from "lucide-react"

import { navItems } from "../features/home/components/constants"
import { ThemeToggle } from "../features/home/components/ThemeToggle"
import { useLazyGetProfileQuery } from "@/features/auth/api/auth-api"
import { readUserProfile } from "@/features/shared/api/normalize"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Render the public header and switch to a slide-in sidebar on phones.
export function Header() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [getProfile] = useLazyGetProfileQuery()

  useEffect(() => {
    let active = true

    getProfile()
      .unwrap()
      .then((data) => {
        if (active) setSignedIn(Boolean(readUserProfile(data)))
      })
      .catch(() => {
        if (active) setSignedIn(false)
      })

    return () => {
      active = false
    }
  }, [getProfile])

  return (
    <header className="relative z-20 mx-auto flex w-full max-w-360 items-center justify-between px-5 py-5 sm:px-8 lg:px-14 lg:py-7">
      <Link
        aria-label="Google Drive MCP home"
        className="group flex items-center gap-2.5"
        href="/"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative block size-8 shrink-0 overflow-hidden rounded-sm transition-transform duration-300 group-hover:scale-105 sm:size-10"
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
          className="flex flex-col sm:leading-none"
        >
          <span className="whitespace-nowrap text-[17px] font-semibold tracking-[-0.7px] text-foreground sm:text-base">
            Google Drive
          </span>

          <span className="whitespace-nowrap text-[11px] font-semibold tracking-[0.24em] text-primary sm:text-xs">
            MCP
          </span>
        </motion.span>
      </Link>

      <nav
        aria-label="Main navigation"
        className="hidden items-center gap-9 md:flex"
      >
        {navItems.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: 0.08 + index * 0.05,
            }}
          >
            <Link
              className="text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground"
              href={item.href.startsWith("#") ? `/${item.href}` : item.href}
            >
              {item.label}
            </Link>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 + navItems.length * 0.05 }}
        >
          <Link
            href="/mcp/connect"
            className="text-[13px] text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            Connect
          </Link>
        </motion.div>
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden md:block">
          <ThemeToggle />
        </div>
        <div className="md:hidden">
          <SidebarTrigger
            aria-label="Open navigation"
            className="size-9 rounded-full border border-border md:hidden"
          />
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {signedIn === null ? (
            <Skeleton
              aria-label="Checking sign-in status"
              className="h-10 w-33 rounded-full"
            />
          ) : (
            <Button asChild className="group h-10 rounded-full px-4 sm:px-5">
              <Link href={signedIn ? "/dashboard" : "/login"}>
                <span>{signedIn ? "Open workspace" : "Connect Drive"}</span>
                <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
