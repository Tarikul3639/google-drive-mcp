"use client"

import { useEffect, useState } from "react"

import { ThemeToggle } from "@/features/home/components/ThemeToggle"
import { useLazyGetProfileQuery } from "@/features/auth/api/auth-api"
import { readUserProfile } from "@/features/shared/api/normalize"
import type { UserProfile } from "@/features/shared/types/api"

import { WelcomeCard } from "./components/WelcomeCard"

// Load the signed-in profile and render the welcome screen.
export default function WelcomePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [getProfile] = useLazyGetProfileQuery()

  useEffect(() => {
    let active = true
    getProfile()
      .unwrap()
      .then((data) => {
        const profile = readUserProfile(data)
        if (active) {
          setUser(profile)
          setError(!profile)
        }
      })
      .catch(() => {
        if (active) setError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [getProfile])

  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-background px-5 py-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 size-110 rounded-full border border-primary/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -bottom-48 size-130 rounded-full border border-primary/15"
      />
      <div className="absolute top-5 right-5 sm:top-8 sm:right-8">
        <ThemeToggle />
      </div>
      <WelcomeCard user={user} loading={loading} error={error} />
    </main>
  )
}
