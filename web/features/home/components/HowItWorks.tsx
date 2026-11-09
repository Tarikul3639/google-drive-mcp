"use client"

import { motion } from "motion/react"
import { KeyRound, Link2, Search } from "lucide-react"

import { HowItWorksStep } from "./HowItWorksStep"

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

const scrollViewport = {
  once: false,
  amount: 0.25,
  margin: "-8% 0px -8% 0px",
} as const

const smoothReveal = {
  duration: 0.65,
  ease: [0.22, 1, 0.36, 1] as const,
}

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: scrollViewport,
}

const fadeIn = {
  initial: { opacity: 0, y: 5 },
  whileInView: { opacity: 1, y: 0 },
  viewport: scrollViewport,
}

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-muted/40" id="how-it-works">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-14 lg:py-24">
        <div className="grid gap-9 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          {/* Section Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={scrollViewport}
            transition={{ ...smoothReveal, duration: 0.75 }}
            className="flex flex-col"
          >
            {/* Eyebrow */}
            <motion.span
              {...fadeIn}
              transition={smoothReveal}
              className="font-mono text-xs tracking-widest text-primary"
            >
              THREE SMALL STEPS
            </motion.span>

            {/* Heading */}
            <motion.h2
              {...fadeUp}
              transition={{ ...smoothReveal, delay: 0.05 }}
              className="mt-4 max-w-sm font-serif text-4xl leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Less hunting.
              <br />
              <span className="text-primary italic">More making.</span>
            </motion.h2>

            {/* Description */}
            <motion.p
              {...fadeUp}
              transition={{ ...smoothReveal, delay: 0.1 }}
              className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground"
            >
              A direct, understandable path from your files to the tools that
              help you work with them.
            </motion.p>
          </motion.div>

          {/* Steps */}
          <div className="grid gap-3 sm:grid-cols-3 lg:gap-4">
            {steps.map((step, index) => (
              <HowItWorksStep key={step.number} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
