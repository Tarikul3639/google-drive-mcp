"use client"

import { ChevronDown, ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { CollapsibleTrigger } from "@/components/ui/collapsible"
import type { AuthorizedMcpClient } from "@/features/shared/types/api"

// Show the MCP client name, status, grant date, and tool count.
export function McpClientSummary({
  client,
  allowed,
  open,
}: {
  client: AuthorizedMcpClient
  allowed: number
  open: boolean
}) {
  return (
    <CollapsibleTrigger className="group flex min-w-0 flex-1 items-center gap-3 text-left outline-none">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
        <ShieldCheck className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="block truncate text-sm font-semibold">
            {client.name}
          </span>
          <Badge
            variant={client.isRevoked ? "secondary" : "outline"}
            className="text-[10px]"
          >
            {client.isRevoked ? "Revoked" : "Active"}
          </Badge>
        </span>
        <span className="mt-1 block text-xs text-muted-foreground">
          Approved {new Date(client.grantedAt).toLocaleDateString()}
        </span>
        <span className="mt-1 block text-xs text-muted-foreground">
          {allowed} of {client.tools.length} tools allowed
        </span>
      </span>
      <ChevronDown
        className={`size-4 shrink-0 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      />
    </CollapsibleTrigger>
  )
}
