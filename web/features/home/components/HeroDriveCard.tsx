"use client"

import { motion } from "motion/react"
import { Search } from "lucide-react"

import { GoogleDriveLogo } from "./HeroLogos"
import { files } from "./hero-data"

// Render the animated Google Drive file list in the hero illustration.
export function HeroDriveCard({
  step,
  scenarioFile,
}: {
  step: number
  scenarioFile: number
}) {
  const scanning = step === 3
  const active = step >= 2 && step <= 4
  return (
    <div
      className={`absolute bottom-0 left-[3%] z-10 flex h-[31%] w-[94%] flex-col rounded-2xl border bg-card p-2 shadow-xl transition-colors duration-500 sm:left-[6%] sm:w-[88%] sm:p-3 ${active ? "border-primary/50" : "border-border/80"}`}
    >
      <div className="flex items-center gap-2">
        <GoogleDriveLogo />
        <span className="text-xs font-semibold text-foreground">
          Google Drive
        </span>
        <span className="ml-auto flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[9px] text-primary">
          {scanning ? (
            <Search className="size-2.5" />
          ) : (
            <span className="size-1.5 rounded-full bg-primary" />
          )}
          {scanning ? "SCANNING" : "CONNECTED"}
        </span>
      </div>
      {/* Two columns on phones keep each file tile readable; desktop stays four-up. */}
      <div className="mt-1 grid min-h-0 flex-1 grid-cols-4 gap-1 sm:mt-2 sm:gap-2">
        {files.map((file, index) => {
          const Icon = file.icon
          const target = index === scenarioFile
          const matched = target && step >= 3 && step <= 4
          return (
            <motion.div
              key={file.name}
              animate={
                scanning
                  ? {
                      opacity: target ? 1 : [0.4, 1, 0.4],
                      scale: target ? 1.05 : 1,
                    }
                  : { opacity: 1, scale: matched ? 1.05 : 1 }
              }
              transition={
                scanning && !target
                  ? { duration: 0.7, delay: index * 0.12 }
                  : { duration: 0.4 }
              }
              className={`flex min-h-0 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-lg border px-0.5 py-0.5 text-center transition-colors duration-300 sm:gap-1 sm:px-1 sm:py-1 ${matched ? "border-primary bg-primary/10" : "border-border bg-muted/50"}`}
            >
              <span className="[&_svg]:size-3.5 sm:[&_svg]:size-6">
                <Icon />
              </span>
              <span className="w-full min-w-0">
                <span className="block w-full truncate text-[8px] font-semibold text-foreground sm:text-[9px]">
                  {file.name}
                </span>
                <span className="block font-mono text-[7px] text-muted-foreground sm:text-[8px]">
                  {file.meta}
                </span>
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
