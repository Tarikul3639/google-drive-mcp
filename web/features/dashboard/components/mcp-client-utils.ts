import type { AuthorizedMcpClient } from "@/features/shared/types/api"

// Narrow the API payload to the authorized MCP client shape used by the UI.
export function readClients(value: unknown): AuthorizedMcpClient[] {
  if (!Array.isArray(value)) return []
  return value.filter(
    (item): item is AuthorizedMcpClient =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as AuthorizedMcpClient).clientId === "string" &&
      typeof (item as AuthorizedMcpClient).name === "string" &&
      typeof (item as AuthorizedMcpClient).grantedAt === "string" &&
      typeof (item as AuthorizedMcpClient).isRevoked === "boolean" &&
      Array.isArray((item as AuthorizedMcpClient).tools)
  )
}
