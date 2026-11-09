"use client"

import { motion } from "motion/react"
import { ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Explain which Google account supplies the sign-in identity.
export function AccountGoogleCard({
  onWorkspace,
}: {
  onWorkspace: () => void
}) {
  return (
    <Card className="mt-4 rounded-xl bg-secondary">
      <CardContent className="flex gap-4 p-5 sm:p-6">
        <motion.span
          whileHover={{ rotate: 8, scale: 1.05 }}
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-background text-primary"
        >
          <ShieldCheck className="size-5" />
        </motion.span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">Your Google account</h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Your sign-in email comes from Google and can&apos;t be changed here.
            Manage Drive access from the workspace overview.
          </p>
          <Button
            variant="link"
            className="mt-2 h-auto p-0 text-xs"
            onClick={onWorkspace}
          >
            Go to workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
