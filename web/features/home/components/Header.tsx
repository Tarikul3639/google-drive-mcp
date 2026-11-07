"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Cable } from "lucide-react"

import { navItems } from "./constants"
import { ThemeToggle } from "./ThemeToggle"
import { authApi } from "@/features/shared/api/client"
import { readUserProfile } from "@/features/shared/api/normalize"

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
        className="flex items-center gap-3"
        href="/"
      >
        <span className="relative grid size-10 place-items-center rounded-[14px] bg-[#d5ed70] text-[#20231b] shadow-[0_5px_18px_-9px_#b0c746]">
          <Cable className="size-5" strokeWidth={1.8} />
          <span className="absolute -top-1 -right-1 size-2.5 rounded-full border-2 border-background bg-[#d37b5d]" />
        </span>
        <span className="font-serif text-[22px] leading-none tracking-[-0.06em]">
          drivebridge
        </span>
      </Link>

      <nav
        aria-label="Main navigation"
        className="hidden items-center gap-9 md:flex"
      >
        {navItems.map((item) => (
          <Link
            className="text-[13px] text-muted-foreground transition hover:text-foreground"
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        {signedIn === null ? (
          <span
            aria-label="Checking sign-in status"
            className="h-10 w-[132px] animate-pulse rounded-full bg-foreground/10"
          />
        ) : (
          <Link
            className="group flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-[12px] font-medium text-background transition hover:bg-[#46533a] sm:px-5"
            href={signedIn ? "/dashboard" : "/login"}
          >
            <span>{signedIn ? "Open workspace" : "Connect Drive"}</span>
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        )}
      </div>
    </header>
  )
}
