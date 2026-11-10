"use client"

import { motion } from "motion/react"
import { ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { CardHeader, CardTitle } from "@/components/ui/card"

// Present the heading and short description for authorized MCP applications.
export function McpAccessHeader() {
  return (
    <CardHeader className="p-4 pb-0 sm:p-7 sm:pb-0">
      <div className="flex items-start gap-3">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: "-5% 0px -5% 0px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-primary/10 text-primary"
        >
          <ShieldCheck className="size-4" />
        </motion.span>
        <div className="min-w-0">
          <Badge
            variant="outline"
            className="font-mono text-xs tracking-wider text-primary"
          >
            AUTHORIZED APPS
          </Badge>
          <CardTitle className="mt-2 wrap-break-word font-serif text-xl tracking-tight sm:text-2xl">
            MCP client access
          </CardTitle>
          <p className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground sm:text-sm">
            Choose which tools each app can use. Revoke, restore, or permanently
            delete access.
          </p>
        </div>
      </div>
    </CardHeader>
  )
}
