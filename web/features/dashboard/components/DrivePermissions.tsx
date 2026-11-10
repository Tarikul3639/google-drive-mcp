"use client"

import { motion } from "motion/react"
import { ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"

// Explain Drive permissions and provide the Google connection action.
export function DrivePermissions({
  busy,
  connected,
  onConnect,
}: {
  busy: boolean
  connected: boolean
  onConnect: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-primary-foreground/15 bg-primary-foreground/5 p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-primary-foreground/10">
          <ShieldCheck className="size-4" />
        </span>
        <div>
          <h3 className="text-sm font-semibold">Google Drive permissions</h3>
          <p className="mt-1 max-w-xl text-xs leading-5 opacity-70">
            Drivebridge requests full access so it can view, create, edit, and
            delete files in your Google Drive. You can revoke access anytime.
          </p>
        </div>
      </div>
      <Button
        className="mt-4 h-10 w-full rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/85 sm:w-auto"
        disabled={busy}
        onClick={onConnect}
        type="button"
      >
        <motion.span
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center"
        >
          {busy
            ? "Opening Google…"
            : connected
              ? "Reconnect with full access"
              : "Connect with full access"}
        </motion.span>
      </Button>
    </motion.div>
  )
}
