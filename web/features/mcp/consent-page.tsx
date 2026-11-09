"use client"

import { useEffect, useState } from "react"

import { ThemeToggle } from "@/features/home/components/ThemeToggle"
import {
  useLazyGetConsentQuery,
  useSubmitConsentMutation,
} from "@/features/mcp/api/mcp-consent-api"

import { ConsentCard } from "./components/ConsentCard"
import { ConsentPageFooter } from "./components/ConsentPageFooter"
import { readConsent, type ConsentDetails } from "./consent-types"

// Load the pending authorization and submit the user's allow-or-deny decision.
export default function McpConsentPage({
  transaction,
}: {
  transaction: string
}) {
  const [details, setDetails] = useState<ConsentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState<"allow" | "deny" | null>(null)
  const [error, setError] = useState("")
  const [getConsent] = useLazyGetConsentQuery()
  const [submitConsent] = useSubmitConsentMutation()

  useEffect(() => {
    let active = true
    if (!transaction)
      return () => {
        active = false
      }

    getConsent(transaction)
      .unwrap()
      .then((data) => {
        const consent = readConsent(data)
        if (!active) return
        if (consent) setDetails(consent)
        else setError("We couldn’t read the authorization request.")
      })
      .catch(() => {
        if (active)
          setError(
            "This authorization request has expired or is no longer valid. Start the connection again in your MCP client."
          )
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [getConsent, transaction])

  async function decide(decision: "allow" | "deny") {
    setSubmitting(decision)
    setError("")
    try {
      const data = await submitConsent({ transaction, decision }).unwrap()
      if (!data.redirectUrl) throw new Error("Missing authorization redirect.")
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
        <ConsentCard
          transaction={transaction}
          loading={loading}
          details={details}
          submitting={submitting}
          error={error}
          onDecision={decide}
        />
        <ConsentPageFooter />
      </div>
    </main>
  )
}
