"use client"

import { motion } from "motion/react"

// Animate one request or response packet along a vertical protocol lane.
export function HeroPacket({
  x,
  from,
  to,
  color,
  duration,
}: {
  x: number
  from: number
  to: number
  color: string
  duration: number
}) {
  return (
    <>
      <motion.circle
        cx={x}
        r={9}
        fill={color}
        opacity={0.18}
        initial={{ cy: from }}
        animate={{ cy: to }}
        transition={{ duration, ease: "easeInOut" }}
      />
      <motion.circle
        cx={x}
        r={4.5}
        fill={color}
        initial={{ cy: from }}
        animate={{ cy: to }}
        transition={{ duration, ease: "easeInOut" }}
      />
    </>
  )
}
