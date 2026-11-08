
"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Check,
  Cloud,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  Unplug,
} from "lucide-react"

import { googleDriveApi } from "@/features/shared/api/client"
import type { GoogleDriveConnection } from "@/features/shared/types/api"

type DriveConnectionCardProps = {
  connection: GoogleDriveConnection
  onConnectionChange: (connection: GoogleDriveConnection) => void
  onRefresh: () => Promise<void>
}

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

export function DriveConnectionCard({
  connection,
  onConnectionChange,
  onRefresh,
}: DriveConnectionCardProps) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")

  const isConnected = connection.connected === true

  function beginConnect() {
    setBusy(true)
    window.location.assign(googleDriveApi.connectUrl)
  }

  async function disconnect() {
    setBusy(true)
    setMessage("")

    try {
      await googleDriveApi.disconnect()
      onConnectionChange({ connected: false, email: null })
      setMessage("Google Drive access has been revoked.")
    } catch {
      setMessage("We could not disconnect Drive. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card className="relative overflow-hidden rounded-lg border-0 bg-primary text-primary-foreground">
      {/* Decorative circles */}
      <div
        aria-hidden="true"
        className="absolute -top-20 -right-14 size-64 rounded-full border border-primary-foreground/20"
      />
      <div
        aria-hidden="true"
        className="absolute -top-8 -right-2 size-44 rounded-full border border-primary-foreground/15"
      />

      <CardHeader className="relative gap-2 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <motion.div {...fadeIn} transition={smoothReveal}>
              <Badge
                variant="secondary"
                className="rounded-full bg-primary-foreground/15 text-primary-foreground"
              >
                GOOGLE DRIVE
              </Badge>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ ...smoothReveal, delay: 0.05 }}
            >
              <CardTitle className="mt-3 font-serif text-3xl tracking-tight">
                Your files, within reach.
              </CardTitle>
            </motion.div>

            <motion.p
              {...fadeIn}
              transition={{ ...smoothReveal, delay: 0.1 }}
              className="mt-2 max-w-md text-sm leading-5 opacity-75"
            >
              Connect your Drive to make its files available to your MCP
              compatible tools.
            </motion.p>
          </div>

          <motion.span
            {...fadeUp}
            transition={smoothReveal}
            className="grid size-12 place-items-center rounded-[16px] bg-primary-foreground/10"
          >
            <motion.span
              whileHover={{ rotate: 8, scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="inline-flex"
            >
              <Cloud className="size-5" />
            </motion.span>
          </motion.span>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4 px-6 pb-6 sm:px-8 sm:pb-8">
        {/* Connection status */}
        <motion.div
          {...fadeUp}
          transition={smoothReveal}
          className="flex flex-col justify-between gap-5 rounded-lg border border-primary-foreground/15 bg-primary-foreground/5 p-4 sm:flex-row sm:items-center sm:px-5"
        >
          <div className="flex items-center gap-3">
            <motion.span
              {...fadeIn}
              transition={smoothReveal}
              className="grid size-9 place-items-center rounded-xl bg-primary-foreground/15"
            >
              {isConnected ? (
                <Check className="size-4" />
              ) : (
                <Cloud className="size-4" />
              )}
            </motion.span>

            <span>
              <motion.span
                {...fadeIn}
                transition={smoothReveal}
                className="block text-sm font-medium"
              >
                {isConnected
                  ? "Drive is connected"
                  : connection.connected === false
                    ? "Drive is not connected"
                    : "Connection status unavailable"}
              </motion.span>

              <motion.span
                {...fadeIn}
                transition={{ ...smoothReveal, delay: 0.05 }}
                className="mt-1 block font-mono text-xs opacity-65"
              >
                {connection.email ??
                  (connection.connected === null
                    ? "Refresh to check the current status"
                    : "Google Drive access can be revoked anytime")}
              </motion.span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="h-10 rounded-full border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              disabled={busy}
              onClick={() => void onRefresh()}
              type="button"
            >
              <motion.span
                whileHover={{ rotate: 45 }}
                whileTap={{ scale: 0.9 }}
                className="inline-flex"
              >
                {busy ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <RefreshCw className="size-4" />
                )}
              </motion.span>
              Refresh
            </Button>

            {isConnected ? (
              <Button
                variant="secondary"
                className="h-10 rounded-full bg-primary-foreground/15 text-primary-foreground hover:bg-destructive hover:text-destructive-foreground"
                disabled={busy}
                onClick={disconnect}
                type="button"
              >
                <motion.span
                  whileHover={{ rotate: -8 }}
                  whileTap={{ scale: 0.9 }}
                  className="inline-flex"
                >
                  {busy ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Unplug className="size-4" />
                  )}
                </motion.span>
                Disconnect
              </Button>
            ) : null}
          </div>
        </motion.div>

        {/* Permissions */}
        <motion.div
          {...fadeUp}
          transition={{ ...smoothReveal, delay: 0.05 }}
          className="rounded-lg border border-primary-foreground/15 bg-primary-foreground/5 p-4 sm:p-5"
        >
          <div className="flex items-start gap-3">
            <motion.span
              {...fadeIn}
              transition={smoothReveal}
              className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary-foreground/10"
            >
              <ShieldCheck className="size-4" />
            </motion.span>

            <div>
              <motion.h3
                {...fadeIn}
                transition={smoothReveal}
                className="text-sm font-semibold"
              >
                Google Drive permissions
              </motion.h3>

              <motion.p
                {...fadeIn}
                transition={{ ...smoothReveal, delay: 0.05 }}
                className="mt-1 max-w-xl text-xs leading-5 opacity-70"
              >
                Drivebridge requests full access so it can view, create, edit,
                and delete files in your Google Drive. You can revoke access
                anytime.
              </motion.p>
            </div>
          </div>

          <Button
            className="mt-4 h-9 rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/85"
            disabled={busy}
            onClick={beginConnect}
            type="button"
          >
            <motion.span
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center"
            >
              {busy
                ? "Opening Google…"
                : isConnected
                  ? "Reconnect with full access"
                  : "Connect with full access"}
            </motion.span>
          </Button>
        </motion.div>

        {/* Feedback message */}
        {message ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={smoothReveal}
          >
            <Alert className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground">
              <AlertDescription className="text-primary-foreground">
                {message}
              </AlertDescription>
            </Alert>
          </motion.div>
        ) : null}
      </CardContent>
    </Card>
  )
}
