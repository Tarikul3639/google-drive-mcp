"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Check,
  LoaderCircle,
  LogOut,
  Save,
  ShieldCheck,
} from "lucide-react"

import { DashboardShell } from "@/features/dashboard/components/DashboardShell"
import { authApi } from "@/features/shared/api/client"
import { readUserProfile } from "@/features/shared/api/normalize"
import type { UserProfile } from "@/features/shared/types/api"

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
      // Return to the public page even if the session already expired.
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

  if (loading || !user) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#f3f2ea] dark:bg-[#171a16]">
        <LoaderCircle
          aria-label="Loading your account"
          className="size-6 animate-spin text-[#7b8e4b]"
        />
      </main>
    )
  }

  return (
    <DashboardShell user={user}>
      <div className="mx-auto max-w-[760px]">
        <button
          className="mb-7 flex items-center gap-2 text-[10px] text-muted-foreground transition hover:text-foreground"
          onClick={() => router.push("/dashboard")}
          type="button"
        >
          <ArrowLeft className="size-3.5" /> Workspace overview
        </button>
        <p className="font-mono text-[9px] tracking-[0.18em] text-[#7b8e4b]">
          YOUR WORKSPACE / ACCOUNT
        </p>
        <h1 className="mt-3 font-serif text-[clamp(2.7rem,5vw,4.4rem)] leading-[0.96] tracking-[-0.07em]">
          Your details.
        </h1>
        <p className="mt-3 text-[12px] text-muted-foreground">
          Manage the profile connected to your Drivebridge account.
        </p>

        <section className="mt-8 rounded-[22px] border border-foreground/[0.08] bg-background p-5 sm:p-8">
          <div className="flex items-center gap-4 border-b border-foreground/[0.08] pb-6">
            {user.picture ? (
              <img
                alt=""
                className="size-14 rounded-full object-cover"
                src={user.picture}
              />
            ) : (
              <span className="grid size-14 place-items-center rounded-full bg-[#dce6c2] font-serif text-[22px] text-[#4f6132] dark:bg-[#38442d] dark:text-[#d5ed70]">
                {user.name?.slice(0, 1) ?? user.email.slice(0, 1).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <h2 className="truncate font-serif text-[22px] tracking-[-0.04em]">
                {user.name ?? "Your profile"}
              </h2>
              <p className="mt-1 truncate text-[11px] text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>

          <form className="mt-6" onSubmit={saveProfile}>
            <label
              className="block text-[10px] font-medium"
              htmlFor="display-name"
            >
              Display name
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                autoComplete="name"
                className="h-11 min-w-0 flex-1 rounded-xl border border-foreground/10 bg-background px-3.5 text-[12px] transition outline-none placeholder:text-muted-foreground/70 focus:border-[#91a75b] focus:ring-2 focus:ring-[#91a75b]/15"
                id="display-name"
                maxLength={100}
                minLength={2}
                onChange={(event) => setName(event.target.value)}
                placeholder="How should we address you?"
                value={name}
              />
              <button
                className="group flex h-11 items-center justify-center gap-2 rounded-full bg-[#d5ed70] px-5 text-[11px] font-semibold text-[#252a1e] transition hover:bg-[#e0f58a] disabled:cursor-wait disabled:opacity-60"
                disabled={saving || name.trim() === (user.name ?? "")}
                type="submit"
              >
                {saving ? (
                  <LoaderCircle className="size-3.5 animate-spin" />
                ) : (
                  <Save className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
                )}
                Save changes
              </button>
            </div>
            <p className="mt-2 text-[9px] text-muted-foreground">
              Use 2 to 100 characters.
            </p>
            {error ? (
              <p
                aria-live="polite"
                className="mt-3 text-[10px] text-destructive"
              >
                {error}
              </p>
            ) : null}
            {message ? (
              <p
                aria-live="polite"
                className="mt-3 flex items-center gap-1.5 text-[10px] text-[#657a42]"
              >
                <Check className="size-3.5" />
                {message}
              </p>
            ) : null}
          </form>
        </section>

        <section className="mt-4 flex gap-4 rounded-[20px] bg-[#e9eddf] p-5 sm:p-6 dark:bg-[#252c20]">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-background text-[#788852] dark:text-[#c5d87b]">
            <ShieldCheck className="size-4" />
          </span>
          <div>
            <h2 className="text-[11px] font-semibold">Your Google account</h2>
            <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
              Your sign-in email comes from Google and can&apos;t be changed
              here. Manage Drive access from the workspace overview.
            </p>
            <button
              className="mt-3 text-[10px] font-medium underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground/60"
              onClick={() => router.push("/dashboard")}
              type="button"
            >
              Go to workspace
            </button>
          </div>
        </section>

        <section className="mt-4 flex flex-col gap-4 rounded-[20px] border border-foreground/[0.08] bg-background p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-[11px] font-semibold">Session</h2>
            <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
              Sign out of your Drivebridge account on this browser.
            </p>
          </div>
          <button
            className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-foreground/10 px-4 text-[10px] font-medium transition hover:border-[#b96351]/40 hover:bg-[#b96351]/[0.06] hover:text-[#a64d3d] disabled:cursor-wait disabled:opacity-60"
            disabled={signingOut}
            onClick={signOut}
            type="button"
          >
            {signingOut ? (
              <LoaderCircle className="size-3.5 animate-spin" />
            ) : (
              <LogOut className="size-3.5" />
            )}
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </section>
      </div>
    </DashboardShell>
  )
}
