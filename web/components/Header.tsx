
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowUpRight, Cable } from "lucide-react"

import { navItems } from "../features/home/components/constants"
import { ThemeToggle } from "../features/home/components/ThemeToggle"
import { authApi } from "@/features/shared/api/client"
import { readUserProfile } from "@/features/shared/api/normalize"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function Header() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null)

  useEffect(() => {
    let active = true

    authApi
      .getProfile()
      .then(({ data }) => {
        if (active) setSignedIn(Boolean(readUserProfile(data)))
      })
      .catch(() => {
        if (active) setSignedIn(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <header className="relative z-20 mx-auto flex w-full max-w-360 items-center justify-between px-5 py-5 sm:px-8 lg:px-14 lg:py-7">
      <Link
        aria-label="Drivebridge home"
        className="group flex items-center gap-3"
        href="/"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative grid size-10 place-items-center rounded-md bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-105"
        >
          <Cable className="size-5" strokeWidth={1.8} />
          <span className="absolute -top-1 -right-1 size-2.5 rounded-full border-2 border-background bg-destructive" />
        </motion.span>

        <motion.span
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="font-serif text-[22px] leading-none font-black capitalize"
        >
          drivebridge
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
              className="text-[13px] text-muted-foreground transition-colors duration-200 hover:text-foreground"
              href={
                item.href.startsWith("#")
                  ? `/${item.href}`
                  : item.href
              }
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
        <ThemeToggle />

        {signedIn === null ? (
          <Skeleton
            aria-label="Checking sign-in status"
            className="h-10 w-33 rounded-full"
          />
        ) : (
          <Button
            asChild
            className="group h-10 rounded-full px-4 sm:px-5"
          >
            <Link href={signedIn ? "/dashboard" : "/login"}>
              <span>
                {signedIn ? "Open workspace" : "Connect Drive"}
              </span>
              <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Button>
        )}
      </div>
    </header>
  )
}
