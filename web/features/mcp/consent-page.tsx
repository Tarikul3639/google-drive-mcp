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

export default function McpConsentPage({ transaction }: { transaction: string }) {
  const [details, setDetails] = useState<ConsentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState<"allow" | "deny" | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    if (!transaction) {
      setError("This authorization link is missing its transaction ID.")
      setLoading(false)
      return
    }

    mcpConsentApi
      .get(transaction)
      .then(({ data }) => {
        const consent = readConsent(data)
        if (active) {
          if (consent) setDetails(consent)
          else setError("We couldn’t read the authorization request.")
        }
      })
      .catch(() => {
        if (active) {
          setError("This authorization request has expired or is no longer valid. Start the connection again in your MCP client.")
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
      if (!data.redirectUrl) throw new Error("Missing authorization redirect.")
      window.location.assign(data.redirectUrl)
    } catch {
      setSubmitting(null)
      setError("We couldn’t finish this choice. The request may have expired; start the connection again in your MCP client.")
    }
  }

  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-[#f5f4ed] px-5 py-10 text-[#25291f] dark:bg-[#171914] dark:text-[#f5f4ed]">
      <div className="pointer-events-none absolute -left-40 -top-40 size-[440px] rounded-full border border-[#81944f]/15 dark:border-[#c5d87b]/10" />
      <div className="pointer-events-none absolute -bottom-48 -right-24 size-[520px] rounded-full border border-[#81944f]/15 dark:border-[#c5d87b]/10" />

      <div className="absolute right-5 top-5 sm:right-8 sm:top-8">
        <ThemeToggle />
      </div>

      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-[560px] rounded-[30px] border border-[#25291f]/[0.08] bg-white/85 p-6 shadow-[0_28px_90px_-50px_rgba(37,41,31,0.3)] backdrop-blur-xl sm:p-10 dark:border-white/10 dark:bg-[#22251e]/90"
        initial={{ opacity: 0, y: 14 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-[14px] bg-[#d5ed70] text-[#25291f]">
            <ShieldCheck className="size-5" />
          </span>
          <span className="font-serif text-[21px] tracking-[-0.06em]">drivebridge</span>
          <span className="ml-auto rounded-full border border-foreground/10 px-3 py-1.5 font-mono text-[9px] tracking-[0.12em] text-muted-foreground">
            ACCESS REQUEST
          </span>
        </div>

        <div className="mt-9">
          <p className="font-mono text-[9px] tracking-[0.2em] text-[#718342] dark:text-[#c5d87b]">
            MCP CLIENT PERMISSIONS
          </p>
          <h1 className="mt-2 font-serif text-[clamp(2.2rem,7vw,3.4rem)] leading-[1] tracking-[-0.065em]">
            Review access
          </h1>
          <p className="mt-3 max-w-[420px] text-[12px] leading-6 text-[#66685f] dark:text-white/60">
            Check what this client can do with your Google Drive before you approve it.
          </p>
        </div>

        {loading ? (
          <div className="mt-8 flex items-center gap-3 rounded-[20px] border border-foreground/[0.08] bg-background/60 px-4 py-5 text-[11px] text-muted-foreground">
            <LoaderCircle className="size-4 animate-spin" />
            Loading authorization request…
          </div>
        ) : details ? (
          <>
            <div className="mt-7 rounded-[20px] border border-foreground/[0.08] bg-background/60 p-4">
              <p className="font-mono text-[9px] tracking-[0.15em] text-muted-foreground">
                REQUESTING APP
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-[15px] bg-[#e9eddf] font-serif text-xl text-[#61733d] dark:bg-[#303a28] dark:text-[#d5ed70]">
                  {details.client.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold">{details.client.name}</span>
                  <span className="mt-1 block truncate text-[10px] text-muted-foreground">Connect to your Drivebridge account</span>
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </div>
            </div>

            <div className="mt-6 rounded-[17px] border border-foreground/[0.08] px-4 py-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-[#e9eddf] text-[#718342] dark:bg-[#303a28] dark:text-[#d5ed70]">
                  <ShieldCheck className="size-4" />
                </span>
                <span>
                  <span className="block text-[11px] font-semibold">Full Drivebridge access</span>
                  <span className="mt-1 block text-[10px] leading-5 text-muted-foreground">
                    This client can read and make changes to your Google Drive through Drivebridge. You can revoke access anytime.
                  </span>
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-2.5 rounded-[15px] bg-[#f3f2ea] px-3.5 py-3 text-[10px] leading-5 text-[#66685f] dark:bg-white/[0.04] dark:text-white/55">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-[#718342] dark:text-[#c5d87b]" />
              You can revoke this client’s access anytime from your account settings.
            </div>
          </>
        ) : (
          <div className="mt-7 flex items-start gap-3 rounded-[18px] border border-[#b96351]/20 bg-[#b96351]/[0.06] px-4 py-4 text-[11px] leading-5 text-[#8e493c] dark:text-[#e6a393]">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <p>{error || "This authorization request is unavailable."}</p>
          </div>
        )}

        {error && details ? (
          <p aria-live="polite" className="mt-3 text-[10px] text-[#a34e3e] dark:text-[#e6a393]">{error}</p>
        ) : null}

        {details ? (
          <div className="mt-7 grid gap-2.5 sm:grid-cols-[1fr_auto]">
            <button
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#25291f] px-6 text-[11px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#46533a] disabled:cursor-wait disabled:opacity-60 dark:bg-[#d5ed70] dark:text-[#25291f] dark:hover:bg-[#e0f58a]"
              disabled={submitting !== null || loading}
              onClick={() => void decide("allow")}
              type="button"
            >
              {submitting === "allow" ? <LoaderCircle className="size-4 animate-spin" /> : <Check className="size-4" />}
              Allow access
            </button>
            <button
              className="flex h-12 items-center justify-center gap-2 rounded-full border border-foreground/15 px-6 text-[11px] font-semibold transition hover:bg-muted disabled:cursor-wait disabled:opacity-60"
              disabled={submitting !== null || loading}
              onClick={() => void decide("deny")}
              type="button"
            >
              {submitting === "deny" ? <LoaderCircle className="size-4 animate-spin" /> : <X className="size-4" />}
              Deny
            </button>
          </div>
        ) : null}

        <p className="mt-5 text-center text-[9px] leading-5 text-muted-foreground">
          Only approve clients you recognize. You can change your mind later.
        </p>
      </motion.section>
    </main>
  )
}
