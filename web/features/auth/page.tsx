"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowUpRight,
  Cable,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react"

import { ThemeToggle } from "@/features/home/components/ThemeToggle"
import { authApi } from "@/features/shared/api/client"
import { readUserProfile } from "@/features/shared/api/normalize"

export default function LoginPage() {
  const router = useRouter()
  const [starting, setStarting] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    let active = true

    authApi
      .getProfile()
      .then(({ data }) => {
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
  }, [router])

  function startGoogleLogin() {
    setStarting(true)
    window.location.assign(authApi.loginUrl)
  }

  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-[1fr_0.92fr]">
      <section className="relative flex min-h-[60svh] flex-col justify-between overflow-hidden bg-[#25291f] px-6 py-7 text-[#f5f4ed] sm:px-10 sm:py-9 lg:min-h-svh lg:px-14 lg:py-12">
        <div className="absolute -bottom-32 -left-14 size-[500px] rounded-full border border-[#c5d87b]/15" />
        <div className="absolute -bottom-20 left-12 size-[340px] rounded-full border border-[#c5d87b]/15" />
        <div className="relative flex items-center justify-between">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid size-10 place-items-center rounded-[14px] bg-[#d5ed70] text-[#25291f]">
              <Cable className="size-5" />
            </span>
            <span className="font-serif text-[22px] tracking-[-0.06em]">
              drivebridge
            </span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="relative max-w-[540px] py-20 lg:py-0">
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#c5d87b]">
            YOUR DRIVE, WITH A LITTLE MORE FLOW
          </span>
          <h1 className="mt-6 font-serif text-[clamp(3.4rem,7vw,6.6rem)] leading-[0.91] tracking-[-0.075em]">
            Good work
            <br />
            finds its way.
          </h1>
          <p className="mt-6 max-w-[390px] text-[14px] leading-7 text-white/65">
            Connect the files you already trust to the AI tools you already use.
            Start with Google, stay in control.
          </p>
        </div>

        <div className="relative flex items-center gap-2 text-[10px] text-white/55">
          <ShieldCheck className="size-4 text-[#c5d87b]" />
          Revoke your connection whenever you want
        </div>
      </section>

      <section className="flex min-h-[40svh] flex-col justify-center px-6 py-12 sm:px-12 lg:min-h-svh lg:px-[clamp(3rem,8vw,8rem)]">
        <Link
          className="mb-14 flex w-fit items-center gap-2 text-[11px] text-muted-foreground transition hover:text-foreground"
          href="/"
        >
          <ArrowLeft className="size-3.5" /> Back to home
        </Link>
        <div className="max-w-[430px]">
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#7b8e4b]">
            ONE SECURE STEP
          </span>
          <h2 className="mt-4 font-serif text-[clamp(2.8rem,5vw,4.3rem)] leading-[0.98] tracking-[-0.065em]">
            Make the connection.
          </h2>
          <p className="mt-5 max-w-[370px] text-[13px] leading-6 text-muted-foreground">
            Use your Google account to sign in. You can choose and manage your
            Drive connection after that.
          </p>

          {checkingSession ? (
            <div className="mt-8 flex h-[56px] items-center justify-center gap-2 rounded-full border border-foreground/10 text-[12px] text-muted-foreground">
              <LoaderCircle className="size-4 animate-spin" />
              Checking your account…
            </div>
          ) : (
            <button
              className="group mt-8 flex h-[56px] w-full items-center justify-between rounded-full bg-[#d5ed70] pr-2 pl-6 text-[13px] font-semibold text-[#252a1e] shadow-[0_16px_38px_-19px_#9aaa42] transition hover:-translate-y-0.5 hover:bg-[#e0f58a] disabled:opacity-70"
              disabled={starting}
              onClick={startGoogleLogin}
              type="button"
            >
              <span className="flex items-center gap-3">
                {starting ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <GoogleMark />
                )}
                Continue with Google
              </span>
              <span className="grid size-10 place-items-center rounded-full bg-[#b7d04c] transition-transform group-hover:rotate-45">
                <ArrowUpRight className="size-4" />
              </span>
            </button>
          )}

          <p className="mt-5 text-center text-[10px] leading-5 text-muted-foreground">
            By continuing, you agree to use Drivebridge with the Google account
            you select.
          </p>
        </div>
        <p className="mt-auto pt-16 text-[10px] text-muted-foreground">
          A bridge, not a black box.
        </p>
      </section>
    </main>
  )
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="size-[17px]" viewBox="0 0 48 48">
      <path
        fill="#4285F4"
        d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5h6.7c3.9-3.6 6-8.8 6-14.9Z"
      />
      <path
        fill="#34A853"
        d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.7-5c-1.8 1.2-4 1.9-6.8 1.9-5.2 0-9.6-3.5-11.2-8.2H5.9v5.2A20 20 0 0 0 24 44Z"
      />
      <path
        fill="#FBBC05"
        d="M12.8 27.9a12 12 0 0 1 0-7.8v-5.2H5.9a20 20 0 0 0 0 18.2l6.9-5.2Z"
      />
      <path
        fill="#EA4335"
        d="M24 12c3 0 5.6 1 7.7 3l5.8-5.8A19.2 19.2 0 0 0 24 4 20 20 0 0 0 5.9 14.9l6.9 5.2C14.4 15.5 18.8 12 24 12Z"
      />
    </svg>
  )
}
