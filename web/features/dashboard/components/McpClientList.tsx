import { LoaderCircle } from "lucide-react"

import type {
  AuthorizedMcpClient,
  McpToolPermission,
} from "@/features/shared/types/api"
import { McpClientRow } from "./McpClientRow"

// Render the loading, empty, or populated authorized-client list.
export function McpClientList({
  loading,
  clients,
  busyClient,
  busyTool,
  deleteClient,
  onToggle,
  onRefresh,
  onDelete,
  onToolChange,
}: {
  loading: boolean
  clients: AuthorizedMcpClient[]
  busyClient: string | null
  busyTool: string | null
  deleteClient: string | null
  onToggle: (client: AuthorizedMcpClient, enabled: boolean) => void
  onRefresh: (client: AuthorizedMcpClient) => void
  onDelete: (client: AuthorizedMcpClient) => void
  onToolChange: (
    client: AuthorizedMcpClient,
    tool: McpToolPermission,
    enabled: boolean
  ) => void
}) {
  if (loading) {
    return (
      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <LoaderCircle className="size-4 animate-spin" /> Loading authorized
        apps…
      </div>
    )
  }
  if (!clients.length) {
    return (
      <p className="mt-5 rounded-xl bg-muted/60 px-4 py-3 text-sm leading-5 text-muted-foreground">
        No MCP clients have been authorized yet. Approved clients will appear
        here.
      </p>
    )
  }
  return (
    <div className="mt-5 space-y-3">
      {clients.map((client, index) => (
        <McpClientRow
          key={client.clientId}
          client={client}
          index={index}
          busyClient={busyClient}
          busyTool={busyTool}
          deleteClient={deleteClient}
          onToggle={onToggle}
          onRefresh={onRefresh}
          onDelete={onDelete}
          onToolChange={onToolChange}
        />
      ))}
    </div>
  )
}
