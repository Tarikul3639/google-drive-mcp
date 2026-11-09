"use client"

import { Check, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { CopyKey } from "../connect-data"

// Copy one selected connection value to the clipboard.
export function CopyButton({
  copyKey,
  value,
  copied,
  onCopy,
}: {
  copyKey: CopyKey
  value: string
  copied: boolean
  onCopy: (key: CopyKey, value: string) => void
}) {
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label={copied ? "Copied" : "Copy"}
      className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
      onClick={() => onCopy(copyKey, value)}
    >
      {copied ? (
        <Check className="size-3.5 text-primary" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </Button>
  )
}
