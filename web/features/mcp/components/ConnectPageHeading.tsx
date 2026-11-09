"use client"

import { motion } from "motion/react"
import { Server } from "lucide-react"

import { Badge } from "@/components/ui/badge"

// Introduce the MCP connection setup page.
export function ConnectPageHeading() {
  return (
    <header className="max-w-3xl space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <Badge
          variant="secondary"
          className="gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] tracking-widest"
        >
          <Server className="size-3" /> MCP CONNECTION
        </Badge>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="max-w-2xl font-serif text-4xl leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl"
      >
        Connect your AI client
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base"
      >
        Connect Drivebridge to your favorite MCP-compatible AI client using
        Streamable HTTP. Your Google Drive files will be available through a
        secure connection.
      </motion.p>
    </header>
  )
}
