"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"

import { scenarios, STEP_MS, STEPS, ease } from "./hero-data"
import { HeroClientCard } from "./HeroClientCard"
import { HeroConnectionLines } from "./HeroConnectionLines"
import { HeroDriveCard } from "./HeroDriveCard"
import { HeroMcpNode } from "./HeroMcpNode"
import { HeroProtocolChips } from "./HeroProtocolChips"

const viewportSettings = { once: false, amount: 0.2 }

// Coordinate the repeating six-step MCP request animation.
export function HeroVisual() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(
      () => setTick((value) => value + 1),
      STEP_MS
    )
    return () => window.clearInterval(interval)
  }, [])

  const step = tick % STEPS
  const scenario = scenarios[Math.floor(tick / STEPS) % scenarios.length]
  const duration = STEP_MS / 1000 - 0.15

  // Keep a square coordinate system so the SVG paths and percentage-based
  // cards stay aligned at every viewport width.
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportSettings}
      transition={{ duration: 0.9, ease }}
      className="relative mx-auto aspect-square w-full min-w-0 max-w-md"
    >
      <div
        aria-hidden="true"
        className="absolute inset-[10%] rounded-full bg-primary/10 blur-3xl"
      />
      <HeroConnectionLines tick={tick} step={step} duration={duration} />
      <HeroClientCard
        step={step}
        tick={tick}
        prompt={scenario.prompt}
        answer={scenario.answer}
      />
      <HeroMcpNode step={step} tick={tick} />
      <HeroProtocolChips step={step} tick={tick} tool={scenario.tool} />
      <HeroDriveCard step={step} scenarioFile={scenario.file} />
    </motion.div>
  )
}
