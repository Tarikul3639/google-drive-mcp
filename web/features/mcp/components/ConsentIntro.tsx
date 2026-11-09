"use client"

import { motion } from "motion/react"

// Explain the permissions review before showing the requesting app.
export function ConsentIntro() {
  return (
    <div className="mt-5">
      <motion.p
        initial={{ opacity: 0, y: 5 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="font-mono text-[9px] tracking-widest text-primary"
      >
        MCP CLIENT PERMISSIONS
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 5 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mt-1.5 font-serif text-2xl tracking-tight"
      >
        Review access
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 5 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-1.5 text-xs leading-5 text-muted-foreground"
      >
        Check what this client can do with your Google Drive before you approve
        it.
      </motion.p>
    </div>
  )
}
