"use client"

import { motion } from "motion/react"
import { ArrowRight, CircleHelp } from "lucide-react"

import type { UserProfile } from "@/features/shared/types/api"

// Render the dashboard title and link to the connection guide.
export function DashboardHeading({ user }: { user: UserProfile }) {
  return (
    <div className="mb-6 flex min-w-0 flex-col items-start justify-between gap-3 sm:mb-8 sm:flex-row sm:items-end sm:gap-4">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-xs tracking-wider text-primary"
        >
          YOUR WORKSPACE / OVERVIEW
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="mt-2 max-w-full wrap-break-word font-serif text-3xl leading-tight tracking-tight sm:mt-3 sm:text-5xl lg:text-6xl"
        >
          {user.name ? `Welcome, ${user.name.split(" ")[0]}.` : "Welcome back."}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-2 max-w-xl text-xs leading-5 text-muted-foreground sm:mt-3 sm:text-sm sm:leading-normal"
        >
          A simple place to manage the bridge to your Drive.
        </motion.p>
      </div>
      <motion.a
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="group flex items-center gap-2 rounded-full border border-foreground/10 px-4 py-2.5 text-xs text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
        href="#connection-help"
      >
        <CircleHelp className="size-4" />
        How it works
        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
      </motion.a>
    </div>
  )
}
