"use client"

import { useEffect, useState } from "react"
import { Ban, LoaderCircle, ShieldCheck } from "lucide-react"

import { mcpAccessApi } from "@/features/shared/api/client"
import type { AuthorizedMcpClient } from "@/features/shared/types/api"

function readClients(value: unknown): AuthorizedMcpClient[] {
  if (!Array.isArray(value)) return []
  return value.filter(
    (item): item is AuthorizedMcpClient =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as AuthorizedMcpClient).clientId === "string" &&
      typeof (item as AuthorizedMcpClient).name === "string" &&
      typeof (item as AuthorizedMcpClient).scopes === "string" &&
      typeof (item as AuthorizedMcpClient).grantedAt === "string",
  )
}

export function McpAccessCard() {
  const [clients, setClients] = useState<AuthorizedMcpClient[]>([])
  const [loading, setLoading] = useState(true)
  const [revoking, setRevoking] = useState<string | null>(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    let active = true
    mcpAccessApi
      .list()
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

  async function revoke(client: AuthorizedMcpClient) {
    if (!window.confirm(`Revoke ${client.name}'s access to your Drivebridge account?`)) {
      return
    }

    setRevoking(client.clientId)
    setMessage("")
    try {
      await mcpAccessApi.revoke(client.clientId)
      setClients((current) =>
        current.filter((item) => item.clientId !== client.clientId),
      )
      setMessage(`${client.name} access has been revoked.`)
    } catch {
      setMessage(`Could not revoke ${client.name}. Please try again.`)
    } finally {
      setRevoking(null)
    }
  }

  return (
    <section className="mt-5 rounded-[22px] border border-foreground/[0.08] bg-background p-5 sm:p-7">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-[#e9eddf] text-[#718342] dark:bg-[#303a28] dark:text-[#d5ed70]">
          <ShieldCheck className="size-4" />
        </span>
        <div>
          <p className="font-mono text-[9px] tracking-[0.18em] text-[#7b8e4b]">
            AUTHORIZED APPS
          </p>
          <h2 className="mt-1 font-serif text-[25px] tracking-[-0.05em]">
            MCP client access
          </h2>
          <p className="mt-1 max-w-xl text-[10px] leading-5 text-muted-foreground">
            Review the apps you approved and revoke any client whenever you
            want. Revoking also blocks its existing Drivebridge tokens.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 flex items-center gap-2 text-[10px] text-muted-foreground">
          <LoaderCircle className="size-3.5 animate-spin" />
          Loading authorized apps…
        </div>
      ) : clients.length ? (
        <div className="mt-5 divide-y divide-foreground/[0.08]">
          {clients.map((client) => (
            <div
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
              key={client.clientId}
            >
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[12px] font-semibold">{client.name}</h3>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Permissions: {client.scopes.split(" ").join(", ") || "None"}
                </p>
                <p className="mt-1 text-[9px] text-muted-foreground/80">
                  Approved {new Date(client.grantedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                className="flex h-9 w-fit items-center gap-2 rounded-full border border-[#b96351]/25 px-3.5 text-[10px] font-medium text-[#a34e3e] transition hover:bg-[#b96351]/10 disabled:opacity-50 dark:text-[#e6a393]"
                disabled={revoking !== null}
                onClick={() => void revoke(client)}
                type="button"
              >
                {revoking === client.clientId ? (
                  <LoaderCircle className="size-3.5 animate-spin" />
                ) : (
                  <Ban className="size-3.5" />
                )}
                Revoke access
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-xl bg-muted/60 px-4 py-3 text-[10px] leading-5 text-muted-foreground">
          No MCP clients have been authorized yet. Approved clients will appear
          here.
        </p>
      )}

      {message ? (
        <p aria-live="polite" className="mt-4 text-[10px] text-muted-foreground">
          {message}
        </p>
      ) : null}
    </section>
  )
}
