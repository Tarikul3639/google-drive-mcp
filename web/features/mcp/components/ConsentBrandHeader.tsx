"use client"

import { motion } from "motion/react"
import { ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"

// Show the Drivebridge identity and access-request label.
export function ConsentBrandHeader() {
  return (
    <div className="flex items-center gap-2">
      <motion.span
        initial={{ opacity: 0, y: 3 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground"
      >
        <ShieldCheck className="size-4" />
      </motion.span>
      <motion.span
        initial={{ opacity: 0, y: 5 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="font-serif text-lg tracking-tight"
      >
        drivebridge
      </motion.span>
      <Badge
        variant="outline"
        className="ml-auto rounded-full px-2 py-0.5 font-mono text-[9px] tracking-wider text-muted-foreground"
      >
        ACCESS REQUEST
      </Badge>
    </div>
  )
}
