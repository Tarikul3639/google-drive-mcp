"use client"

import { useState } from "react"
import { motion } from "motion/react"

import { ConnectPageHeading } from "./components/ConnectPageHeading"
import { McpServerDetailsCard } from "./components/McpServerDetailsCard"
import { ConnectionSteps } from "./components/ConnectionSteps"
import { ClientConfiguration } from "./components/ClientConfiguration"
import { ConnectSecurityNote } from "./components/ConnectSecurityNote"
import { ConnectPageFooter } from "./components/ConnectPageFooter"
import type { CopyKey } from "./connect-data"

const revealViewport = {
  once: false,
  amount: 0.2,
  margin: "-8% 0px -8% 0px",
} as const

const revealTransition = {
  duration: 0.65,
  ease: [0.22, 1, 0.36, 1] as const,
}

// Coordinate clipboard feedback and icon download for the MCP setup page.
export default function McpConnectPage() {
  const [copied, setCopied] = useState<CopyKey | null>(null)
  const [copyError, setCopyError] = useState("")

  async function copyValue(key: CopyKey, value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(key)
      setCopyError("")
      window.setTimeout(
        () => setCopied((current) => (current === key ? null : current)),
        1800
      )
    } catch {
      setCopyError("Unable to copy. Please copy the value manually.")
    }
  }

  function downloadIcon() {
    const link = document.createElement("a")
    link.href = "/drivebridge-icon.jpg"
    link.download = "drivebridge-icon.jpg"
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto w-full max-w-7xl space-y-10 px-5 py-16 sm:px-8 sm:py-20 lg:px-14 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealViewport}
          transition={revealTransition}
        >
          <ConnectPageHeading />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealViewport}
          transition={revealTransition}
        >
          <McpServerDetailsCard
            copied={copied}
            copyValue={copyValue}
            copyError={copyError}
            onDownload={downloadIcon}
          />
        </motion.div>
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={{ ...revealTransition, delay: 0.05 }}
          >
            <ConnectionSteps />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={{ ...revealTransition, delay: 0.12 }}
          >
            <ClientConfiguration copied={copied} onCopy={copyValue} />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealViewport}
          transition={revealTransition}
        >
          <ConnectSecurityNote />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealViewport}
          transition={{ ...revealTransition, duration: 0.55 }}
        >
          <ConnectPageFooter />
        </motion.div>
      </div>
    </section>
  )
}
