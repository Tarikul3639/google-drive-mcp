"use client"

import { Ban, Check, LoaderCircle } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import type {
  AuthorizedMcpClient,
  McpToolPermission,
} from "@/features/shared/types/api"

type Props = {
  client: AuthorizedMcpClient
  tool: McpToolPermission
  pending: boolean
  disabled: boolean
  onChange: (
    client: AuthorizedMcpClient,
    tool: McpToolPermission,
    enabled: boolean
  ) => void
}

// Render a single MCP tool permission with its access toggle.
export function McpToolRow({
  client,
  tool,
  pending,
  disabled,
  onChange,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3 py-2.5">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={tool.isEnabled ? "text-primary" : "text-muted-foreground"}
        >
          {tool.isEnabled ? (
            <Check className="size-3.5" />
          ) : (
            <Ban className="size-3.5" />
          )}
        </span>
        <span className="truncate font-mono text-xs">{tool.toolName}</span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-[10px] text-muted-foreground">
          {tool.isEnabled ? "Allowed" : "Blocked"}
        </span>
        {pending ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <Switch
            checked={tool.isEnabled}
            onCheckedChange={(checked) => onChange(client, tool, checked)}
            disabled={disabled}
            aria-label={`${tool.isEnabled ? "Block" : "Allow"} ${tool.toolName}`}
          />
        )}
      </div>
    </div>
  )
}
