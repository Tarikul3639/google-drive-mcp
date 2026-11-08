
"use client"

import { motion } from "motion/react"
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  FileSpreadsheet,
  FileText,
  Presentation,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { filePreviews } from "./constants"

const fileIcons = {
  document: FileText,
  sheet: FileSpreadsheet,
  slides: Presentation,
}

const smoothTransition = {
  duration: 0.65,
  ease: [0.22, 1, 0.36, 1] as const,
}

const viewportSettings = {
  once: false,
  amount: 0.2,
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: viewportSettings,
}

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  whileInView: { opacity: 1, y: 0 },
  viewport: viewportSettings,
}

export function Hero() {
  return (
    <section className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pt-12 pb-20 sm:px-8 sm:pt-16 lg:min-h-162.5 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:px-12 lg:pt-12 lg:pb-28">

      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 -left-24 size-72 rounded-full bg-primary/10 blur-3xl"
      />

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportSettings}
        transition={{ ...smoothTransition, duration: 0.8 }}
        className="relative z-10 max-w-2xl"
      >
        {/* Badge */}
        <motion.div
          {...fadeIn}
          transition={smoothTransition}
        >
          <Badge
            variant="outline"
            className="mb-7 rounded-full border-border/80 px-3.5 py-2 text-xs font-medium tracking-wider text-muted-foreground"
          >
            <span className="mr-2 size-1.5 rounded-full bg-primary" />
            A LITTLE MORE ROOM TO THINK
          </Badge>
        </motion.div>

        {/* Heading */}
        <motion.h1
          {...fadeUp}
          transition={{ ...smoothTransition, delay: 0.08 }}
          className="max-w-2xl font-serif text-[clamp(3.5rem,8vw,7rem)] leading-[0.91] tracking-[-0.075em] text-foreground"
        >
          Your Drive,
          <br />

          <span className="relative z-0 text-primary italic">
            in the flow.

            <span
              aria-hidden="true"
              className="absolute -bottom-1 left-0 -z-10 h-[0.2em] w-[94%] -rotate-2 rounded-sm bg-primary/15"
            />
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          {...fadeUp}
          transition={{ ...smoothTransition, delay: 0.16 }}
          className="mt-7 max-w-md text-sm leading-7 text-muted-foreground sm:text-base"
        >
          Let your AI tools find the right files, understand the context, and
          get on with the work. Your Google Drive stays yours.
        </motion.p>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-3">

          <motion.div
            {...fadeUp}
            transition={{ ...smoothTransition, delay: 0.24 }}
          >
            <Button
              asChild
              size="lg"
              className="group h-12 rounded-full px-6"
            >
              <Link href="/login">
                <motion.span
                  {...fadeIn}
                  transition={{ ...smoothTransition, delay: 0.3 }}
                >
                  Connect your Google Drive
                </motion.span>

                <motion.span
                  {...fadeIn}
                  transition={{ ...smoothTransition, delay: 0.36 }}
                  className="grid size-8 place-items-center rounded-full bg-primary-foreground/15 transition-transform duration-300 group-hover:rotate-45"
                >
                  <ArrowUpRight className="size-4" />
                </motion.span>
              </Link>
            </Button>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ ...smoothTransition, delay: 0.32 }}
          >
            <Button
              asChild
              variant="ghost"
              className="group h-11 rounded-full px-3 text-muted-foreground"
            >
              <a href="#how-it-works">
                <motion.span
                  {...fadeIn}
                  transition={{ ...smoothTransition, delay: 0.38 }}
                >
                  See how it works
                </motion.span>

                <ArrowDownRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-1" />
              </a>
            </Button>
          </motion.div>

        </div>

        {/* Trust Note */}
        <motion.p
          {...fadeUp}
          transition={{ ...smoothTransition, delay: 0.4 }}
          className="mt-8 flex items-center gap-2 text-xs text-muted-foreground"
        >
          <span className="grid size-4 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <Check className="size-2.5" strokeWidth={3} />
          </span>

          Google sign-in · Revoke access whenever you want
        </motion.p>
      </motion.div>

      {/* Drive Preview */}
      <DrivePreview />
    </section>
  )
}

function DrivePreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportSettings}
      transition={{ ...smoothTransition, duration: 0.8 }}
      className="relative mx-auto w-full max-w-xl lg:ml-auto"
    >
      {/* Connection Badge */}
      <Card className="absolute -top-5 right-2 z-20 hidden rounded-xl border-border/70 bg-card shadow-lg sm:block lg:-right-5">
        <CardContent className="flex items-center gap-3 p-3">

          <motion.span
            {...fadeUp}
            transition={{ ...smoothTransition, delay: 0.1 }}
            className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"
          >
            <Sparkles className="size-4" />
          </motion.span>

          <span>
            <motion.span
              {...fadeUp}
              transition={{ ...smoothTransition, delay: 0.15 }}
              className="block text-xs font-semibold"
            >
              Ready for your AI
            </motion.span>

            <motion.span
              {...fadeUp}
              transition={{ ...smoothTransition, delay: 0.2 }}
              className="mt-0.5 block font-mono text-[10px] text-muted-foreground"
            >
              MCP · Connected
            </motion.span>
          </span>

          <span className="ml-1 size-2 rounded-full bg-primary" />
        </CardContent>
      </Card>

      {/* Preview Frame */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-muted/40 p-3 shadow-xl sm:p-4">

        {/* Decorative Circles */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-12 size-48 rounded-full border border-primary/15"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-2 -right-2 size-36 rounded-full border border-primary/10"
        />

        {/* Main Preview Card */}
        <Card className="relative overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
          <CardContent className="p-4 sm:p-6">

            {/* Header */}
            <div className="flex items-start justify-between gap-3">

              <div className="min-w-0">

                <motion.p
                  {...fadeUp}
                  transition={{ ...smoothTransition, delay: 0.1 }}
                  className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase"
                >
                  Your connected space
                </motion.p>

                <motion.h2
                  {...fadeUp}
                  transition={{ ...smoothTransition, delay: 0.16 }}
                  className="mt-2 font-serif text-xl leading-tight tracking-tight text-foreground sm:text-2xl"
                >
                  A quieter kind of search
                </motion.h2>

              </div>

              <motion.span
                {...fadeUp}
                transition={{ ...smoothTransition, delay: 0.2 }}
                className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"
              >
                <Sparkles className="size-5" />
              </motion.span>
            </div>

            {/* Search Bar */}
            <div className="mt-5 flex min-h-11 items-center gap-2.5 rounded-lg border border-border bg-background px-3">

              <span className="size-2 shrink-0 rounded-full bg-primary" />

              <motion.span
                {...fadeUp}
                transition={{ ...smoothTransition, delay: 0.24 }}
                className="min-w-0 flex-1 truncate font-mono text-[10px] text-muted-foreground sm:text-xs"
              >
                Find the notes from our last launch review
              </motion.span>

              <Badge
                variant="secondary"
                className="ml-auto shrink-0 rounded-md px-1.5 font-mono text-[10px] text-muted-foreground"
              >
                ⌘ ↵
              </Badge>
            </div>

            {/* File List Header */}
            <div className="mt-6 flex items-center justify-between gap-2 border-b border-border pb-3">

              <motion.span
                {...fadeUp}
                transition={{ ...smoothTransition, delay: 0.3 }}
                className="text-xs font-semibold text-foreground"
              >
                A few useful places to start
              </motion.span>

              <motion.span
                {...fadeUp}
                transition={{ ...smoothTransition, delay: 0.34 }}
                className="shrink-0 font-mono text-[10px] tracking-wider text-muted-foreground"
              >
                03 FILES
              </motion.span>
            </div>

            {/* Files */}
            <div className="divide-y divide-border">
              {filePreviews.map((file, index) => {
                const Icon = fileIcons[file.kind]

                return (
                  <div
                    key={file.name}
                    className="flex items-center gap-3 py-3"
                  >
                    <motion.span
                      {...fadeUp}
                      transition={{
                        ...smoothTransition,
                        delay: 0.38 + index * 0.08,
                      }}
                      className={`grid size-10 shrink-0 place-items-center rounded-lg text-primary-foreground ${file.accent}`}
                    >
                      <Icon className="size-4" strokeWidth={1.8} />
                    </motion.span>

                    <span className="min-w-0 flex-1">

                      <motion.span
                        {...fadeUp}
                        transition={{
                          ...smoothTransition,
                          delay: 0.42 + index * 0.08,
                        }}
                        className="block truncate text-xs font-semibold text-foreground"
                      >
                        {file.name}
                      </motion.span>

                      <motion.span
                        {...fadeUp}
                        transition={{
                          ...smoothTransition,
                          delay: 0.46 + index * 0.08,
                        }}
                        className="mt-1 block truncate font-mono text-[10px] text-muted-foreground"
                      >
                        {file.detail}
                      </motion.span>

                    </span>

                    <motion.span
                      {...fadeUp}
                      transition={{
                        ...smoothTransition,
                        delay: 0.5 + index * 0.08,
                      }}
                      className="shrink-0 font-mono text-[10px] text-muted-foreground"
                    >
                      0{index + 1}
                    </motion.span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Preview Footer */}
        <div className="relative flex flex-wrap items-center justify-between gap-2 px-2 pt-4 pb-1 sm:px-3">

          <motion.span
            {...fadeUp}
            transition={{ ...smoothTransition, delay: 0.65 }}
            className="font-mono text-[9px] tracking-wider text-muted-foreground"
          >
            A BRIDGE, NOT A BLACK BOX
          </motion.span>

          <motion.span
            {...fadeUp}
            transition={{ ...smoothTransition, delay: 0.7 }}
            className="flex items-center gap-1.5 font-mono text-[9px] tracking-wider text-muted-foreground"
          >
            GOOGLE DRIVE
            <ArrowUpRight className="size-3 text-primary" />
          </motion.span>

        </div>
      </div>

      {/* Ambient Decoration */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 -left-5 -z-10 hidden size-24 rounded-full bg-primary/15 blur-xl sm:block lg:-left-11"
      />
    </motion.div>
  )
}
