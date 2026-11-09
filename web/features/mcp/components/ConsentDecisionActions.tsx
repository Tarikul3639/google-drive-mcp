"use client"

import { motion } from "motion/react"
import { Check, LoaderCircle, X } from "lucide-react"

import { Button } from "@/components/ui/button"

// Let the user approve or deny the pending MCP client authorization.
export function ConsentDecisionActions({
  submitting,
  disabled,
  onDecision,
}: {
  submitting: "allow" | "deny" | null
  disabled: boolean
  onDecision: (decision: "allow" | "deny") => void
}) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      <Button
        className="h-9 rounded-full px-3 text-xs"
        disabled={disabled}
        onClick={() => onDecision("allow")}
        type="button"
      >
        {submitting === "allow" ? (
          <LoaderCircle className="size-3.5 animate-spin" />
        ) : (
          <motion.span
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="inline-flex"
          >
            <Check className="size-3.5" />
          </motion.span>
        )}
        {submitting === "allow" ? "Allowing…" : "Allow access"}
      </Button>
      <Button
        variant="outline"
        className="h-9 rounded-full px-3 text-xs"
        disabled={disabled}
        onClick={() => onDecision("deny")}
        type="button"
      >
        {submitting === "deny" ? (
          <LoaderCircle className="size-3.5 animate-spin" />
        ) : (
          <motion.span
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="inline-flex"
          >
            <X className="size-3.5" />
          </motion.span>
        )}
        {submitting === "deny" ? "Denying…" : "Deny"}
      </Button>
    </div>
  )
}
