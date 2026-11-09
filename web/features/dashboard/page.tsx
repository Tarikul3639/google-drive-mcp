"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoaderCircle } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardShell } from "./components/DashboardShell"
import { DriveConnectionCard } from "./components/DriveConnectionCard"
import { McpAccessCard } from "./components/McpAccessCard"
import { DashboardHeading } from "./components/DashboardHeading"
import { DashboardInfoSection } from "./components/DashboardInfoSection"
import { DashboardFooter } from "./components/DashboardFooter"
import {
  useLazyGetCurrentUserQuery,
  useLazyGetProfileQuery,
} from "@/features/auth/api/auth-api"
import { useLazyGetDriveStatusQuery } from "@/features/dashboard/api/google-drive-api"
import {
  readDriveConnection,
  readUserProfile,
} from "@/features/shared/api/normalize"
import type {
  GoogleDriveConnection,
  UserProfile,
} from "@/features/shared/types/api"

// Load account and Drive status, then compose the dashboard sections.
export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [connection, setConnection] = useState<GoogleDriveConnection>({
    connected: null,
    email: null,
  })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [getCurrentUser] = useLazyGetCurrentUserQuery()
  const [getProfile] = useLazyGetProfileQuery()
  const [getDriveStatus] = useLazyGetDriveStatusQuery()

  const refreshConnection = useCallback(async () => {
    const response = await getDriveStatus().unwrap()
    setConnection(readDriveConnection(response))
  }, [getDriveStatus])

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      setLoading(true)
      setLoadError("")
      try {
        const authResponse = await getCurrentUser()
          .unwrap()
          .catch(() => null)
        const profileResponse = await getProfile().unwrap()
        const profile =
          readUserProfile(profileResponse) ?? readUserProfile(authResponse)

        if (!profile) throw new Error("Your profile could not be loaded.")
        if (!active) return
        setUser(profile)

        try {
          const status = await getDriveStatus().unwrap()
          if (active) setConnection(readDriveConnection(status))
        } catch {
          if (active) setConnection({ connected: null, email: null })
        }
      } catch {
        if (active) router.replace("/login")
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadDashboard()
    return () => {
      active = false
    }
  }, [getCurrentUser, getDriveStatus, getProfile, router])

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

  return (
    <DashboardShell user={user}>
      <DashboardHeading user={user} />
      {loadError ? (
        <Alert variant="destructive" className="mb-4 rounded-xl">
          <AlertDescription aria-live="polite">{loadError}</AlertDescription>
        </Alert>
      ) : null}
      <DriveConnectionCard
        connection={connection}
        onConnectionChange={setConnection}
        onRefresh={updateStatus}
      />
      <McpAccessCard />
      <DashboardInfoSection />
      <DashboardFooter
        email={user.email}
        onAccount={() => router.push("/account")}
      />
    </DashboardShell>
  )
}
