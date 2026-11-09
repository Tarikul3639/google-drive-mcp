"use client"

import { HeroContent } from "./HeroContent"
import { HeroVisual } from "./HeroVisual"

// Compose the homepage hero section without changing its visual layout.
export function Hero() {
  return (
    <section className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pt-12 pb-20 sm:px-8 sm:pt-16 lg:min-h-162.5 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:px-12 lg:pt-12 lg:pb-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 -left-24 size-72 rounded-full bg-primary/10 blur-3xl"
      />
      <HeroContent />
      <HeroVisual />
    </section>
  )
}
