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
      // Let the card use a little more vertical room on phones; fixed-height
      // desktop proportions were clipping the prompt and response at small widths.
      className={`absolute top-0 left-[2%] z-10 flex h-[32%] w-[96%] min-w-0 flex-col rounded-2xl border bg-card p-2 shadow-xl transition-colors duration-500 sm:left-[6%] sm:h-[28%] sm:w-[88%] sm:p-4 ${step === 0 || step === 5 ? "border-primary/40" : "border-border/80"}`}
    >
      <div className="flex min-w-0 shrink-0 items-center gap-2">
        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Sparkles className="size-4" />
        </span>
        <span className="shrink-0 text-xs font-semibold text-foreground">AI client</span>
        {/* Hide the long client list on narrow screens to preserve the card header. */}
        <span className="ml-auto hidden font-mono text-[9px] text-muted-foreground sm:inline">
          Claude · Cursor · any MCP client
        </span>
      </div>
      {/* Keep message content shrinkable and allow it to wrap instead of clipping. */}
      <div className="mt-1 flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-1 overflow-hidden sm:mt-2 sm:gap-1.5">
        <motion.div
          key={`p-${tick - step}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="ml-auto w-fit max-w-full whitespace-normal wrap-break-word rounded-xl rounded-br-sm bg-primary px-2.5 py-1 text-[10px] leading-4 text-primary-foreground sm:max-w-[85%] sm:px-3 sm:py-1.5 sm:text-[11px]"
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
        <div className="min-h-5 min-w-0">
          <AnimatePresence mode="wait">
            {step === 5 ? (
              <motion.div
                key="answer"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease }}
                className="flex w-fit max-w-full items-start gap-1.5 rounded-xl rounded-bl-sm bg-muted px-2.5 py-1 text-[10px] leading-4 text-foreground sm:px-3 sm:py-1.5 sm:text-[11px]"
              >
                <Check className="size-3 shrink-0 text-primary" />
                <span className="min-w-0 whitespace-normal wrap-break-word">{answer}</span>
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
