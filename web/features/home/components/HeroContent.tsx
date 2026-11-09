"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowDownRight, ArrowUpRight, Check } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const smoothTransition = { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const }
const viewportSettings = { once: false, amount: 0.2 }
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

// Render the hero heading, description, and primary navigation actions.
export function HeroContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportSettings}
      transition={{ ...smoothTransition, duration: 0.8 }}
      className="relative z-10 max-w-2xl"
    >
      <motion.div {...fadeIn} transition={smoothTransition}>
        <Badge
          variant="outline"
          className="mb-7 rounded-full border-border/80 px-3.5 py-2 text-xs font-medium tracking-wider text-muted-foreground"
        >
          <span className="mr-2 size-1.5 rounded-full bg-primary" />A LITTLE
          MORE ROOM TO THINK
        </Badge>
      </motion.div>

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

      <motion.p
        {...fadeUp}
        transition={{ ...smoothTransition, delay: 0.16 }}
        className="mt-7 max-w-md text-sm leading-7 text-muted-foreground sm:text-base"
      >
        Let your AI tools find the right files, understand the context, and get
        on with the work. Your Google Drive stays yours.
      </motion.p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <motion.div
          {...fadeUp}
          transition={{ ...smoothTransition, delay: 0.24 }}
        >
          <Button asChild size="lg" className="group h-12 rounded-full px-6">
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
  )
}
