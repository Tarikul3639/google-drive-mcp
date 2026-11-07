"use client"

import { motion } from "motion/react"
import { ArrowRight, KeyRound, Link2, Search } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Link2,
    title: "Make the connection",
    body: "Sign in with Google and choose the Drive you want your tools to see.",
  },
  {
    number: "02",
    icon: KeyRound,
    title: "Keep the keys",
    body: "Your access stays yours. Revisit the connection or disconnect when you like.",
  },
  {
    number: "03",
    icon: Search,
    title: "Find the thread",
    body: "Ask your MCP-ready assistant for a file, a detail, or the context around it.",
  },
]

export function HowItWorks() {
  return (
    <section
      className="border-y border-foreground/[0.08] bg-[#f5f4ed] dark:bg-[#1b1e19]"
      id="how-it-works"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-14 lg:py-24">
        <div className="grid gap-9 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <span className="font-mono text-[10px] tracking-[0.19em] text-[#7b8e4b]">
              THREE SMALL STEPS
            </span>
            <h2 className="mt-4 max-w-sm font-serif text-[clamp(2.4rem,5vw,4.3rem)] leading-[0.98] tracking-[-0.065em]">
              Less hunting.
              <br />
              <span className="text-[#788852] italic dark:text-[#c5d87b]">
                More making.
              </span>
            </h2>
            <p className="mt-5 max-w-sm text-[13px] leading-6 text-muted-foreground">
              A direct, understandable path from your files to the tools that
              help you work with them.
            </p>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-3 lg:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.article
                  className="group relative flex min-h-[205px] flex-col justify-between rounded-[20px] border border-foreground/[0.09] bg-background p-5 transition-colors hover:border-[#a8b77b] sm:p-6"
                  initial={{ opacity: 0, y: 20 }}
                  key={step.number}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      /{step.number}
                    </span>
                    <Icon
                      className="size-[17px] text-[#7b8e4b] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-[#c5d87b]"
                      strokeWidth={1.6}
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-[20px] tracking-[-0.04em]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[11px] leading-[1.65] text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
