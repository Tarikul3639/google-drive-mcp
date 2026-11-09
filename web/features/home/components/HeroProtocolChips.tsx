"use client"

import { AnimatePresence, motion } from "motion/react"

import { ease } from "./hero-data"

// Show the tool invocation and HTTP response beside the MCP server.
export function HeroProtocolChips({
  step,
  tick,
  tool,
}: {
  step: number
  tick: number
  tool: string
}) {
  return (
    <>
      <div className="absolute top-[35%] left-[3%] z-10 flex h-[26%] w-[32%] items-center">
        <AnimatePresence>
          {step === 1 || step === 2 ? (
            <motion.div
              key={`tool-${tick}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              className="rounded-lg border border-border bg-card px-2.5 py-1.5 shadow-md"
            >
              <span className="block font-mono text-[8px] text-muted-foreground sm:text-[9px]">
                tools/call
              </span>
              <span className="mt-0.5 block truncate font-mono text-[9px] font-semibold text-primary sm:text-[10px]">
                {tool}
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="absolute top-[35%] right-[3%] z-10 flex h-[26%] w-[32%] items-center justify-end">
        <span className="rounded-md bg-primary/10 px-2 py-1 font-mono text-[9px] font-semibold text-primary">
          {step === 4 || step === 5 ? "200 OK" : "HTTP"}
        </span>
      </div>
    </>
  )
}
