"use client"

import { motion } from "motion/react"
import { Check } from "lucide-react"

const tools = ["Claude Desktop", "Cursor", "Your MCP client"]

// List example MCP-compatible clients supported by the connection flow.
export function ToolList() {
  return (
    <div className="mt-7 grid gap-2 sm:grid-cols-3">
      {tools.map((tool, index) => (
        <div
          key={tool}
          className="flex min-h-12 items-center gap-2.5 rounded-sm border border-border bg-card px-3"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="grid size-6 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary"
          >
            {tool.slice(0, 1)}
          </motion.span>
          <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
            {tool}
          </span>
          <Check className="size-3.5 shrink-0 text-primary" />
        </div>
      ))}
    </div>
  )
}
