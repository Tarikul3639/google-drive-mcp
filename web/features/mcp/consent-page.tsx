"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  LoaderCircle,
  ShieldCheck,
  X,
} from "lucide-react"

import { ThemeToggle } from "@/features/home/components/ThemeToggle"
import { mcpConsentApi } from "@/features/shared/api/client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type ConsentDetails = {
  transaction: string
  client: { clientId: string; name: string }
}

function readConsent(value: unknown): ConsentDetails | null {
  if (typeof value !== "object" || value === null) return null

  const candidate = value as Partial<ConsentDetails>

  if (
    typeof candidate.transaction !== "string" ||
    typeof candidate.client?.clientId !== "string" ||
    typeof candidate.client.name !== "string"
  ) {
    return null
  }

  return candidate as ConsentDetails
}

const scrollViewport = {
  once: false,
  amount: 0.2,
  margin: "-5% 0px -5% 0px",
} as const

const smoothReveal = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1] as const,
}

const fadeUp = {
  initial: { opacity: 0, y: 5 },
  whileInView: { opacity: 1, y: 0 },
  viewport: scrollViewport,
}

const fadeIn = {
  initial: { opacity: 0, y: 3 },
  whileInView: { opacity: 1, y: 0 },
  viewport: scrollViewport,
}

export default function McpConsentPage({
  transaction,
}: {
  transaction: string
}) {
  const [details, setDetails] = useState<ConsentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState<"allow" | "deny" | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    if (!transaction) {
      setLoading(false)
      return
    }

    mcpConsentApi
      .get(transaction)
      .then(({ data }) => {
        const consent = readConsent(data)

        if (active) {
          if (consent) {
            setDetails(consent)
          } else {
            setError("We couldn’t read the authorization request.")
          }
        }
      })
      .catch(() => {
        if (active) {
          setError(
            "This authorization request has expired or is no longer valid. Start the connection again in your MCP client."
          )
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [transaction])

  async function decide(decision: "allow" | "deny") {
    setSubmitting(decision)
    setError("")

    try {
      const { data } = await mcpConsentApi.submit(transaction, decision)

      if (!data.redirectUrl) {
        throw new Error("Missing authorization redirect.")
      }

      window.location.assign(data.redirectUrl)
    } catch {
      setSubmitting(null)
      setError(
        "We couldn’t finish this choice. The request may have expired; start the connection again in your MCP client."
      )
    }
  }

  return (
    <main className="relative isolate grid min-h-svh place-items-center overflow-clip bg-background px-4 py-8 text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-32 -z-10 size-64 rounded-full bg-primary/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 -right-32 -z-10 size-64 rounded-full bg-violet-400/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 -z-10 size-64 rounded-full bg-cyan-400/10 blur-3xl"
      />

      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-sm">
        <Card className="rounded-xl border-border/80 bg-card/95 shadow-lg backdrop-blur-xl">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <motion.span
                {...fadeIn}
                transition={smoothReveal}
                className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground"
              >
                <ShieldCheck className="size-4" />
              </motion.span>

              <motion.span
                {...fadeUp}
                transition={smoothReveal}
                className="font-serif text-lg tracking-tight"
              >
                drivebridge
              </motion.span>

              <motion.div
                {...fadeIn}
                transition={{ ...smoothReveal, delay: 0.05 }}
                className="ml-auto"
              >
                <Badge
                  variant="outline"
                  className="rounded-full px-2 py-0.5 font-mono text-[9px] tracking-wider text-muted-foreground"
                >
                  ACCESS REQUEST
                </Badge>
              </motion.div>
            </div>

            <div className="mt-5">
              <motion.p
                {...fadeUp}
                transition={smoothReveal}
                className="font-mono text-[9px] tracking-widest text-primary"
              >
                MCP CLIENT PERMISSIONS
              </motion.p>

              <motion.h1
                {...fadeUp}
                transition={{ ...smoothReveal, delay: 0.05 }}
                className="mt-1.5 font-serif text-2xl tracking-tight"
              >
                Review access
              </motion.h1>

              <motion.p
                {...fadeUp}
                transition={{ ...smoothReveal, delay: 0.1 }}
                className="mt-1.5 text-xs leading-5 text-muted-foreground"
              >
                Check what this client can do with your Google Drive before you
                approve it.
              </motion.p>
            </div>

            {!transaction ? (
              <Alert variant="destructive" className="mt-4 rounded-lg py-2.5">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                <AlertDescription className="text-xs">
                  This authorization link is missing its transaction ID.
                </AlertDescription>
              </Alert>
            ) : loading ? (
              <div className="mt-4 flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-3 text-xs text-muted-foreground">
                <LoaderCircle className="size-3.5 animate-spin" />
                Loading authorization request…
              </div>
            ) : details ? (
              <>
                <Card className="mt-4 rounded-lg bg-muted/30 shadow-none">
                  <CardContent className="p-3">
                    <motion.p
                      {...fadeUp}
                      transition={smoothReveal}
                      className="font-mono text-[9px] tracking-widest text-muted-foreground"
                    >
                      REQUESTING APP
                    </motion.p>

                    <div className="mt-2 flex items-center gap-2.5">
                      <motion.span
                        {...fadeIn}
                        transition={smoothReveal}
                        className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 font-serif text-base text-primary"
                      >
                        {details.client.name.slice(0, 1).toUpperCase()}
                      </motion.span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-semibold">
                          {details.client.name}
                        </span>

                        <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                          Connect to your Drivebridge account
                        </span>
                      </span>

                      <motion.span
                        whileHover={{ x: 2, y: -2 }}
                        className="inline-flex"
                      >
                        <ArrowUpRight className="size-3.5 text-muted-foreground" />
                      </motion.span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-2.5 rounded-lg shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2.5">
                      <motion.span
                        {...fadeIn}
                        transition={smoothReveal}
                        whileHover={{ rotate: 8, scale: 1.05 }}
                        className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"
                      >
                        <ShieldCheck className="size-3.5" />
                      </motion.span>

                      <span className="min-w-0">
                        <span className="block text-xs font-semibold">
                          Full Drivebridge access
                        </span>

                        <span className="mt-1 block text-[11px] leading-4 text-muted-foreground">
                          This client can read and make changes to your Google
                          Drive through Drivebridge. You can revoke access
                          anytime.
                        </span>
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <motion.div
                  {...fadeIn}
                  transition={{ ...smoothReveal, delay: 0.05 }}
                  className="mt-2.5 flex items-start gap-2 rounded-lg bg-muted px-3 py-2 text-[11px] leading-4 text-muted-foreground"
                >
                  <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" />

                  <span>
                    You can revoke this client’s access anytime from your
                    account settings.
                  </span>
                </motion.div>
              </>
            ) : (
              <Alert variant="destructive" className="mt-4 rounded-lg py-2.5">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                <AlertDescription className="text-xs">
                  {error || "This authorization request is unavailable."}
                </AlertDescription>
              </Alert>
            )}

            {error && details ? (
              <Alert variant="destructive" className="mt-2.5 rounded-lg py-2">
                <AlertDescription aria-live="polite" className="text-xs">
                  {error}
                </AlertDescription>
              </Alert>
            ) : null}

            {details ? (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button
                  className="h-9 rounded-full px-3 text-xs"
                  disabled={submitting !== null || loading}
                  onClick={() => void decide("allow")}
                  type="button"
                >
                  {submitting === "allow" ? (
                    <LoaderCircle className="size-3.5 animate-spin" />
                  ) : (
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="inline-flex"
                    >
                      <Check className="size-3.5" />
                    </motion.span>
                  )}

                  {submitting === "allow" ? "Allowing…" : "Allow access"}
                </Button>

                <Button
                  variant="outline"
                  className="h-9 rounded-full px-3 text-xs"
                  disabled={submitting !== null || loading}
                  onClick={() => void decide("deny")}
                  type="button"
                >
                  {submitting === "deny" ? (
                    <LoaderCircle className="size-3.5 animate-spin" />
                  ) : (
                    <motion.span
                      whileHover={{ rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="inline-flex"
                    >
                      <X className="size-3.5" />
                    </motion.span>
                  )}

                  {submitting === "deny" ? "Denying…" : "Deny"}
                </Button>
              </div>
            ) : null}

            <motion.p
              {...fadeIn}
              transition={{ ...smoothReveal, delay: 0.1 }}
              className="mt-4 text-center text-[11px] leading-4 text-muted-foreground"
            >
              Only approve clients you recognize. You can change your mind
              later.
            </motion.p>
          </CardContent>
        </Card>

        <motion.p
          {...fadeIn}
          transition={{ ...smoothReveal, delay: 0.15 }}
          className="mt-3 text-center text-[11px] text-muted-foreground"
        >
          Secure access powered by Drivebridge
        </motion.p>
      </div>
    </main>
  )
}
