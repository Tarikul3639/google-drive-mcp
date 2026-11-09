"use client"

import { motion } from "motion/react"
import { ArrowRight, Boxes } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// Illustrate the standard MCP path from Drivebridge to an AI client.
export function ToolConnectionCard() {
  const transition = { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const }
  return (
    <Card className="relative min-h-68 overflow-hidden rounded-xl border-0 bg-primary text-primary-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -bottom-24 size-72 rounded-full border border-primary-foreground/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-5 -bottom-10 size-48 rounded-full border border-primary-foreground/20"
      />
      <CardContent className="relative p-7 sm:p-9">
        <span className="block font-mono text-[10px] tracking-widest opacity-75">
          A SMALL BRIDGE, CLEARLY MARKED
        </span>
        <div className="mt-7 flex items-center gap-3">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.05 }}
            className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-foreground/15"
          >
            <Boxes className="size-5" />
          </motion.span>
          <ArrowRight className="size-4 opacity-40" />
          <Badge
            variant="outline"
            className="rounded-full border-primary-foreground/30 text-primary-foreground"
          >
            MCP
          </Badge>
          <ArrowRight className="size-4 opacity-40" />
          <Badge
            variant="outline"
            className="rounded-full border-primary-foreground/30 text-primary-foreground"
          >
            AI
          </Badge>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.12 }}
          className="mt-7 max-w-sm font-serif text-2xl leading-tight tracking-tight sm:text-3xl"
        >
          Your files move at the speed of a good question.
        </motion.p>
        <div className="mt-5">
          <Badge
            variant="secondary"
            className="rounded-full bg-primary-foreground/15 text-primary-foreground"
          >
            <span className="mr-2 size-1.5 rounded-full bg-primary-foreground" />
            STANDARD MCP CONNECTION
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
