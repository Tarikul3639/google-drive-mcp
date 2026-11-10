"use client"

import { motion } from "motion/react"
import { Button } from "@/components/ui/button"

// Show the signed-in email and link to account settings.
export function DashboardFooter({
  email,
  onAccount,
}: {
  email: string
  onAccount: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="mt-6 flex min-w-0 flex-col items-start justify-between gap-2 border-t border-foreground/10 pt-4 text-xs text-muted-foreground sm:mt-7 sm:flex-row sm:items-center sm:gap-3 sm:pt-5"
    >
      <span className="max-w-full break-all">{email}</span>
      <Button
        variant="link"
        size="sm"
        className="h-auto p-0 text-xs text-muted-foreground"
        onClick={onAccount}
        type="button"
      >
        <motion.span
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center"
        >
          Review profile settings
        </motion.span>
      </Button>
    </motion.div>
  )
}
