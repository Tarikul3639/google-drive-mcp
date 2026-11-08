"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Search,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 -left-24 size-72 rounded-full bg-primary/10 blur-3xl"
      />

      <HeroContent />
      <HeroVisual />
    </section>
  )
}

function HeroContent() {
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
          <span className="mr-2 size-1.5 rounded-full bg-primary" />
          A LITTLE MORE ROOM TO THINK
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
        Let your AI tools find the right files, understand the context, and
        get on with the work. Your Google Drive stays yours.
      </motion.p>

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

/* ------------------------------------------------------------------ */
/* Logos                                                               */
/* ------------------------------------------------------------------ */

// Official Google Drive logo (original brand colors)
function GoogleDriveLogo({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 87.3 78" className={className} aria-hidden="true">
      <path
        d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
        fill="#0066da"
      />
      <path
        d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0-1.2 4.5h27.5z"
        fill="#00ac47"
      />
      <path
        d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
        fill="#ea4335"
      />
      <path
        d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
        fill="#00832d"
      />
      <path
        d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
        fill="#2684fc"
      />
      <path
        d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
        fill="#ffba00"
      />
    </svg>
  )
}

function DocsLogo() {
  return (
    <svg viewBox="0 0 40 44" className="size-6" fill="none">
      <path d="M7 2h17l10 10v29H7V2Z" fill="#4285F4" />
      <path d="M24 2v11h10" fill="#A1C2FA" />
      <path d="M13 21h15M13 27h15M13 33h11" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function SheetsLogo() {
  return (
    <svg viewBox="0 0 40 44" className="size-6" fill="none">
      <path d="M7 2h17l10 10v29H7V2Z" fill="#0F9D58" />
      <path d="M24 2v11h10" fill="#87CEAC" />
      <path d="M13 20h15v14H13zM20.5 20v14M13 27h15" stroke="white" strokeWidth="1.8" />
    </svg>
  )
}

function SlidesLogo() {
  return (
    <svg viewBox="0 0 40 44" className="size-6" fill="none">
      <path d="M7 2h17l10 10v29H7V2Z" fill="#F4B400" />
      <path d="M24 2v11h10" fill="#FCE8B2" />
      <rect x="12" y="19" width="17" height="13" rx="1.5" fill="white" />
      <path d="m17 32 4-5 4 5" fill="#F4B400" />
    </svg>
  )
}

function PdfLogo() {
  return (
    <svg viewBox="0 0 40 44" className="size-6" fill="none">
      <path d="M7 2h17l10 10v29H7V2Z" fill="#EA4335" />
      <path d="M24 2v11h10" fill="#F5A49D" />
      <path d="M12 27c5-9 5-9 7-5 2 4 4 6 8 5M12 29h17" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function McpLogo() {
  return (
    <svg viewBox="0 0 48 48" className="size-6" fill="none">
      <path
        d="M17 12a7 7 0 1 1 7 7H12a5 5 0 1 0 5 5v-5m14 17a7 7 0 1 1-7-7h12a5 5 0 1 0-5-5v5M24 19v10"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="3" fill="currentColor" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const files = [
  { name: "Project brief", meta: "Docs", icon: DocsLogo },
  { name: "Q4 analytics", meta: "Sheets", icon: SheetsLogo },
  { name: "Pitch deck", meta: "Slides", icon: SlidesLogo },
  { name: "Product guide", meta: "PDF", icon: PdfLogo },
]

// Each loop plays one scenario, so the demo feels like real usage.
const scenarios = [
  {
    prompt: "Find my Q4 analytics sheet",
    tool: "drive.search_files",
    file: 1,
    answer: "Found “Q4 analytics” in your Drive.",
  },
  {
    prompt: "Summarize the project brief",
    tool: "drive.read_file",
    file: 0,
    answer: "Read “Project brief”. Summary ready.",
  },
  {
    prompt: "What's inside the pitch deck?",
    tool: "drive.read_file",
    file: 2,
    answer: "Opened “Pitch deck”. 12 slides found.",
  },
  {
    prompt: "Pull key points from the product guide",
    tool: "drive.read_file",
    file: 3,
    answer: "Extracted key points from “Product guide”.",
  },
]

const STEP_MS = 1700

// 0 typing → 1 client→MCP → 2 MCP→Drive → 3 Drive scans
// → 4 Drive→MCP → 5 MCP→client (answer)
const STEPS = 6

// Short labels so they fit inside the circle.
const mcpStatus = [
  "Idle",
  "Request in",
  "Calling Drive",
  "Waiting",
  "Formatting",
  "Responding",
]

const ease = [0.22, 1, 0.36, 1] as const

// Lane geometry in the 500x500 SVG space.
// Client card: 0–140 (28%). MCP circle: top 175, size 130 → at x=225/275 its
// edges sit at y≈180 (top) and y≈300 (bottom). Drive card starts at 345 (69%).
const CLIENT_BOTTOM = 140
const MCP_TOP = 180
const MCP_BOTTOM = 300
const DRIVE_TOP = 345

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

function HeroVisual() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), STEP_MS)
    return () => clearInterval(id)
  }, [])

  const step = tick % STEPS
  const scenario = scenarios[Math.floor(tick / STEPS) % scenarios.length]

  const reqTop = step === 1
  const reqBottom = step === 2
  const resBottom = step === 4
  const resTop = step === 5
  const scanning = step === 3
  const driveActive = step >= 2 && step <= 4
  const mcpActive = step >= 1

  const duration = STEP_MS / 1000 - 0.15

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportSettings}
      transition={{ duration: 0.9, ease }}
      className="relative mx-auto aspect-square w-full max-w-md"
    >
      {/* soft glow */}
      <div
        aria-hidden="true"
        className="absolute inset-[10%] rounded-full bg-primary/10 blur-3xl"
      />

      {/* connection lanes + packets */}
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
          {reqTop && (
            <Packet key={`rt-${tick}`} x={225} from={CLIENT_BOTTOM} to={MCP_TOP} color="#4285F4" duration={duration} />
          )}
          {reqBottom && (
            <Packet key={`rb-${tick}`} x={225} from={MCP_BOTTOM} to={DRIVE_TOP} color="#4285F4" duration={duration} />
          )}
          {resBottom && (
            <Packet key={`sb-${tick}`} x={275} from={DRIVE_TOP} to={MCP_BOTTOM} color="#0F9D58" duration={duration} />
          )}
          {resTop && (
            <Packet key={`st-${tick}`} x={275} from={MCP_TOP} to={CLIENT_BOTTOM} color="#0F9D58" duration={duration} />
          )}
        </AnimatePresence>
      </svg>

      {/* ---------------- AI client (card) ---------------- */}
      <div
        className={`absolute top-0 left-[6%] z-10 flex h-[28%] w-[88%] flex-col rounded-2xl border bg-card p-3 shadow-xl transition-colors duration-500 sm:p-4 ${step === 0 || step === 5 ? "border-primary/40" : "border-border/80"
          }`}
      >
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </span>
          <span className="text-xs font-semibold text-foreground">AI client</span>
          <span className="ml-auto font-mono text-[9px] text-muted-foreground">
            Claude · Cursor · any MCP client
          </span>
        </div>

        <div className="mt-2 flex flex-1 flex-col justify-center gap-1.5 overflow-hidden">
          {/* user prompt */}
          <motion.div
            key={`p-${tick - step}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="ml-auto max-w-[85%] truncate rounded-xl rounded-br-sm bg-primary px-3 py-1.5 text-[11px] text-primary-foreground"
          >
            {scenario.prompt}
            {step === 0 && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="ml-0.5"
              >
                |
              </motion.span>
            )}
          </motion.div>

          {/* assistant reply */}
          <div className="h-6">
            <AnimatePresence mode="wait">
              {step === 5 ? (
                <motion.div
                  key="answer"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease }}
                  className="flex max-w-[92%] items-center gap-1.5 rounded-xl rounded-bl-sm bg-muted px-3 py-1.5 text-[11px] text-foreground"
                >
                  <Check className="size-3 shrink-0 text-primary" />
                  <span className="truncate">{scenario.answer}</span>
                </motion.div>
              ) : step >= 1 ? (
                <motion.div
                  key="thinking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex w-fit items-center gap-1 rounded-xl bg-muted px-3 py-2"
                >
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{ duration: 1, delay: d * 0.15, repeat: Infinity }}
                      className="size-1 rounded-full bg-muted-foreground"
                    />
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ---------------- MCP server (circle) ---------------- */}
      <div className="absolute top-[35%] left-1/2 z-10 aspect-square w-[26%] -translate-x-1/2">
        <div
          className={`relative flex size-full flex-col items-center justify-center rounded-full border bg-card shadow-xl transition-colors duration-500 ${mcpActive ? "border-primary/60" : "border-border/80"
            }`}
        >
          {/* ripple on every incoming/outgoing hop */}
          {mcpActive && (
            <motion.span
              key={`ripple-${tick}`}
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.35, opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border border-primary"
            />
          )}

          <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary sm:size-10">
            <McpLogo />
          </span>

          <span className="mt-1 text-[11px] font-semibold text-foreground sm:text-xs">
            MCP server
          </span>

          <span className="mt-0.5 font-mono text-[8px] text-muted-foreground sm:text-[9px]">
            {mcpStatus[step]}
          </span>
        </div>
      </div>

      {/* tool call chip (left of the circle) */}
      <div className="absolute top-[35%] left-[3%] z-10 flex h-[26%] w-[32%] items-center">
        <AnimatePresence>
          {(step === 1 || step === 2) && (
            <motion.div
              key={`tool-${tick}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              className="rounded-lg border border-border bg-card px-2.5 py-1.5 shadow-md"
            >
              <span className="block font-mono text-[8px] text-muted-foreground sm:text-[9px]">
                tools/call
              </span>
              <span className="mt-0.5 block truncate font-mono text-[9px] font-semibold text-primary sm:text-[10px]">
                {scenario.tool}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* protocol chip (right of the circle) */}
      <div className="absolute top-[35%] right-[3%] z-10 flex h-[26%] w-[32%] items-center justify-end">
        <span className="rounded-md bg-primary/10 px-2 py-1 font-mono text-[9px] font-semibold text-primary">
          {step === 4 || step === 5 ? "200 OK" : "HTTP"}
        </span>
      </div>

      {/* ---------------- Google Drive ---------------- */}
      <div
        className={`absolute bottom-0 left-[6%] z-10 flex h-[31%] w-[88%] flex-col rounded-2xl border bg-card p-3 shadow-xl transition-colors duration-500 ${driveActive ? "border-primary/50" : "border-border/80"
          }`}
      >
        <div className="flex items-center gap-2">
          <GoogleDriveLogo />
          <span className="text-xs font-semibold text-foreground">Google Drive</span>
          <span className="ml-auto flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[9px] text-primary">
            {scanning ? (
              <Search className="size-2.5" />
            ) : (
              <span className="size-1.5 rounded-full bg-primary" />
            )}
            {scanning ? "SCANNING" : "CONNECTED"}
          </span>
        </div>

        <div className="mt-2 grid flex-1 grid-cols-4 gap-2">
          {files.map((file, i) => {
            const Icon = file.icon
            const isTarget = i === scenario.file
            const matched = isTarget && step >= 3 && step <= 4

            return (
              <motion.div
                key={file.name}
                animate={
                  scanning
                    ? { opacity: isTarget ? 1 : [0.4, 1, 0.4], scale: isTarget ? 1.05 : 1 }
                    : { opacity: 1, scale: matched ? 1.05 : 1 }
                }
                transition={
                  scanning && !isTarget
                    ? { duration: 0.7, delay: i * 0.12 }
                    : { duration: 0.4 }
                }
                className={`flex flex-col items-center justify-center gap-1 rounded-lg border px-1 py-1 text-center transition-colors duration-300 ${matched ? "border-primary bg-primary/10" : "border-border bg-muted/50"
                  }`}
              >
                <Icon />
                <span className="w-full truncate text-[9px] font-semibold text-foreground">
                  {file.name}
                </span>
                <span className="font-mono text-[8px] text-muted-foreground">{file.meta}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Packet: a dot with a soft halo travelling along a lane              */
/* ------------------------------------------------------------------ */

function Packet({
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