import type {
  AuthorizedMcpClient,
  McpToolPermission,
} from "@/features/shared/types/api"

import { McpToolRow } from "./McpToolRow"

// Render the expandable tool permission list for a connected MCP client.
export function McpClientTools({
  client,
  busyTool,
  busyClient,
  deleteClient,
  onToolChange,
}: {
  client: AuthorizedMcpClient
  busyTool: string | null
  busyClient: string | null
  deleteClient: string | null
  onToolChange: (
    client: AuthorizedMcpClient,
    tool: McpToolPermission,
    enabled: boolean
  ) => void
}) {
  return (
    <div className="border-t px-4 pt-3 pb-4">
      <div className="grid gap-2 sm:grid-cols-2">
        {client.tools.map((tool) => (
          <McpToolRow
            key={tool.toolName}
            client={client}
            tool={tool}
            pending={busyTool === client.clientId + ":" + tool.toolName}
            disabled={
              busyTool !== null ||
              busyClient !== null ||
              deleteClient !== null ||
              client.isRevoked
            }
            onChange={onToolChange}
          />
        ))}
      </div>
      {!client.tools.length ? (
        <p className="py-3 text-sm text-muted-foreground">
          No tools are available for this client yet.
        </p>
      ) : null}
    </div>
  )
}
