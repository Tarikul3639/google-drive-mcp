
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

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

        if (!profile) {
          throw new Error("Your profile could not be loaded.")
        }

        if (!active) return

        setUser(profile)

        try {
          const statusResponse = await googleDriveApi.getStatus()

          if (active) {
            setConnection(readDriveConnection(statusResponse.data))
          }
        } catch {
          if (active) {
            setConnection({ connected: null, email: null })
          }
        }
      } catch {
        if (active) {
          router.replace("/login")
        }
      } finally {
        if (active) {
          setLoading(false)
        }
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
      <main className="grid min-h-svh place-items-center bg-background">
        <LoaderCircle
          aria-label="Loading your workspace"
          className="size-6 animate-spin text-primary"
        />
      </main>
    )
  }

  const steps = [
    ["01", "Connect", "Choose your Google account."],
    ["02", "Authorize", "Review access in Google's flow."],
    ["03", "Use", "Ask your MCP client for a file."],
  ]

  return (
    <DashboardShell user={user}>
      {/* Page heading */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <motion.p
            {...fadeIn}
            transition={smoothReveal}
            className="font-mono text-xs tracking-wider text-primary"
          >
            YOUR WORKSPACE / OVERVIEW
          </motion.p>

          <motion.h1
            {...fadeUp}
            transition={{ ...smoothReveal, delay: 0.05 }}
            className="mt-3 font-serif text-4xl leading-none tracking-tight sm:text-5xl lg:text-6xl"
          >
            {user.name
              ? `Welcome, ${user.name.split(" ")[0]}.`
              : "Welcome back."}
          </motion.h1>

          <motion.p
            {...fadeIn}
            transition={{ ...smoothReveal, delay: 0.1 }}
            className="mt-3 text-sm text-muted-foreground"
          >
            A simple place to manage the bridge to your Drive.
          </motion.p>
        </div>

        <motion.a
          {...fadeIn}
          transition={{ ...smoothReveal, delay: 0.12 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="group flex items-center gap-2 rounded-full border border-foreground/10 px-4 py-2.5 text-xs text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
          href="#connection-help"
        >
          <CircleHelp className="size-4" />
          How it works
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </motion.a>
      </div>

      {/* Error message */}
      {loadError ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={smoothReveal}
        >
          <Alert variant="destructive" className="mb-4 rounded-xl">
            <AlertDescription aria-live="polite">
              {loadError}
            </AlertDescription>
          </Alert>
        </motion.div>
      ) : null}

      {/* Main dashboard cards */}
      <DriveConnectionCard
        connection={connection}
        onConnectionChange={setConnection}
        onRefresh={updateStatus}
      />

      <McpAccessCard />

      {/* Information section */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card id="connection-help" className="rounded-lg">
          <CardHeader className="p-6 pb-0 sm:p-7 sm:pb-0">
            <motion.div {...fadeIn} transition={smoothReveal}>
              <Badge
                variant="outline"
                className="w-fit font-mono text-xs tracking-wider text-primary"
              >
                THE SHORT VERSION
              </Badge>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ ...smoothReveal, delay: 0.05 }}
            >
              <CardTitle className="mt-3 font-serif text-2xl tracking-tight sm:text-3xl">
                A bridge you can see.
              </CardTitle>
            </motion.div>
          </CardHeader>

          <CardContent className="p-6 sm:p-7">
            <div className="grid gap-3 sm:grid-cols-3">
              {steps.map(([number, title, body], index) => (
                <motion.div
                  key={number}
                  {...fadeUp}
                  transition={{
                    ...smoothReveal,
                    delay: index * 0.07,
                  }}
                  className="rounded-[15px] border bg-muted/50 p-4"
                >
                  <motion.span
                    {...fadeIn}
                    transition={smoothReveal}
                    className="font-mono text-xs text-muted-foreground"
                  >
                    /{number}
                  </motion.span>

                  <motion.h3
                    {...fadeIn}
                    transition={{ ...smoothReveal, delay: 0.04 }}
                    className="mt-3 text-sm font-semibold"
                  >
                    {title}
                  </motion.h3>

                  <motion.p
                    {...fadeIn}
                    transition={{ ...smoothReveal, delay: 0.08 }}
                    className="mt-1 text-xs leading-5 text-muted-foreground"
                  >
                    {body}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Privacy card */}
        <Card className="flex flex-col justify-between rounded-lg bg-secondary">
          <CardContent className="flex h-full flex-col justify-between p-6 sm:p-7">
            <div>
              <motion.span
                {...fadeUp}
                transition={smoothReveal}
                className="grid size-9 place-items-center rounded-xl bg-background text-primary"
              >
                <ShieldCheck className="size-4" />
              </motion.span>

              <motion.h2
                {...fadeUp}
                transition={{ ...smoothReveal, delay: 0.05 }}
                className="mt-4 font-serif text-2xl tracking-tight sm:text-3xl"
              >
                Your access, your call.
              </motion.h2>

              <motion.p
                {...fadeIn}
                transition={{ ...smoothReveal, delay: 0.1 }}
                className="mt-2 text-sm leading-5 text-muted-foreground"
              >
                Disconnect your Google Drive from here at any time. You can
                also review connected apps from your Google Account.
              </motion.p>
            </div>

            <motion.div
              {...fadeIn}
              transition={{ ...smoothReveal, delay: 0.12 }}
              className="mt-6 flex items-center gap-2 font-mono text-xs tracking-wider text-primary"
            >
              <Sparkles className="size-4" />
              PRIVATE BY DESIGN
            </motion.div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <motion.div
        {...fadeIn}
        transition={smoothReveal}
        className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-foreground/10 pt-5 text-xs text-muted-foreground"
      >
        <span>{user.email}</span>

        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-xs text-muted-foreground"
          onClick={() => router.push("/account")}
          type="button"
        >
          <motion.span
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center"
          >
            Review profile settings
          </motion.span>
        </Button>
      </motion.div>
    </DashboardShell>
  )
}
