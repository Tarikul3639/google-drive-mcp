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
      className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-foreground/10 pt-5 text-xs text-muted-foreground"
    >
      <span>{email}</span>
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
