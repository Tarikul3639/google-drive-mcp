"use client"

import { Download } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  clientDescription,
  clientIcon,
  clientName,
  mcpEndpoint,
  type CopyKey,
} from "../connect-data"
import { CopyButton } from "./CopyButton"

// Present the server endpoint, client metadata, and downloadable icon.
export function McpServerDetailsCard({
  copied,
  copyValue,
  copyError,
  onDownload,
}: {
  copied: CopyKey | null
  copyValue: (key: CopyKey, value: string) => void
  copyError: string
  onDownload: () => void
}) {
  return (
    <Card className="overflow-hidden rounded-2xl border-border/70 bg-background/90 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 p-4 sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
            <img
              src={clientIcon}
              alt="Google Drive MCP logo"
              className="size-full object-cover"
            />
          </div>
          <div className="min-w-0 space-y-0.5">
            <CardTitle className="text-sm">{clientName}</CardTitle>
            <CardDescription className="text-xs">
              MCP server connection
            </CardDescription>
          </div>
        </div>
        <Badge variant="outline" className="shrink-0 text-[10px]">
          <span className="mr-1.5 size-1.5 rounded-full bg-primary" />
          Streamable HTTP
        </Badge>
      </CardHeader>
      <CardContent className="space-y-5 p-4 pt-0 sm:p-5 sm:pt-0">
        <div className="space-y-2">
          <label className="text-xs font-medium">Server URL</label>
          <div className="flex min-w-0 items-center gap-2 rounded-xl border border-border/70 bg-muted/60 py-2 pr-2 pl-3 transition-colors focus-within:border-primary">
            <code className="min-w-0 flex-1 text-xs leading-relaxed break-all">
              {mcpEndpoint}
            </code>
            <CopyButton
              copyKey="endpoint"
              value={mcpEndpoint}
              copied={copied === "endpoint"}
              onCopy={copyValue}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="min-w-0 space-y-2">
            <label className="text-xs font-medium">Client name</label>
            <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-muted/60 px-3 py-2 transition-colors focus-within:border-primary">
              <p className="min-w-0 flex-1 truncate text-xs">{clientName}</p>
              <CopyButton
                copyKey="name"
                value={clientName}
                copied={copied === "name"}
                onCopy={copyValue}
              />
            </div>
          </div>
          <div className="min-w-0 space-y-2">
            <label className="text-xs font-medium">Client description</label>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5 transition-colors focus-within:border-primary">
              <p className="min-w-0 flex-1 text-xs leading-relaxed text-muted-foreground">
                {clientDescription}
              </p>
              <CopyButton
                copyKey="description"
                value={clientDescription}
                copied={copied === "description"}
                onCopy={copyValue}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/30 p-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
              <img
                src={clientIcon}
                alt="Google Drive MCP client icon"
                className="size-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium">Client icon</p>
              <p className="text-[11px] text-muted-foreground">
                PNG · Max 10 KB
              </p>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-xs"
            onClick={onDownload}
          >
            <Download className="size-3.5" /> Download icon
          </Button>
        </div>
        {copyError ? (
          <p role="alert" className="text-xs text-destructive">
            {copyError}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
