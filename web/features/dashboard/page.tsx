"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import {
  ArrowRight,
  CircleHelp,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import { DriveConnectionCard } from "./components/DriveConnectionCard"
import { DashboardShell } from "./components/DashboardShell"
import { McpAccessCard } from "./components/McpAccessCard"
import { authApi, googleDriveApi } from "@/features/shared/api/client"
import {
  readDriveConnection,
  readUserProfile,
} from "@/features/shared/api/normalize"
import type {
  GoogleDriveConnection,
  UserProfile,
} from "@/features/shared/types/api"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [connection, setConnection] = useState<GoogleDriveConnection>({
    connected: null,
    email: null,
  })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")

  const refreshConnection = useCallback(async () => {
    const response = await googleDriveApi.getStatus()
    setConnection(readDriveConnection(response.data))
  }, [])

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setLoadError("")
      try {
        const authResponse = await authApi.getCurrentUser().catch(() => null)
        const profileResponse = await authApi.getProfile()
        const profile =
          readUserProfile(profileResponse.data) ??
          readUserProfile(authResponse?.data)
        if (!profile) throw new Error("Your profile could not be loaded.")
        if (!active) return
        setUser(profile)

        try {
          const statusResponse = await googleDriveApi.getStatus()
          if (active) setConnection(readDriveConnection(statusResponse.data))
        } catch {
          if (active) setConnection({ connected: null, email: null })
        }
      } catch {
        if (active) router.replace("/login")
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [router])

  const updateStatus = useCallback(async () => {
    try {
      await refreshConnection()
      setLoadError("")
    } catch {
      setLoadError("We could not get the latest Drive status.")
    }
  }, [refreshConnection])

  if (loading || !user) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#f3f2ea] dark:bg-[#171a16]">
        <LoaderCircle
          aria-label="Loading your workspace"
          className="size-6 animate-spin text-[#7b8e4b]"
        />
      </main>
    )
  }

  return (
    <DashboardShell user={user}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-[9px] tracking-[0.18em] text-[#7b8e4b]"
            initial={{ opacity: 0, y: 8 }}
          >
            YOUR WORKSPACE / OVERVIEW
          </motion.p>
          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.96] tracking-[-0.07em]"
            initial={{ opacity: 0, y: 12 }}
            transition={{ delay: 0.05 }}
          >
            {user.name
              ? `Welcome, ${user.name.split(" ")[0]}.`
              : "Welcome back."}
          </motion.h1>
          <p className="mt-3 text-[12px] text-muted-foreground">
            A simple place to manage the bridge to your Drive.
          </p>
        </div>
        <a
          className="group flex items-center gap-2 rounded-full border border-foreground/10 px-4 py-2.5 text-[10px] text-muted-foreground transition hover:border-foreground/25 hover:text-foreground"
          href="#connection-help"
        >
          <CircleHelp className="size-3.5" /> How it works{" "}
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>

      {loadError ? (
        <p
          aria-live="polite"
          className="mb-4 rounded-xl border border-[#c88970]/30 bg-[#f5eae4] px-4 py-3 text-[11px] text-[#9b523e] dark:bg-[#3b2924] dark:text-[#efb29d]"
        >
          {loadError}
        </p>
      ) : null}

      <DriveConnectionCard
        connection={connection}
        onConnectionChange={setConnection}
        onRefresh={updateStatus}
      />

      <McpAccessCard />

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section
          className="rounded-[22px] border border-foreground/[0.08] bg-background p-6 sm:p-7"
          id="connection-help"
        >
          <span className="font-mono text-[9px] tracking-[0.19em] text-[#7b8e4b]">
            THE SHORT VERSION
          </span>
          <h2 className="mt-3 font-serif text-[27px] tracking-[-0.05em]">
            A bridge you can see.
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["01", "Connect", "Choose your Google account."],
              ["02", "Authorize", "Review access in Google's flow."],
              ["03", "Use", "Ask your MCP client for a file."],
            ].map(([number, title, body]) => (
              <div className="rounded-[15px] bg-muted/70 p-4" key={number}>
                <span className="font-mono text-[9px] text-muted-foreground">
                  /{number}
                </span>
                <h3 className="mt-3 text-[11px] font-semibold">{title}</h3>
                <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col justify-between rounded-[22px] border border-foreground/[0.08] bg-[#e9eddf] p-6 sm:p-7 dark:bg-[#252c20]">
          <div>
            <span className="grid size-9 place-items-center rounded-xl bg-background text-[#788852] dark:text-[#c5d87b]">
              <ShieldCheck className="size-4" />
            </span>
            <h2 className="mt-4 font-serif text-[26px] tracking-[-0.05em]">
              Your access, your call.
            </h2>
            <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
              Disconnect your Google Drive from here at any time. You can also
              review connected apps from your Google Account.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 font-mono text-[9px] tracking-[0.08em] text-[#667744] dark:text-[#c5d87b]">
            <Sparkles className="size-3.5" /> PRIVATE BY DESIGN
          </div>
        </section>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-foreground/[0.08] pt-5 text-[9px] text-muted-foreground">
        <span>{user.email}</span>
        <button
          className="underline decoration-foreground/20 underline-offset-4 transition hover:text-foreground"
          onClick={() => router.push("/account")}
          type="button"
        >
          Review profile settings
        </button>
      </div>
    </DashboardShell>
  )
}
