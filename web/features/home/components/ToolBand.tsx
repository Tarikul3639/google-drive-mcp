"use client"

import { motion } from "motion/react"
import { ArrowRight, Boxes, Check } from "lucide-react"

const toolNames = ["Claude Desktop", "Cursor", "Your MCP client"]

export function ToolBand() {
  return (
    <section
      className="mx-auto grid w-full max-w-[1440px] gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-14 lg:py-24"
      id="for-your-tools"
    >
      <motion.div
        className="relative min-h-[270px] overflow-hidden rounded-[26px] bg-[#25291f] p-7 text-[#f5f4ed] sm:p-9"
        initial={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true, amount: 0.2 }}
        whileInView={{ opacity: 1, scale: 1 }}
      >
        <div className="absolute -right-10 -bottom-24 size-72 rounded-full border border-[#c4d678]/20" />
        <div className="absolute right-5 -bottom-10 size-48 rounded-full border border-[#c4d678]/20" />
        <div className="relative">
          <span className="font-mono text-[9px] tracking-[0.2em] text-[#c5d87b]">
            A SMALL BRIDGE, CLEARLY MARKED
          </span>
          <div className="mt-7 flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-[15px] bg-[#d5ed70] text-[#25291f]">
              <Boxes className="size-5" />
            </div>
            <ArrowRight className="size-4 text-white/35" />
            <div className="rounded-xl border border-white/15 px-3 py-2 font-mono text-[10px] text-white/80">
              MCP
            </div>
            <ArrowRight className="size-4 text-white/35" />
            <div className="rounded-xl border border-white/15 px-3 py-2 font-mono text-[10px] text-white/80">
              AI
            </div>
          </div>
          <p className="mt-7 max-w-[340px] font-serif text-[28px] leading-[1.08] tracking-[-0.05em] sm:text-[34px]">
            Your files move at the speed of a good question.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 font-mono text-[9px] text-white/75">
            <span className="size-1.5 rounded-full bg-[#c5d87b]" />
            STANDARD MCP CONNECTION
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.25 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="font-mono text-[10px] tracking-[0.19em] text-[#7b8e4b]">
            MADE FOR YOUR TOOLBELT
          </span>
          <h2 className="mt-4 max-w-lg font-serif text-[clamp(2.4rem,5vw,4rem)] leading-[0.98] tracking-[-0.065em]">
            Works where
            <br />
            <span className="text-[#788852] italic dark:text-[#c5d87b]">
              you already think.
            </span>
          </h2>
          <p className="mt-5 max-w-md text-[13px] leading-6 text-muted-foreground">
            Drivebridge uses the Model Context Protocol, so your files can meet
            assistants and editors that already speak MCP.
          </p>
        </motion.div>

        <div className="mt-7 grid gap-2 sm:grid-cols-3">
          {toolNames.map((tool, index) => (
            <div
              className="flex min-h-12 items-center gap-2.5 rounded-xl border border-foreground/10 px-3 text-[10px] font-medium"
              key={tool}
            >
              <span
                className={`grid size-6 place-items-center rounded-lg text-[9px] font-bold ${index === 0 ? "bg-[#e9e5f5] text-[#645891] dark:bg-[#39334b] dark:text-[#cec2ff]" : index === 1 ? "bg-[#dfeae7] text-[#4b7d6c] dark:bg-[#2d3b35] dark:text-[#b9dfd0]" : "bg-[#eee9dd] text-[#9b8053] dark:bg-[#3d372b] dark:text-[#e1cca1]"}`}
              >
                {tool.slice(0, 1)}
              </span>
              <span className="min-w-0 truncate">{tool}</span>
              <Check className="ml-auto size-3.5 text-[#81944f] dark:text-[#c5d87b]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
