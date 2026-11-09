import Link from "next/link"
import { motion } from "motion/react"
import { Cable, ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/features/home/components/ThemeToggle"

// Render the branded introduction panel on the login screen.
export function LoginBrandPanel() {
  return (
    <section className="relative flex min-h-[60svh] flex-col justify-between overflow-hidden bg-primary px-6 py-7 text-primary-foreground sm:px-10 sm:py-9 lg:min-h-svh lg:px-14 lg:py-12">
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -left-14 size-125 rounded-full border border-primary-foreground/15"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-20 left-12 size-85 rounded-full border border-primary-foreground/15"
      />
      <div className="relative flex items-center justify-between">
        <Link className="flex items-center gap-3" href="/">
          <span className="grid size-10 place-items-center rounded-[14px] bg-primary-foreground/15">
            <Cable className="size-5" />
          </span>
          <span className="font-serif text-[22px] tracking-[-0.06em]">
            drivebridge
          </span>
        </Link>
        <ThemeToggle />
      </div>
      <div className="relative max-w-135 py-20 lg:py-0">
        <Badge
          variant="secondary"
          className="rounded-full bg-primary-foreground/15 text-primary-foreground"
        >
          YOUR DRIVE, WITH A LITTLE MORE FLOW
        </Badge>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.3 }}
          className="mt-6 font-serif text-[clamp(3.4rem,7vw,6.6rem)] leading-[0.91] tracking-[-0.075em]"
        >
          Good work
          <br />
          finds its way.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-6 max-w-97.5 text-[14px] leading-7 opacity-75"
        >
          Connect the files you already trust to the AI tools you already use.
          Start with Google, stay in control.
        </motion.p>
      </div>
      <div className="relative flex items-center gap-2 text-[10px] opacity-70">
        <ShieldCheck className="size-4" /> Revoke your connection whenever you
        want
      </div>
    </section>
  )
}
