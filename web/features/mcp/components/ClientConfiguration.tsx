import { Clipboard } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { clientConfig, type CopyKey } from "../connect-data"
import { CopyButton } from "./CopyButton"

// Display the ready-to-copy JSON configuration for compatible MCP clients.
export function ClientConfiguration({
  copied,
  onCopy,
}: {
  copied: CopyKey | null
  onCopy: (key: CopyKey, value: string) => void
}) {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="font-mono text-[10px] tracking-[0.18em] text-primary">
          QUICK SETUP
        </p>
        <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">
          Client configuration
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          For clients that support JSON-based MCP server configuration.
        </p>
      </div>
      <Card className="rounded-2xl border-border/70 bg-background/80 shadow-sm">
        <CardContent className="space-y-3 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Clipboard className="size-4 text-muted-foreground" />
            <span className="text-xs font-medium">
              Streamable HTTP configuration
            </span>
          </div>
          <div className="relative rounded-xl border border-border/70 bg-muted/70">
            <pre className="overflow-x-auto p-4 pr-12 text-[11px] leading-relaxed">
              <code>{clientConfig}</code>
            </pre>
            <div className="absolute top-2 right-2">
              <CopyButton
                copyKey="config"
                value={clientConfig}
                copied={copied === "config"}
                onCopy={onCopy}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
