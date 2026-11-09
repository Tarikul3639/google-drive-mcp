"use client"

import { motion } from "motion/react"
import type { LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

type Step = {
  number: string
  icon: LucideIcon
  title: string
  body: string
}

// Render one numbered explanation card in the how-it-works section.
export function HowItWorksStep({ step, index }: { step: Step; index: number }) {
  const Icon = step.icon
  const delay = index * 0.08
  const reveal = { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25, margin: "-8% 0px -8% 0px" }}
      transition={{ ...reveal, delay }}
      className="h-full"
    >
      <Card className="group h-full min-h-52 rounded-xl border-border bg-card transition-colors duration-300 hover:border-primary/50">
        <CardContent className="flex h-full flex-col justify-between p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ ...reveal, delay: delay + 0.05 }}
              className="font-mono text-xs text-muted-foreground"
            >
              /{step.number}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ ...reveal, delay: delay + 0.1 }}
              className="text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <Icon className="size-5" strokeWidth={1.6} />
            </motion.span>
          </div>
          <div className="mt-10">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ ...reveal, delay: delay + 0.12 }}
              className="font-serif text-xl tracking-tight text-foreground"
            >
              {step.title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ ...reveal, delay: delay + 0.18 }}
              className="mt-2 text-xs leading-relaxed text-muted-foreground"
            >
              {step.body}
            </motion.p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
