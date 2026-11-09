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
      className={`absolute bottom-0 left-[6%] z-10 flex h-[31%] w-[88%] flex-col rounded-2xl border bg-card p-3 shadow-xl transition-colors duration-500 ${active ? "border-primary/50" : "border-border/80"}`}
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
      <div className="mt-2 grid flex-1 grid-cols-4 gap-2">
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
              className={`flex flex-col items-center justify-center gap-1 rounded-lg border px-1 py-1 text-center transition-colors duration-300 ${matched ? "border-primary bg-primary/10" : "border-border bg-muted/50"}`}
            >
              <Icon />
              <span className="w-full truncate text-[9px] font-semibold text-foreground">
                {file.name}
              </span>
              <span className="font-mono text-[8px] text-muted-foreground">
                {file.meta}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
