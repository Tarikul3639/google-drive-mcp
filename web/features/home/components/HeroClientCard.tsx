"use client"

import { AnimatePresence, motion } from "motion/react"
import { Check, Sparkles } from "lucide-react"

import { ease } from "./hero-data"

// Display the prompt and response inside the animated AI-client card.
export function HeroClientCard({
  step,
  tick,
  prompt,
  answer,
}: {
  step: number
  tick: number
  prompt: string
  answer: string
}) {
  return (
    <div
      className={`absolute top-0 left-[6%] z-10 flex h-[28%] w-[88%] flex-col rounded-2xl border bg-card p-3 shadow-xl transition-colors duration-500 sm:p-4 ${step === 0 || step === 5 ? "border-primary/40" : "border-border/80"}`}
    >
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary">
          <Sparkles className="size-4" />
        </span>
        <span className="text-xs font-semibold text-foreground">AI client</span>
        <span className="ml-auto font-mono text-[9px] text-muted-foreground">
          Claude · Cursor · any MCP client
        </span>
      </div>
      <div className="mt-2 flex flex-1 flex-col justify-center gap-1.5 overflow-hidden">
        <motion.div
          key={`p-${tick - step}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="ml-auto max-w-[85%] truncate rounded-xl rounded-br-sm bg-primary px-3 py-1.5 text-[11px] text-primary-foreground"
        >
          {prompt}
          {step === 0 ? (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="ml-0.5"
            >
              |
            </motion.span>
          ) : null}
        </motion.div>
        <div className="h-6">
          <AnimatePresence mode="wait">
            {step === 5 ? (
              <motion.div
                key="answer"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease }}
                className="flex max-w-[92%] items-center gap-1.5 rounded-xl rounded-bl-sm bg-muted px-3 py-1.5 text-[11px] text-foreground"
              >
                <Check className="size-3 shrink-0 text-primary" />
                <span className="truncate">{answer}</span>
              </motion.div>
            ) : step >= 1 ? (
              <motion.div
                key="thinking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex w-fit items-center gap-1 rounded-xl bg-muted px-3 py-2"
              >
                {[0, 1, 2].map((dot) => (
                  <motion.span
                    key={dot}
                    animate={{ opacity: [0.25, 1, 0.25] }}
                    transition={{
                      duration: 1,
                      delay: dot * 0.15,
                      repeat: Infinity,
                    }}
                    className="size-1 rounded-full bg-muted-foreground"
                  />
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
