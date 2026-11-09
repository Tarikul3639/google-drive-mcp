"use client"

import Link from "next/link"
import { Cable, Settings2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/features/home/components/ThemeToggle"
import type { UserProfile } from "@/features/shared/types/api"

// Show the current workspace identity and account shortcut.
export function DashboardTopbar({
  user,
  onAccount,
}: {
  user: UserProfile
  onAccount: () => void
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur-xl sm:px-8">
      <Link className="flex items-center gap-2.5 lg:hidden" href="/">
        <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Cable className="size-4" />
        </span>
        <span className="font-serif text-xl tracking-tight">drivebridge</span>
      </Link>
      <p className="hidden font-mono text-xs tracking-widest text-muted-foreground lg:block">
        YOUR DRIVE, IN THE FLOW
      </p>
      <div className="ml-auto flex items-center gap-3">
        <ThemeToggle />
        <Button
          variant="ghost"
          className="h-auto gap-2 rounded-full border border-border py-1.5 pr-3 pl-1.5 text-left"
          onClick={onAccount}
          type="button"
        >
          <Avatar className="size-7">
            <AvatarImage src={user.picture ?? undefined} alt="" />
            <AvatarFallback className="bg-primary/10 text-xs text-primary">
              {user.name?.slice(0, 1) ?? user.email.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-36 truncate text-xs sm:inline">
            {user.name ?? user.email}
          </span>
          <Settings2 className="size-4 text-muted-foreground" />
        </Button>
      </div>
    </header>
  )
}
