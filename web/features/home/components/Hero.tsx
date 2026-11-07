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

import { filePreviews } from "./constants"

const fileIcons = {
  document: FileText,
  sheet: FileSpreadsheet,
  slides: Presentation,
}

export function Hero() {
  return (
    <section className="relative mx-auto grid w-full max-w-[1440px] items-center gap-14 overflow-hidden px-5 pt-12 pb-20 sm:px-8 sm:pt-16 lg:min-h-[650px] lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:px-14 lg:pt-12 lg:pb-28">
      <div className="pointer-events-none absolute top-12 -left-24 size-72 rounded-full bg-[#d6e58d]/30 blur-3xl dark:bg-[#687b36]/10" />
      <div className="relative z-10 max-w-[610px]">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/65 px-3.5 py-2 text-[10px] font-medium tracking-[0.12em] text-muted-foreground shadow-sm backdrop-blur"
          initial={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.55 }}
        >
          <span className="size-1.5 rounded-full bg-[#8ca23b] shadow-[0_0_0_3px_#8ca23b22]" />
          A LITTLE MORE ROOM TO THINK
        </motion.div>

        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[650px] font-serif text-[clamp(3.5rem,8vw,7.2rem)] leading-[0.91] tracking-[-0.075em] text-foreground"
          initial={{ opacity: 0, y: 24 }}
          transition={{ delay: 0.08, duration: 0.7 }}
        >
          Your Drive,
          <br />
          <span className="relative z-0 text-[#788852] italic dark:text-[#c5d87b]">
            in the flow.
            <span className="absolute -bottom-1 left-0 -z-10 h-[0.2em] w-[94%] -rotate-2 bg-[#dce98f]/80 dark:bg-[#687b36]/35" />
          </span>
        </motion.h1>

        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mt-7 max-w-[440px] text-[15px] leading-7 text-muted-foreground sm:text-[16px]"
          initial={{ opacity: 0, y: 18 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Let your AI tools find the right files, understand the context, and
          get on with the work. Your Google Drive stays yours.
        </motion.p>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 18 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Link
            className="group relative flex h-[54px] items-center gap-3 overflow-hidden rounded-full bg-[#d5ed70] pr-5 pl-6 text-[13px] font-semibold text-[#252a1e] shadow-[0_12px_32px_-16px_#9aaa42] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e0f58a]"
            href="/login"
          >
            <span className="relative z-10">Connect your Google Drive</span>
            <span className="grid size-8 place-items-center rounded-full bg-[#b7d04c] transition-transform group-hover:rotate-45">
              <ArrowUpRight className="size-4" />
            </span>
          </Link>
          <a
            className="group flex items-center gap-2 px-2 py-3 text-[12px] font-medium text-muted-foreground transition hover:text-foreground"
            href="#how-it-works"
          >
            See how it works
            <ArrowDownRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-1" />
          </a>
        </motion.div>

        <div className="mt-8 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="grid size-4 place-items-center rounded-full bg-[#e7edda] text-[#657747] dark:bg-[#34402b] dark:text-[#c5d87b]">
            <Check className="size-2.5" strokeWidth={3} />
          </span>
          Google sign-in · Revoke access whenever you want
        </div>
      </div>

      <DrivePreview />
    </section>
  )
}

function DrivePreview() {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      className="relative mx-auto w-full max-w-[570px] lg:ml-auto"
      initial={{ opacity: 0, y: 30, rotate: 1.2 }}
      transition={{ delay: 0.18, duration: 0.75, ease: "easeOut" }}
    >
      <div className="absolute top-3 -right-1 z-10 hidden rounded-[17px] border border-foreground/10 bg-background px-4 py-3 shadow-[0_12px_40px_-20px_#20231b66] sm:flex sm:items-center sm:gap-3 lg:-right-7">
        <span className="grid size-8 place-items-center rounded-xl bg-[#e8eedc] text-[#697b4e] dark:bg-[#313c2d] dark:text-[#c5d87b]">
          <Sparkles className="size-4" />
        </span>
        <span>
          <span className="block text-[10px] font-medium">
            Ready for your AI
          </span>
          <span className="font-mono text-[9px] text-muted-foreground">
            MCP · Connected
          </span>
        </span>
        <span className="ml-1 size-1.5 rounded-full bg-[#97aa51]" />
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-foreground/[0.08] bg-[#f4f2e9] p-3 shadow-[0_35px_90px_-48px_#41472b66] sm:p-5 dark:bg-[#22251f]">
        <div className="absolute -top-14 -right-12 size-48 rounded-full border border-[#cbd49c]/55 dark:border-[#77884e]/20" />
        <div className="absolute -top-1 -right-1 size-40 rounded-full border border-[#cbd49c]/40 dark:border-[#77884e]/15" />

        <div className="relative rounded-[20px] border border-foreground/[0.08] bg-background p-4 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase">
                Your connected space
              </div>
              <h2 className="mt-2 font-serif text-[25px] tracking-[-0.05em]">
                A quieter kind of search
              </h2>
            </div>
            <span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-[#f0f3e7] text-[#60764a] dark:bg-[#303a2a] dark:text-[#c5d87b]">
              <Sparkles className="size-[18px]" />
            </span>
          </div>

          <div className="mt-5 flex h-11 items-center gap-2 rounded-xl border border-foreground/10 bg-background px-3.5">
            <span className="size-2 rounded-full bg-[#a8bd63]" />
            <span className="truncate font-mono text-[10px] text-muted-foreground sm:text-[11px]">
              Find the notes from our last launch review
            </span>
            <span className="ml-auto rounded-md bg-[#20231b] px-2 py-1 font-mono text-[8px] text-white dark:bg-[#d5ed70] dark:text-[#20231b]">
              ⌘ ↵
            </span>
          </div>

          <div className="mt-5 flex items-center justify-between border-b border-foreground/[0.08] pb-3">
            <span className="text-[10px] font-medium">
              A few useful places to start
            </span>
            <span className="font-mono text-[9px] text-muted-foreground">
              03 FILES
            </span>
          </div>

          <div className="divide-y divide-foreground/[0.07]">
            {filePreviews.map((file, index) => {
              const Icon = fileIcons[file.kind]
              return (
                <div className="flex items-center gap-3 py-3" key={file.name}>
                  <span
                    className={`grid size-9 shrink-0 place-items-center rounded-xl text-white ${file.accent}`}
                  >
                    <Icon className="size-4" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] font-medium">
                      {file.name}
                    </span>
                    <span className="mt-0.5 block font-mono text-[8px] text-muted-foreground">
                      {file.detail}
                    </span>
                  </span>
                  <span className="font-mono text-[9px] text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative flex items-center justify-between px-2 pt-4 pb-1 sm:px-3">
          <span className="font-mono text-[9px] tracking-[0.08em] text-muted-foreground">
            A BRIDGE, NOT A BLACK BOX
          </span>
          <span className="flex items-center gap-2 font-mono text-[9px] text-muted-foreground">
            GOOGLE DRIVE <span className="text-[#87964e]">↗</span>
          </span>
        </div>
      </div>

      <span className="absolute -bottom-8 -left-5 -z-10 hidden size-24 rounded-full bg-[#d5ed70] sm:block lg:-left-11" />
    </motion.div>
  )
}
