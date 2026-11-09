"use client"

import { useState } from "react"

import {
  useDeleteClientAccessMutation,
  useRefreshClientToolsMutation,
  useRestoreClientMutation,
  useRevokeClientMutation,
  useSetClientToolAccessMutation,
} from "@/features/mcp/api/mcp-access-api"
import type {
  AuthorizedMcpClient,
  McpToolPermission,
} from "@/features/shared/types/api"

// Encapsulate mutations and pending state for MCP client access management.
export function useMcpAccessActions() {
  const [message, setMessage] = useState("")
  const [busyTool, setBusyTool] = useState<string | null>(null)
  const [busyClient, setBusyClient] = useState<string | null>(null)
  const [deleteClient, setDeleteClient] = useState<string | null>(null)
  const [setToolAccess] = useSetClientToolAccessMutation()
  const [refreshTools] = useRefreshClientToolsMutation()
  const [revoke] = useRevokeClientMutation()
  const [restore] = useRestoreClientMutation()
  const [removeAccess] = useDeleteClientAccessMutation()

  async function updateTool(
    client: AuthorizedMcpClient,
    tool: McpToolPermission,
    isEnabled: boolean
  ) {
    const key = client.clientId + ":" + tool.toolName
    setBusyTool(key)
    try {
      await setToolAccess({
        clientId: client.clientId,
        toolName: tool.toolName,
        isEnabled,
      }).unwrap()
      setMessage(
        `${tool.toolName} access ${isEnabled ? "allowed" : "blocked"} for ${client.name}.`
      )
    } catch {
      setMessage(`Could not update ${tool.toolName}. Please try again.`)
    } finally {
      setBusyTool(null)
    }
  }

  async function refreshClient(client: AuthorizedMcpClient) {
    setBusyClient(client.clientId)
    try {
      await refreshTools(client.clientId).unwrap()
      setMessage(`Tool list refreshed for ${client.name}.`)
    } catch {
      setMessage(`Could not refresh tools for ${client.name}.`)
    } finally {
      setBusyClient(null)
    }
  }

  async function toggleClient(client: AuthorizedMcpClient, enabled: boolean) {
    setBusyClient(client.clientId)
    try {
      if (enabled) {
        await restore(client.clientId).unwrap()
        await refreshTools(client.clientId).unwrap()
        setMessage(
          `${client.name} access restored. Reauthorize the app to obtain fresh tokens.`
        )
      } else {
        await revoke(client.clientId).unwrap()
        setMessage(`${client.name} access has been revoked.`)
      }
    } catch {
      setMessage(`Could not ${enabled ? "restore" : "revoke"} ${client.name}.`)
    } finally {
      setBusyClient(null)
    }
  }

  async function deleteClientAccess(client: AuthorizedMcpClient) {
    if (
      !window.confirm(
        `Permanently delete the access record for "${client.name}"?`
      )
    )
      return
    setDeleteClient(client.clientId)
    try {
      await removeAccess(client.clientId).unwrap()
      setMessage(`${client.name} access record has been permanently deleted.`)
    } catch {
      setMessage(`Could not delete ${client.name} access.`)
    } finally {
      setDeleteClient(null)
    }
  }

  return {
    message,
    busyTool,
    busyClient,
    deleteClient,
    updateTool,
    refreshClient,
    toggleClient,
    deleteClientAccess,
  }
}
