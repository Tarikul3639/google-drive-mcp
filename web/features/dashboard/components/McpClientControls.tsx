"use client"

import { LoaderCircle, RefreshCw, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import type { AuthorizedMcpClient } from "@/features/shared/types/api"

// Render refresh, active/revoke, restore, and delete controls for a client.
export function McpClientControls({
  client,
  busyClient,
  busyTool,
  deleteClient,
  onToggle,
  onRefresh,
  onDelete,
}: {
  client: AuthorizedMcpClient
  busyClient: string | null
  busyTool: string | null
  deleteClient: string | null
  onToggle: (client: AuthorizedMcpClient, enabled: boolean) => void
  onRefresh: (client: AuthorizedMcpClient) => void
  onDelete: (client: AuthorizedMcpClient) => void
}) {
  const busy = busyClient === client.clientId
  return (
    <div className="flex min-w-0 flex-wrap gap-2 sm:shrink-0 sm:pl-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 rounded-full"
        onClick={() => onRefresh(client)}
        disabled={busyClient !== null || client.isRevoked}
      >
        {busy ? (
          <LoaderCircle className="size-3.5 animate-spin" />
        ) : (
          <RefreshCw className="size-3.5" />
        )}{" "}
        Refresh tools
      </Button>
      <div className="flex items-center gap-2 rounded-full border px-3">
        <span className="text-xs text-muted-foreground">
          {client.isRevoked ? "Revoked" : "Active"}
        </span>
        {busy ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <Switch
            checked={!client.isRevoked}
            onCheckedChange={(checked) => onToggle(client, checked)}
            disabled={
              busyClient !== null || busyTool !== null || deleteClient !== null
            }
            aria-label={
              client.isRevoked
                ? `Restore ${client.name} access`
                : `Revoke ${client.name} access`
            }
          />
        )}
      </div>
      {client.isRevoked ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(client)}
          disabled={
            deleteClient !== null || busyClient !== null || busyTool !== null
          }
        >
          {deleteClient === client.clientId ? (
            <LoaderCircle className="size-3.5 animate-spin" />
          ) : (
            <Trash2 className="size-3.5" />
          )}{" "}
          Delete access
        </Button>
      ) : null}
    </div>
  )
}
