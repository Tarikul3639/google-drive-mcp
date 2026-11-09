"use client"

import { motion } from "motion/react"
import { ArrowRight, CircleHelp } from "lucide-react"

import type { UserProfile } from "@/features/shared/types/api"

// Render the dashboard title and link to the connection guide.
export function DashboardHeading({ user }: { user: UserProfile }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="font-mono text-xs tracking-wider text-primary"
        >
          YOUR WORKSPACE / OVERVIEW
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-3 font-serif text-4xl leading-none tracking-tight sm:text-5xl lg:text-6xl"
        >
          {user.name ? `Welcome, ${user.name.split(" ")[0]}.` : "Welcome back."}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-3 text-sm text-muted-foreground"
        >
          A simple place to manage the bridge to your Drive.
        </motion.p>
      </div>
      <motion.a
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
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
