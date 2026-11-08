"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { Ban, Check, ChevronDown, LoaderCircle, RefreshCw, ShieldCheck } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Switch } from "@/components/ui/switch"

import { mcpAccessApi } from "@/features/shared/api/client"
import type { AuthorizedMcpClient, McpToolPermission } from "@/features/shared/types/api"

const scrollViewport = {
  once: false,
  amount: 0.2,
  margin: "-5% 0px -5% 0px",
} as const

const smoothReveal = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as const,
}

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  whileInView: { opacity: 1, y: 0 },
  viewport: scrollViewport,
}

const fadeIn = {
  initial: { opacity: 0, y: 4 },
  whileInView: { opacity: 1, y: 0 },
  viewport: scrollViewport,
}

function readClients(value: unknown): AuthorizedMcpClient[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is AuthorizedMcpClient =>
    typeof item === "object" &&
    item !== null &&
    typeof (item as AuthorizedMcpClient).clientId === "string" &&
    typeof (item as AuthorizedMcpClient).name === "string" &&
    typeof (item as AuthorizedMcpClient).grantedAt === "string" &&
    Array.isArray((item as AuthorizedMcpClient).tools)
  )
}

export function McpAccessCard() {
  const [clients, setClients] = useState<AuthorizedMcpClient[]>([])
  const [openClients, setOpenClients] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [busyTool, setBusyTool] = useState<string | null>(null)
  const [refreshingClient, setRefreshingClient] = useState<string | null>(null)
  const [revoking, setRevoking] = useState<string | null>(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    let active = true

    mcpAccessApi.list()
      .then(({ data }) => {
        if (active) setClients(readClients(data))
      })
      .catch(() => {
        if (active) setMessage("Could not load connected MCP clients.")
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  // Update one tool permission and reflect the result without reloading the client list.
  async function updateTool(client: AuthorizedMcpClient, tool: McpToolPermission, isEnabled: boolean) {
    const key = client.clientId + ":" + tool.toolName
    setBusyTool(key)
    setMessage("")

    try {
      await mcpAccessApi.setToolAccess(client.clientId, tool.toolName, isEnabled)
      setClients(current => current.map(item => item.clientId === client.clientId
        ? { ...item, tools: item.tools.map(entry => entry.toolName === tool.toolName ? { ...entry, isEnabled } : entry) }
        : item))
      setMessage(`${tool.toolName} access ${isEnabled ? "allowed" : "blocked"} for ${client.name}.`)
    } catch {
      setMessage(`Could not update ${tool.toolName}. Please try again.`)
    } finally {
      setBusyTool(null)
    }
  }

  // Sync newly added server tools for the selected OAuth client.
  async function refreshTools(client: AuthorizedMcpClient) {
    setRefreshingClient(client.clientId)
    setMessage("")

    try {
      const { data } = await mcpAccessApi.refreshTools(client.clientId)
      const tools = Array.isArray(data) ? data as McpToolPermission[] : []
      setClients(current => current.map(item => item.clientId === client.clientId ? { ...item, tools } : item))
      setMessage(`Tool list refreshed for ${client.name}.`)
    } catch {
      setMessage(`Could not refresh tools for ${client.name}.`)
    } finally {
      setRefreshingClient(null)
    }
  }

  // Revoke the selected client's authorization and remove it from this list.
  async function revoke(client: AuthorizedMcpClient) {
    setRevoking(client.clientId)
    setMessage("")

    try {
      await mcpAccessApi.revoke(client.clientId)
      setClients(current => current.filter(item => item.clientId !== client.clientId))
      setMessage(`${client.name} access has been revoked.`)
    } catch {
      setMessage(`Could not revoke ${client.name}. Please try again.`)
    } finally {
      setRevoking(null)
    }
  }

  return (
    <Card className="mt-5 rounded-lg">
      <CardHeader className="p-5 pb-0 sm:p-7 sm:pb-0">
        <div className="flex items-start gap-3">
          <motion.span {...fadeUp} transition={smoothReveal} className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-primary/10 text-primary">
            <ShieldCheck className="size-4" />
          </motion.span>
          <div className="min-w-0">
            <motion.div {...fadeIn} transition={smoothReveal}>
              <Badge variant="outline" className="font-mono text-xs tracking-wider text-primary">AUTHORIZED APPS</Badge>
            </motion.div>
            <motion.div {...fadeUp} transition={smoothReveal}>
              <CardTitle className="mt-2 font-serif text-2xl tracking-tight">MCP client access</CardTitle>
            </motion.div>
            <motion.p {...fadeIn} transition={{ ...smoothReveal, delay: 0.08 }} className="mt-1 max-w-xl text-sm leading-5 text-muted-foreground">
              Choose exactly which Drivebridge tools each connected app can use. You can refresh the tool list when new tools are added.
            </motion.p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-7">
        {loading ? (
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <LoaderCircle className="size-4 animate-spin" /> Loading authorized apps…
          </div>
        ) : clients.length ? (
          <div className="mt-5 space-y-3">
            {clients.map((client, index) => {
              const isOpen = Boolean(openClients[client.clientId])
              const allowedCount = client.tools.filter(tool => tool.isEnabled).length

              return (
                <motion.div
                  key={client.clientId}
                  {...fadeUp}
                  transition={{ ...smoothReveal, delay: index * 0.04 }}
                  className="rounded-xl border bg-card"
                >
                  <Collapsible
                    open={isOpen}
                    onOpenChange={open => setOpenClients(current => ({ ...current, [client.clientId]: open }))}
                  >
                    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                      <CollapsibleTrigger className="group flex min-w-0 flex-1 items-center gap-3 text-left outline-none">
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                          <ShieldCheck className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{client.name}</span>
                          <span className="mt-1 block text-xs text-muted-foreground">
                            Approved {new Date(client.grantedAt).toLocaleDateString()}
                          </span>
                          <span className="mt-1 block text-xs text-muted-foreground">
                            {allowedCount} of {client.tools.length} tools allowed
                          </span>
                        </span>
                        <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-out ${isOpen ? "rotate-180" : ""}`} />
                      </CollapsibleTrigger>

                      <div className="flex shrink-0 flex-wrap gap-2 sm:pl-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-9 rounded-full"
                          onClick={() => void refreshTools(client)}
                          disabled={refreshingClient !== null || revoking !== null}
                        >
                          {refreshingClient === client.clientId ? <LoaderCircle className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
                          Refresh tools
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="h-9 rounded-full"
                          onClick={() => void revoke(client)}
                          disabled={revoking !== null || refreshingClient !== null}
                        >
                          {revoking === client.clientId ? <LoaderCircle className="size-3.5 animate-spin" /> : <Ban className="size-3.5" />}
                          Revoke client
                        </Button>
                      </div>
                    </div>

                    <CollapsibleContent
                      forceMount
                      className="grid grid-rows-[0fr] overflow-hidden transition-[grid-template-rows] duration-500 ease-in-out data-[state=open]:grid-rows-[1fr]"
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div className="border-t px-4 pb-4 pt-3">
                          <div className="grid gap-2 sm:grid-cols-2">
                            {client.tools.map(tool => {
                              const key = client.clientId + ":" + tool.toolName
                              const pending = busyTool === key

                              return (
                                <div key={tool.toolName} className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3 py-2.5">
                                  <div className="flex min-w-0 items-center gap-2">
                                    <span className={tool.isEnabled ? "text-primary" : "text-muted-foreground"}>
                                      {tool.isEnabled ? <Check className="size-3.5" /> : <Ban className="size-3.5" />}
                                    </span>
                                    <span className="truncate font-mono text-xs">{tool.toolName}</span>
                                  </div>
                                  <div className="flex shrink-0 items-center gap-2">
                                    <span className="text-[10px] text-muted-foreground">{tool.isEnabled ? "Allowed" : "Blocked"}</span>
                                    {pending ? <LoaderCircle className="size-4 animate-spin" /> : (
                                      <Switch
                                        checked={tool.isEnabled}
                                        onCheckedChange={checked => void updateTool(client, tool, checked)}
                                        disabled={busyTool !== null || refreshingClient !== null || revoking !== null}
                                        aria-label={`${tool.isEnabled ? "Block" : "Allow"} ${tool.toolName}`}
                                      />
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                          {!client.tools.length ? (
                            <p className="py-3 text-sm text-muted-foreground">No tools are available for this client yet.</p>
                          ) : null}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <motion.p {...fadeUp} transition={smoothReveal} className="mt-5 rounded-xl bg-muted/60 px-4 py-3 text-sm leading-5 text-muted-foreground">
            No MCP clients have been authorized yet. Approved clients will appear here.
          </motion.p>
        )}

        {message ? (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={smoothReveal}>
            <Alert className="mt-4"><AlertDescription aria-live="polite">{message}</AlertDescription></Alert>
          </motion.div>
        ) : null}
      </CardContent>
    </Card>
  )
}
