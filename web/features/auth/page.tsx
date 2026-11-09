"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { useLazyGetProfileQuery } from "@/features/auth/api/auth-api"
import { readUserProfile } from "@/features/shared/api/normalize"

import { LoginBrandPanel } from "./components/LoginBrandPanel"
import { LoginFormPanel } from "./components/LoginFormPanel"

// Check for an existing session and start Google OAuth when needed.
export default function LoginPage() {
  const router = useRouter()
  const [starting, setStarting] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [getProfile] = useLazyGetProfileQuery()

  useEffect(() => {
    let active = true
    getProfile()
      .unwrap()
      .then((data) => {
        if (readUserProfile(data)) {
          router.replace("/dashboard")
          return
        }
        if (active) setCheckingSession(false)
      })
      .catch(() => {
        if (active) setCheckingSession(false)
      })

    return () => {
      active = false
    }
  }, [getProfile, router])

  function startGoogleLogin() {
    setStarting(true)
    window.location.assign("/api/auth/google")
  }

  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-[1fr_0.92fr]">
      <LoginBrandPanel />
      <LoginFormPanel
        checkingSession={checkingSession}
        starting={starting}
        onGoogleLogin={startGoogleLogin}
      />
    </main>
  )
}
