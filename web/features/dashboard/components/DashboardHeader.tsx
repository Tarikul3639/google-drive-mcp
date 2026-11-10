"use client"

import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"

// Keep dashboard branding and the mobile navigation trigger together.
export function DashboardHeader({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void
}) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/70 bg-background px-3 sm:hidden">
      <Link
        href="/"
        aria-label="Google Drive MCP home"
        className="group flex min-w-0 items-center gap-2.5"
      >
        <span className="relative block size-8 shrink-0 overflow-hidden rounded-sm transition-transform duration-300 group-hover:scale-105">
          <img
            src="/google-drive-mcp-logo.svg"
            alt=""
            className="size-full object-cover"
          />
        </span>
        <span className="flex min-w-0 flex-col leading-none">
          <span className="whitespace-nowrap text-sm font-semibold tracking-tight text-foreground">
            Google Drive
          </span>
          <span className="mt-1 whitespace-nowrap text-[10px] font-semibold tracking-[0.24em] text-primary">
            MCP
          </span>
        </span>
      </Link>

      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Open dashboard navigation"
        onClick={onOpenSidebar}
        className="size-9 rounded-lg border-border/70"
      >
        <Menu className="size-4" />
      </Button>
    </header>
  )
}
