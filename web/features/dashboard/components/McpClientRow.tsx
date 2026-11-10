"use client"

import { useState } from "react"
import { motion } from "motion/react"

import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import type {
  AuthorizedMcpClient,
  McpToolPermission,
} from "@/features/shared/types/api"

import { McpClientSummary } from "./McpClientSummary"
import { McpClientControls } from "./McpClientControls"
import { McpClientTools } from "./McpClientTools"

// Display one connected MCP client and its expandable tool permissions.
export function McpClientRow({
  client,
  index,
  busyClient,
  busyTool,
  deleteClient,
  onToggle,
  onRefresh,
  onDelete,
  onToolChange,
}: {
  client: AuthorizedMcpClient
  index: number
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
  const [open, setOpen] = useState(false)
  const allowed = client.tools.filter((tool) => tool.isEnabled).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.04 }}
      className="rounded-xl border bg-card"
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex min-w-0 flex-col gap-3 p-3 sm:flex-row sm:items-center sm:p-4">
          <McpClientSummary client={client} allowed={allowed} open={open} />
          <McpClientControls
            client={client}
            busyClient={busyClient}
            busyTool={busyTool}
            deleteClient={deleteClient}
            onToggle={onToggle}
            onRefresh={onRefresh}
            onDelete={onDelete}
          />
        </div>
        <CollapsibleContent
          forceMount
          className="grid grid-rows-[0fr] overflow-hidden transition-[grid-template-rows] duration-500 ease-in-out data-[state=open]:grid-rows-[1fr]"
        >
          <div className="min-h-0 overflow-hidden">
            <McpClientTools
              client={client}
              busyTool={busyTool}
              busyClient={busyClient}
              deleteClient={deleteClient}
              onToolChange={onToolChange}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  )
}
