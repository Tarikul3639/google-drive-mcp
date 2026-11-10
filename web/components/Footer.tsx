"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { motion } from "motion/react"

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-14">
        {/* Logo */}
        <Link
          aria-label="Google Drive MCP home"
          className="group flex items-center gap-2.5"
          href="/"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative block size-9 shrink-0 overflow-hidden rounded-sm transition-transform duration-300 group-hover:scale-105 sm:size-9"
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
            <span className="whitespace-nowrap text-sm font-semibold tracking-[-0.7px] text-foreground sm:text-sm">
              Google Drive
            </span>

            <span className="whitespace-nowrap text-xs font-semibold tracking-[0.24em] text-primary sm:text-xs">
              MCP
            </span>
          </motion.span>
        </Link>

        {/* Author */}
        <div className="flex flex-col gap-1 sm:items-center">
          <p className="text-xs text-muted-foreground">
            Your files stay in your Drive. Your access stays in your hands.
          </p>

          <p className="text-xs text-muted-foreground">
            Built by{" "}
            <a
              href={siteConfig.author.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              {siteConfig.author.name ?? "Tarikul Islam"}
              <ArrowUpRight className="ml-0.5 inline size-3" />
            </a>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="rounded-full px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </Link>
          {/* Get Started */}
          <Button
          asChild
          variant="ghost"
          size="sm"
          className="group rounded-full"
        >
          <Link href="/login">
            Get started
            <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          </Button>
        </div>
      </div>
    </footer>
  )
}
