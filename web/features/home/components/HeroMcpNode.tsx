"use client"

import { motion } from "motion/react"

import { McpLogo } from "./HeroLogos"
import { mcpStatus } from "./hero-data"

// Display the MCP server node and its current protocol state.
export function HeroMcpNode({ step, tick }: { step: number; tick: number }) {
  const active = step >= 1
  return (
    <div className="absolute top-[35%] left-1/2 z-10 aspect-square w-[26%] -translate-x-1/2">
      <div
        className={`relative flex size-full flex-col items-center justify-center rounded-full border bg-card shadow-xl transition-colors duration-500 ${active ? "border-primary/60" : "border-border/80"}`}
      >
        {active ? (
          <motion.span
            key={`ripple-${tick}`}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.35, opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-primary"
          />
        ) : null}
        <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary sm:size-10">
          <McpLogo />
        </span>
        <span className="mt-1 text-[11px] font-semibold text-foreground sm:text-xs">
          MCP server
        </span>
        <span className="mt-0.5 font-mono text-[8px] text-muted-foreground sm:text-[9px]">
          {mcpStatus[step]}
        </span>
      </div>
    </div>
  )
}
