"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, LoaderCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DashboardShell } from "@/features/dashboard/components/DashboardShell"
import {
  useLazyGetProfileQuery,
  useLogoutMutation,
  useUpdateProfileMutation,
} from "@/features/auth/api/auth-api"
import { readUserProfile } from "@/features/shared/api/normalize"
import type { UserProfile } from "@/features/shared/types/api"

import { AccountProfileCard } from "./components/AccountProfileCard"
import { AccountGoogleCard } from "./components/AccountGoogleCard"
import { AccountSessionCard } from "./components/AccountSessionCard"

// Load the current profile and coordinate profile updates and sign-out.
export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [getProfile] = useLazyGetProfileQuery()
  const [logoutRequest] = useLogoutMutation()
  const [updateProfile] = useUpdateProfileMutation()

  useEffect(() => {
    let active = true
    getProfile()
      .unwrap()
      .then((data) => {
        const profile = readUserProfile(data)
        if (!profile) throw new Error("Profile data is unavailable.")
        if (active) {
          setUser(profile)
          setName(profile.name ?? "")
        }
      })
      .catch(() => {
        if (active) router.replace("/login")
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [getProfile, router])

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return
    setError("")
    setMessage("")
    const cleanName = name.trim()
    if (cleanName.length < 2 || cleanName.length > 100) {
      setError("Name must be between 2 and 100 characters.")
      return
    }
    setSaving(true)
    try {
      const updated = readUserProfile(
        await updateProfile({ name: cleanName }).unwrap()
      )
      if (!updated) throw new Error("The updated profile could not be read.")
      setUser(updated)
      setName(updated.name ?? cleanName)
      setMessage("Your name has been updated.")
    } catch {
      setError("We could not update your profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  async function signOut() {
    setSigningOut(true)
    try {
      await logoutRequest().unwrap()
    } catch {
      // The session may already be expired.
    } finally {
      router.replace("/")
    }
  }

  if (loading || !user) {
    return (
      <main className="grid min-h-svh place-items-center bg-background">
        <LoaderCircle
          aria-label="Loading your account"
          className="size-6 animate-spin text-primary"
        />
      </main>
    )
  }

  return (
    <DashboardShell user={user}>
      <Button
        variant="ghost"
        size="sm"
        className="mb-7 rounded-full text-muted-foreground"
        onClick={() => router.push("/dashboard")}
      >
        <ArrowLeft className="size-4" /> Workspace overview
      </Button>
      <p className="font-mono text-xs tracking-widest text-primary">
        YOUR WORKSPACE / ACCOUNT
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-none tracking-tight sm:text-5xl lg:text-6xl">
        Your details.
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Manage the profile connected to your Drivebridge account.
      </p>
      <AccountProfileCard
        user={user}
        name={name}
        onNameChange={setName}
        onSubmit={saveProfile}
        saving={saving}
        error={error}
        message={message}
      />
      <AccountGoogleCard onWorkspace={() => router.push("/dashboard")} />
      <AccountSessionCard signingOut={signingOut} onSignOut={signOut} />
    </DashboardShell>
  )
}
