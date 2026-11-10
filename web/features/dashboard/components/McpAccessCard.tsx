"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { useGetAuthorizedClientsQuery } from "@/features/mcp/api/mcp-access-api"

import { McpAccessHeader } from "./McpAccessHeader"
import { McpClientList } from "./McpClientList"
import { readClients } from "./mcp-client-utils"
import { useMcpAccessActions } from "./useMcpAccessActions"

// Manage the authorized MCP clients and their individual tool permissions.
export function McpAccessCard() {
  const { data, isLoading } = useGetAuthorizedClientsQuery()
  const clients = readClients(data)
  const actions = useMcpAccessActions()

  return (
    <Card className="mt-4 min-w-0 rounded-lg sm:mt-5">
      <McpAccessHeader />
      <CardContent className="min-w-0 p-3 sm:p-7">
        <McpClientList
          loading={isLoading}
          clients={clients}
          busyClient={actions.busyClient}
          busyTool={actions.busyTool}
          deleteClient={actions.deleteClient}
          onToggle={actions.toggleClient}
          onRefresh={actions.refreshClient}
          onDelete={actions.deleteClientAccess}
          onToolChange={actions.updateTool}
        />
        {actions.message ? (
          <Alert className="mt-4">
            <AlertDescription aria-live="polite">
              {actions.message}
            </AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  )
}
