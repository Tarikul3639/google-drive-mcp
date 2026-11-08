
"use client"

import { motion } from "motion/react"
import { ArrowRight, Boxes, Check } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const toolNames = ["Claude Desktop", "Cursor", "Your MCP client"]

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

export function ToolBand() {
  return (
    <section
      className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-14 lg:py-24"
      id="for-your-tools"
    >
      {/* Connection Card */}
      <Card className="relative min-h-68 overflow-hidden rounded-xl border-0 bg-primary text-primary-foreground">

        {/* Decorative Circles */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -bottom-24 size-72 rounded-full border border-primary-foreground/20"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-5 -bottom-10 size-48 rounded-full border border-primary-foreground/20"
        />

        <CardContent className="relative p-7 sm:p-9">

          {/* Eyebrow */}
          <motion.span
            {...fadeIn}
            transition={smoothReveal}
            className="block font-mono text-[10px] tracking-widest opacity-75"
          >
            A SMALL BRIDGE, CLEARLY MARKED
          </motion.span>

          {/* MCP Flow */}
          <div className="mt-7 flex items-center gap-3">

            <motion.span
              {...fadeUp}
              transition={{ ...smoothReveal, delay: 0.05 }}
              className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-foreground/15"
            >
              <Boxes className="size-5" />
            </motion.span>

            <motion.span
              {...fadeIn}
              transition={{ ...smoothReveal, delay: 0.1 }}
            >
              <ArrowRight className="size-4 opacity-40" />
            </motion.span>

            <motion.span
              {...fadeUp}
              transition={{ ...smoothReveal, delay: 0.15 }}
            >
              <Badge
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground rounded-full"
              >
                MCP
              </Badge>
            </motion.span>

            <motion.span
              {...fadeIn}
              transition={{ ...smoothReveal, delay: 0.2 }}
            >
              <ArrowRight className="size-4 opacity-40" />
            </motion.span>

            <motion.span
              {...fadeUp}
              transition={{ ...smoothReveal, delay: 0.25 }}
            >
              <Badge
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground rounded-full"
              >
                AI
              </Badge>
            </motion.span>
          </div>

          {/* Main Heading */}
          <motion.p
            {...fadeUp}
            transition={{ ...smoothReveal, delay: 0.12 }}
            className="mt-7 max-w-sm font-serif text-2xl leading-tight tracking-tight sm:text-3xl"
          >
            Your files move at the speed of a good question.
          </motion.p>

          {/* Connection Badge */}
          <motion.div
            {...fadeIn}
            transition={{ ...smoothReveal, delay: 0.2 }}
            className="mt-5"
          >
            <Badge
              variant="secondary"
              className="rounded-full bg-primary-foreground/15 text-primary-foreground"
            >
              <span className="mr-2 size-1.5 rounded-full bg-primary-foreground" />
              STANDARD MCP CONNECTION
            </Badge>
          </motion.div>

        </CardContent>
      </Card>

      {/* Right Content */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={scrollViewport}
        transition={{ ...smoothReveal, duration: 0.75 }}
        className="flex flex-col justify-center"
      >
        {/* Eyebrow */}
        <motion.span
          {...fadeIn}
          transition={smoothReveal}
          className="font-mono text-xs tracking-widest text-primary"
        >
          MADE FOR YOUR TOOLBELT
        </motion.span>

        {/* Heading */}
        <motion.h2
          {...fadeUp}
          transition={{ ...smoothReveal, delay: 0.05 }}
          className="mt-4 max-w-lg font-serif text-4xl leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl"
        >
          Works where
          <br />

          <span className="text-primary italic">
            you already think.
          </span>
        </motion.h2>

        {/* Description */}
        <motion.p
          {...fadeUp}
          transition={{ ...smoothReveal, delay: 0.1 }}
          className="mt-5 max-w-md text-sm leading-6 text-muted-foreground"
        >
          Drivebridge uses the Model Context Protocol, so your files can meet
          assistants and editors that already speak MCP.
        </motion.p>

        {/* Tool List */}
        <div className="mt-7 grid gap-2 sm:grid-cols-3">
          {toolNames.map((tool, index) => (
            <div
              key={tool}
              className="flex min-h-12 items-center gap-2.5 rounded-sm border border-border bg-card px-3"
            >
              <motion.span
                {...fadeUp}
                transition={{
                  ...smoothReveal,
                  delay: index * 0.08,
                }}
                className="grid size-6 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary"
              >
                {tool.slice(0, 1)}
              </motion.span>

              <motion.span
                {...fadeUp}
                transition={{
                  ...smoothReveal,
                  delay: 0.05 + index * 0.08,
                }}
                className="min-w-0 flex-1 truncate text-xs font-medium text-foreground"
              >
                {tool}
              </motion.span>

              <motion.span
                {...fadeIn}
                transition={{
                  ...smoothReveal,
                  delay: 0.1 + index * 0.08,
                }}
                className="shrink-0 text-primary"
              >
                <Check className="size-3.5" />
              </motion.span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
