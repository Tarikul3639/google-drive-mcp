"use client"

import { AnimatePresence } from "motion/react"

import { CLIENT_BOTTOM, DRIVE_TOP, MCP_BOTTOM, MCP_TOP } from "./hero-data"
import { HeroPacket } from "./HeroPacket"

// Show the MCP request and response packets moving between client and Drive.
export function HeroConnectionLines({
  tick,
  step,
  duration,
}: {
  tick: number
  step: number
  duration: number
}) {
  return (
    <svg
      viewBox="0 0 500 500"
      className="absolute inset-0 size-full"
      fill="none"
      aria-hidden="true"
    >
      {[
        [225, CLIENT_BOTTOM, MCP_TOP],
        [275, CLIENT_BOTTOM, MCP_TOP],
        [225, MCP_BOTTOM, DRIVE_TOP],
        [275, MCP_BOTTOM, DRIVE_TOP],
      ].map(([x, y1, y2], i) => (
        <line
          key={i}
          x1={x}
          x2={x}
          y1={y1}
          y2={y2}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 5"
          className="text-primary/30"
        />
      ))}
      <AnimatePresence>
        {step === 1 ? (
          <HeroPacket
            key={`rt-${tick}`}
            x={225}
            from={CLIENT_BOTTOM}
            to={MCP_TOP}
            color="#4285F4"
            duration={duration}
          />
        ) : null}
        {step === 2 ? (
          <HeroPacket
            key={`rb-${tick}`}
            x={225}
            from={MCP_BOTTOM}
            to={DRIVE_TOP}
            color="#4285F4"
            duration={duration}
          />
        ) : null}
        {step === 4 ? (
          <HeroPacket
            key={`sb-${tick}`}
            x={275}
            from={DRIVE_TOP}
            to={MCP_BOTTOM}
            color="#0F9D58"
            duration={duration}
          />
        ) : null}
        {step === 5 ? (
          <HeroPacket
            key={`st-${tick}`}
            x={275}
            from={MCP_TOP}
            to={CLIENT_BOTTOM}
            color="#0F9D58"
            duration={duration}
          />
        ) : null}
      </AnimatePresence>
    </svg>
  )
}
