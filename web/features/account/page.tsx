"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import {
  ArrowLeft,
  Check,
  LoaderCircle,
  LogOut,
  Save,
  ShieldCheck,
} from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DashboardShell } from "@/features/dashboard/components/DashboardShell"
import { authApi } from "@/features/shared/api/client"
import { readUserProfile } from "@/features/shared/api/normalize"
import type { UserProfile } from "@/features/shared/types/api"

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
  initial: { opacity: 0, y: 5 },
  whileInView: { opacity: 1, y: 0 },
  viewport: scrollViewport,
}

export default function AccountPage() {
  const router = useRouter()

  const [user, setUser] = useState<UserProfile | null>(null)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function signOut() {
    setSigningOut(true)

    try {
      await authApi.logout()
    } catch {
    } finally {
      router.replace("/")
    }
  }

  useEffect(() => {
    let active = true

    authApi
      .getProfile()
      .then(({ data }) => {
        const profile = readUserProfile(data)

        if (!profile) {
          throw new Error("Profile data is unavailable.")
        }

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
  }, [router])

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
      const { data } = await authApi.updateProfile(cleanName)
      const updated = readUserProfile(data)

      if (!updated) {
        throw new Error("The updated profile could not be read.")
      }

      setUser(updated)
      setName(updated.name ?? cleanName)
      setMessage("Your name has been updated.")
    } catch {
      setError("We could not update your profile. Please try again.")
    } finally {
      setSaving(false)
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
      <div className="mx-auto w-full">
        <motion.div {...fadeIn} transition={smoothReveal}>
          <Button
            variant="ghost"
            size="sm"
            className="mb-7 rounded-full text-muted-foreground"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="size-4" />
            Workspace overview
          </Button>
        </motion.div>

        <motion.p
          {...fadeUp}
          transition={smoothReveal}
          className="font-mono text-xs tracking-widest text-primary"
        >
          YOUR WORKSPACE / ACCOUNT
        </motion.p>

        <motion.h1
          {...fadeUp}
          transition={{ ...smoothReveal, delay: 0.05 }}
          className="mt-3 font-serif text-4xl leading-none tracking-tight sm:text-5xl lg:text-6xl"
        >
          Your details.
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ ...smoothReveal, delay: 0.1 }}
          className="mt-3 text-sm text-muted-foreground"
        >
          Manage the profile connected to your Drivebridge account.
        </motion.p>

        <Card className="mt-8 rounded-xl">
          <CardHeader className="p-5 pb-0 sm:p-8 sm:pb-0">
            <div className="flex items-center gap-4 border-b pb-6">
              <motion.div {...fadeIn} transition={smoothReveal}>
                <Avatar className="size-14">
                  <AvatarImage src={user.picture ?? undefined} alt="" />

                  <AvatarFallback className="bg-primary/10 font-serif text-xl text-primary">
                    {user.name?.slice(0, 1) ??
                      user.email.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              <div className="min-w-0">
                <CardTitle className="truncate font-serif text-xl tracking-tight">
                  {user.name ?? "Your profile"}
                </CardTitle>

                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-8">
            <form onSubmit={saveProfile}>
              <Label className="text-xs" htmlFor="display-name">
                Display name
              </Label>

              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <Input
                  autoComplete="name"
                  className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                  id="display-name"
                  maxLength={100}
                  minLength={2}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="How should we address you?"
                  value={name}
                />

                <Button
                  className="h-11 rounded-full px-5 text-xs"
                  disabled={saving || name.trim() === (user.name ?? "")}
                  type="submit"
                >
                  {saving ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <motion.span
                      whileHover={{ rotate: -8 }}
                      whileTap={{ scale: 0.9 }}
                      className="inline-flex"
                    >
                      <Save className="size-4" />
                    </motion.span>
                  )}
                  Save changes
                </Button>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Use 2 to 100 characters.
              </p>

              {error ? (
                <Alert variant="destructive" className="mt-3">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              {message ? (
                <Alert className="mt-3">
                  <Check className="size-4 text-primary" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              ) : null}
            </form>
          </CardContent>
        </Card>

        <Card className="mt-4 rounded-xl bg-secondary">
          <CardContent className="flex gap-4 p-5 sm:p-6">
            <motion.span
              {...fadeIn}
              transition={smoothReveal}
              whileHover={{ rotate: 8, scale: 1.05 }}
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-background text-primary"
            >
              <ShieldCheck className="size-5" />
            </motion.span>

            <div className="min-w-0">
              <motion.h2
                {...fadeUp}
                transition={smoothReveal}
                className="text-sm font-semibold"
              >
                Your Google account
              </motion.h2>

              <motion.p
                {...fadeUp}
                transition={{ ...smoothReveal, delay: 0.05 }}
                className="mt-1 text-xs leading-5 text-muted-foreground"
              >
                Your sign-in email comes from Google and can&apos;t be changed
                here. Manage Drive access from the workspace overview.
              </motion.p>

              <Button
                variant="link"
                className="mt-2 h-auto p-0 text-xs"
                onClick={() => router.push("/dashboard")}
              >
                Go to workspace
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4 rounded-xl">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <motion.h2
                {...fadeUp}
                transition={smoothReveal}
                className="text-sm font-semibold"
              >
                Session
              </motion.h2>

              <motion.p
                {...fadeUp}
                transition={{ ...smoothReveal, delay: 0.05 }}
                className="mt-1 text-xs leading-5 text-muted-foreground"
              >
                Sign out of your Drivebridge account on this browser.
              </motion.p>
            </div>

            <Button
              variant="destructive"
              className="h-10 shrink-0 rounded-full"
              disabled={signingOut}
              onClick={signOut}
              type="button"
            >
              {signingOut ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <motion.span
                  whileHover={{ rotate: -8 }}
                  whileTap={{ scale: 0.9 }}
                  className="inline-flex"
                >
                  <LogOut className="size-4" />
                </motion.span>
              )}

              {signingOut ? "Signing out…" : "Sign out"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
