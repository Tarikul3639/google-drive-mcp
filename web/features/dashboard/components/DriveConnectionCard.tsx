"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Cloud } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  useDisconnectDriveMutation,
  driveConnectUrl,
} from "@/features/dashboard/api/google-drive-api"
import type { GoogleDriveConnection } from "@/features/shared/types/api"

import { DriveConnectionStatus } from "./DriveConnectionStatus"
import { DrivePermissions } from "./DrivePermissions"

type Props = {
  connection: GoogleDriveConnection
  onConnectionChange: (connection: GoogleDriveConnection) => void
  onRefresh: () => Promise<void>
}

// Coordinate Google Drive connect and disconnect actions for the dashboard.
export function DriveConnectionCard({
  connection,
  onConnectionChange,
  onRefresh,
}: Props) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  const [disconnectDrive] = useDisconnectDriveMutation()
  const connected = connection.connected === true

  function beginConnect() {
    setBusy(true)
    window.location.assign(driveConnectUrl)
  }

  async function disconnect() {
    setBusy(true)
    setMessage("")
    try {
      await disconnectDrive().unwrap()
      onConnectionChange({ connected: false, email: null })
      setMessage("Google Drive access has been revoked.")
    } catch {
      setMessage("We could not disconnect Drive. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card className="relative min-w-0 overflow-hidden rounded-lg border-0 bg-primary text-primary-foreground">
      <div
        aria-hidden="true"
        className="absolute -top-20 -right-14 size-64 rounded-full border border-primary-foreground/20"
      />
      <div
        aria-hidden="true"
        className="absolute -top-8 -right-2 size-44 rounded-full border border-primary-foreground/15"
      />
      <CardHeader className="relative gap-2 p-4 sm:p-8">
        <div className="flex min-w-0 flex-col-reverse items-start justify-between gap-3 sm:flex-row sm:gap-4">
          <div>
            <Badge
              variant="secondary"
              className="rounded-full bg-primary-foreground/15 text-primary-foreground"
            >
              GOOGLE DRIVE
            </Badge>
            <CardTitle className="mt-2 max-w-full break-words font-serif text-2xl leading-tight tracking-tight sm:mt-3 sm:text-3xl">
              Your files, within reach.
            </CardTitle>
            <p className="mt-2 max-w-md text-xs leading-5 opacity-75 sm:text-sm">
              Connect your Drive to make its files available to your MCP
              compatible tools.
            </p>
          </div>
          <motion.span
            whileHover={{ rotate: 8, scale: 1.08 }}
            className="grid size-12 place-items-center rounded-[16px] bg-primary-foreground/10"
          >
            <Cloud className="size-5" />
          </motion.span>
        </div>
      </CardHeader>
      <CardContent className="relative min-w-0 space-y-3 px-4 pb-4 sm:space-y-4 sm:px-8 sm:pb-8">
        <DriveConnectionStatus
          connection={connection}
          busy={busy}
          onRefresh={() => void onRefresh()}
          onDisconnect={disconnect}
        />
        <DrivePermissions
          busy={busy}
          connected={connected}
          onConnect={beginConnect}
        />
        {message ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
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
