"use client"

import { motion } from "motion/react"

import { ToolConnectionCard } from "./ToolConnectionCard"
import { ToolList } from "./ToolList"

// Introduce MCP compatibility and the tools that can use the connection.
export function ToolBand() {
  const viewport = {
    once: false,
    amount: 0.25,
    margin: "-8% 0px -8% 0px",
  } as const
  const transition = { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <section
      className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-14 lg:py-24"
      id="for-your-tools"
    >
      <ToolConnectionCard />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ ...transition, duration: 0.75 }}
        className="flex flex-col justify-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="font-mono text-xs tracking-widest text-primary"
        >
          MADE FOR YOUR TOOLBELT
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.05 }}
          className="mt-4 max-w-lg font-serif text-4xl leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl"
        >
          Works where
          <br />
          <span className="text-primary italic">you already think.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.1 }}
          className="mt-5 max-w-md text-sm leading-6 text-muted-foreground"
        >
          Drivebridge uses the Model Context Protocol, so your files can meet
          assistants and editors that already speak MCP.
        </motion.p>
        <ToolList />
      </motion.div>
    </section>
  )
}
