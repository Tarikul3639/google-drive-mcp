"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { Ban, LoaderCircle, ShieldCheck } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { mcpAccessApi } from "@/features/shared/api/client"
import type { AuthorizedMcpClient } from "@/features/shared/types/api"

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

  return value.filter(
    (item): item is AuthorizedMcpClient =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as AuthorizedMcpClient).clientId === "string" &&
      typeof (item as AuthorizedMcpClient).name === "string" &&
      typeof (item as AuthorizedMcpClient).grantedAt === "string"
  )
}

export function McpAccessCard() {
  const [clients, setClients] = useState<AuthorizedMcpClient[]>([])
  const [loading, setLoading] = useState(true)
  const [revoking, setRevoking] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [clientToRevoke, setClientToRevoke] =
    useState<AuthorizedMcpClient | null>(null)

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
    setRevoking(client.clientId)
    setMessage("")

    try {
      await mcpAccessApi.revoke(client.clientId)

      setClients((current) =>
        current.filter((item) => item.clientId !== client.clientId)
      )

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
          <motion.span
            {...fadeUp}
            transition={smoothReveal}
            className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-primary/10 text-primary"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={scrollViewport}
              transition={smoothReveal}
            >
              <ShieldCheck className="size-4" />
            </motion.span>
          </motion.span>

          <div className="min-w-0">
            <motion.div {...fadeIn} transition={smoothReveal}>
              <Badge
                variant="outline"
                className="font-mono text-xs tracking-wider text-primary"
              >
                AUTHORIZED APPS
              </Badge>
            </motion.div>

            <motion.div {...fadeUp} transition={smoothReveal}>
              <CardTitle className="mt-2 font-serif text-2xl tracking-tight">
                MCP client access
              </CardTitle>
            </motion.div>

            <motion.p
              {...fadeIn}
              transition={{ ...smoothReveal, delay: 0.08 }}
              className="mt-1 max-w-xl text-sm leading-5 text-muted-foreground"
            >
              Review the apps you approved and revoke any client whenever you
              want. Revoking also blocks its existing Drivebridge tokens.
            </motion.p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-7">
        {loading ? (
          <motion.div
            {...fadeIn}
            transition={smoothReveal}
            className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <LoaderCircle className="size-4 animate-spin" />
            Loading authorized apps…
          </motion.div>
        ) : clients.length ? (
          <div className="mt-5 divide-y">
            {clients.map((client, index) => (
              <motion.div
                key={client.clientId}
                {...fadeUp}
                transition={{
                  ...smoothReveal,
                  delay: index * 0.06,
                }}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <motion.h3
                    {...fadeIn}
                    transition={smoothReveal}
                    className="truncate text-sm font-semibold"
                  >
                    {client.name}
                  </motion.h3>

                  <motion.p
                    {...fadeIn}
                    transition={{ ...smoothReveal, delay: 0.04 }}
                    className="mt-1 text-sm text-muted-foreground"
                  >
                    Full Drivebridge access
                  </motion.p>

                  <motion.p
                    {...fadeIn}
                    transition={{ ...smoothReveal, delay: 0.08 }}
                    className="mt-1 text-xs text-muted-foreground/80"
                  >
                    Approved{" "}
                    {new Date(client.grantedAt).toLocaleDateString()}
                  </motion.p>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  className="h-9 w-fit rounded-full"
                  disabled={revoking !== null}
                  onClick={() => setClientToRevoke(client)}
                  type="button"
                >
                  <motion.span
                    whileHover={{ rotate: -8 }}
                    whileTap={{ scale: 0.9 }}
                    className="inline-flex"
                  >
                    {revoking === client.clientId ? (
                      <LoaderCircle className="size-3.5 animate-spin" />
                    ) : (
                      <Ban className="size-3.5" />
                    )}
                  </motion.span>
                  <motion.span {...fadeIn} transition={smoothReveal}>
                    Revoke access
                  </motion.span>
                </Button>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.p
            {...fadeUp}
            transition={smoothReveal}
            className="mt-5 rounded-xl bg-muted/60 px-4 py-3 text-sm leading-5 text-muted-foreground"
          >
            No MCP clients have been authorized yet. Approved clients will
            appear here.
          </motion.p>
        )}

        {message ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={smoothReveal}
          >
            <Alert className="mt-4">
              <AlertDescription aria-live="polite">
                {message}
              </AlertDescription>
            </Alert>
          </motion.div>
        ) : null}
      </CardContent>

      <Dialog
        open={clientToRevoke !== null}
        onOpenChange={(open) => {
          if (!open && !revoking) setClientToRevoke(null)
        }}
      >
        <DialogContent className="rounded-lg sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Revoke client access?</DialogTitle>
            <DialogDescription>
              {clientToRevoke
                ? `${clientToRevoke.name} will lose access to your Drivebridge account, including existing tokens.`
                : "This client will lose its access."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setClientToRevoke(null)}
              disabled={revoking !== null}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                if (clientToRevoke) {
                  void revoke(clientToRevoke)
                  setClientToRevoke(null)
                }
              }}
              disabled={revoking !== null}
            >
              <motion.span
                whileHover={{ rotate: -8 }}
                whileTap={{ scale: 0.9 }}
                className="inline-flex"
              >
                {revoking ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Ban className="size-4" />
                )}
              </motion.span>
              Revoke access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}