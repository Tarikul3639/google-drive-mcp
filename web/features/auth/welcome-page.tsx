"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, Check, LoaderCircle, Sparkles } from "lucide-react"

import { ThemeToggle } from "@/features/home/components/ThemeToggle"
import { authApi } from "@/features/shared/api/client"
import { readUserProfile } from "@/features/shared/api/normalize"
import type { UserProfile } from "@/features/shared/types/api"

export default function WelcomePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true

    authApi
      .getProfile()
      .then(({ data }) => {
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
  }, [])

  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-[#f5f4ed] px-5 py-8 text-[#25291f] dark:bg-[#171914] dark:text-[#f5f4ed]">
      <div className="pointer-events-none absolute -left-40 -top-40 size-[440px] rounded-full border border-[#81944f]/15 dark:border-[#c5d87b]/10" />
      <div className="pointer-events-none absolute -bottom-48 -right-24 size-[520px] rounded-full border border-[#81944f]/15 dark:border-[#c5d87b]/10" />

      <div className="absolute right-5 top-5 sm:right-8 sm:top-8">
        <ThemeToggle />
      </div>

      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-[560px] rounded-[30px] border border-[#25291f]/[0.08] bg-white/80 p-7 text-center shadow-[0_28px_90px_-50px_rgba(37,41,31,0.3)] backdrop-blur-xl sm:p-12 dark:border-white/10 dark:bg-[#22251e]/85"
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          animate={{ scale: 1, rotate: 0 }}
          className="mx-auto grid size-[68px] place-items-center rounded-[23px] bg-[#d5ed70] text-[#25291f] shadow-[0_14px_35px_-15px_#8c9c45]"
          initial={{ scale: 0.7, rotate: -10 }}
          transition={{ delay: 0.12, duration: 0.45, type: "spring" }}
        >
          <Check className="size-8" strokeWidth={2.5} />
        </motion.div>

        <p className="mt-7 font-mono text-[10px] tracking-[0.22em] text-[#718342] dark:text-[#c5d87b]">
          ACCOUNT CONNECTED
        </p>
        <h1 className="mt-3 font-serif text-[clamp(2.7rem,8vw,4.5rem)] leading-[0.98] tracking-[-0.07em]">
          You&apos;re in.
        </h1>
        <p className="mx-auto mt-4 max-w-[360px] text-[13px] leading-6 text-[#66685f] dark:text-white/60">
          Your Drivebridge account is ready. Let&apos;s get your files where your
          ideas are.
        </p>

        <div className="mx-auto mt-8 flex min-h-[78px] max-w-[390px] items-center gap-4 rounded-[20px] border border-[#25291f]/[0.08] bg-[#f5f4ed] px-4 py-3 text-left dark:border-white/10 dark:bg-white/[0.04]">
          {loading ? (
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e8edda] dark:bg-white/10">
              <LoaderCircle className="size-5 animate-spin text-[#718342]" />
            </span>
          ) : user?.picture ? (
            <img
              alt=""
              className="size-12 shrink-0 rounded-full object-cover"
              referrerPolicy="no-referrer"
              src={user.picture}
            />
          ) : (
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#d5ed70] font-serif text-xl text-[#25291f]">
              {user?.name?.slice(0, 1) ?? user?.email.slice(0, 1).toUpperCase() ?? "?"}
            </span>
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold">
              {loading ? "Loading your account…" : user?.name ?? "Google account"}
            </span>
            <span className="mt-1 block truncate text-[11px] text-muted-foreground">
              {loading
                ? "Finishing sign in"
                : user?.email ?? (error ? "We couldn’t load your profile" : "")}
            </span>
          </span>
          {!loading && user && (
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#e8edda] text-[#718342] dark:bg-[#d5ed70]/10 dark:text-[#d5ed70]">
              <Check className="size-3.5" strokeWidth={2.5} />
            </span>
          )}
        </div>

        {error && (
          <p className="mt-3 text-[11px] text-[#8a5a39] dark:text-[#e4b186]">
            You&apos;re signed in, but your profile could not be loaded. You can
            continue and try again from your account.
          </p>
        )}

        <Link
          className="group mx-auto mt-7 flex h-[54px] w-full max-w-[390px] items-center justify-center gap-2 rounded-full bg-[#25291f] px-6 text-[12px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#46533a] dark:bg-[#d5ed70] dark:text-[#25291f] dark:hover:bg-[#e0f58a]"
          href="/dashboard"
        >
          <Sparkles className="size-4 text-[#d5ed70] dark:text-[#718342]" />
          Open your workspace
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          className="mt-5 inline-block text-[11px] text-muted-foreground transition hover:text-foreground"
          href="/"
        >
          Back to home
        </Link>
      </motion.section>
    </main>
  )
}
