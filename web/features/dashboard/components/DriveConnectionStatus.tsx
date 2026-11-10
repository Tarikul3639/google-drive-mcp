"use client"

import { motion } from "motion/react"
import { Check, Cloud, LoaderCircle, RefreshCw, Unplug } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { GoogleDriveConnection } from "@/features/shared/types/api"

type Props = {
  connection: GoogleDriveConnection
  busy: boolean
  onRefresh: () => void
  onDisconnect: () => void
}

// Display the current Google Drive connection state and actions.
export function DriveConnectionStatus({
  connection,
  busy,
  onRefresh,
  onDisconnect,
}: Props) {
  const connected = connection.connected === true

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="flex flex-col justify-between gap-5 rounded-lg border border-primary-foreground/15 bg-primary-foreground/5 p-4 sm:flex-row sm:items-center sm:px-5"
    >
      <div className="flex min-w-0 items-start gap-3 sm:items-center">
        <span className="grid size-9 place-items-center rounded-xl bg-primary-foreground/15">
          {connected ? (
            <Check className="size-4" />
          ) : (
            <Cloud className="size-4" />
          )}
        </span>
        <span>
          <span className="block text-sm font-medium">
            {connected
              ? "Drive is connected"
              : connection.connected === false
                ? "Drive is not connected"
                : "Connection status unavailable"}
          </span>
          <span className="mt-1 block break-all font-mono text-[10px] leading-4 opacity-65 sm:text-xs">
            {connection.email ??
              (connection.connected === null
                ? "Refresh to check the current status"
                : "Google Drive access can be revoked anytime")}
          </span>
        </span>
      </div>
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
        <Button
          variant="outline"
          className="h-10 w-full rounded-full border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto"
          disabled={busy}
          onClick={onRefresh}
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
        {connected ? (
          <Button
            variant="secondary"
            className="h-10 w-full rounded-full bg-primary-foreground/15 text-primary-foreground hover:bg-destructive hover:text-destructive-foreground sm:w-auto"
            disabled={busy}
            onClick={onDisconnect}
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
  )
}
