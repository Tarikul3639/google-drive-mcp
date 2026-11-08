"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, Check, LoaderCircle, Sparkles } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/features/home/components/ThemeToggle"
import { authApi } from "@/features/shared/api/client"
import { readUserProfile } from "@/features/shared/api/normalize"
import type { UserProfile } from "@/features/shared/types/api"

const smoothTransition = {
  duration: 0.7,
  ease: [0.22, 1, 0.36, 1] as const,
}

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
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-background px-5 py-8">
      {/* Decorative Circles */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 size-110 rounded-full border border-primary/15"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -bottom-48 size-130 rounded-full border border-primary/15"
      />

      {/* Theme Toggle */}
      <div className="absolute top-5 right-5 sm:top-8 sm:right-8">
        <ThemeToggle />
      </div>

      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={smoothTransition}
        className="relative w-full max-w-md"
      >
        <Card className="w-full rounded-lg bg-card/90 text-center shadow-xl backdrop-blur-xl">
          <CardContent className="p-6 sm:p-9">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0.7, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.12,
                duration: 0.5,
                type: "spring",
                stiffness: 180,
                damping: 14,
              }}
              className="mx-auto grid size-14 place-items-center rounded-[18px] bg-primary text-primary-foreground shadow-lg"
            >
              <Check className="size-7" strokeWidth={2.5} />
            </motion.div>

            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...smoothTransition, delay: 0.08 }}
              className="mt-6"
            >
              <Badge
                variant="secondary"
                className="rounded-full font-mono text-[10px] tracking-[0.22em]"
              >
                ACCOUNT CONNECTED
              </Badge>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...smoothTransition, delay: 0.12 }}
              className="mt-3 font-serif text-4xl leading-[0.98] tracking-[-0.07em] sm:text-5xl"
            >
              You&apos;re in.
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...smoothTransition, delay: 0.18 }}
              className="mx-auto mt-3 max-w-xs text-xs leading-6 text-muted-foreground sm:text-sm"
            >
              Your Drivebridge account is ready. Let&apos;s get your files where
              your ideas are.
            </motion.p>

            {/* User Profile */}
            <div className="mx-auto mt-6 flex min-h-16 max-w-sm items-center gap-3 rounded-lg border bg-muted/50 px-3 py-2.5 text-left">
              {loading ? (
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10">
                  <LoaderCircle className="size-5 animate-spin text-primary" />
                </span>
              ) : (
                <Avatar className="size-10 shrink-0">
                  <AvatarImage src={user?.picture ?? undefined} alt="" />
                  <AvatarFallback className="bg-primary/10 font-serif text-lg text-primary">
                    {user?.name?.slice(0, 1) ??
                      user?.email?.slice(0, 1).toUpperCase() ??
                      "?"}
                  </AvatarFallback>
                </Avatar>
              )}

              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold sm:text-sm">
                  {loading
                    ? "Loading your account…"
                    : (user?.name ?? "Google account")}
                </span>

                <span className="mt-1 block truncate text-xs text-muted-foreground">
                  {loading
                    ? "Finishing sign in"
                    : (user?.email ??
                      (error ? "We couldn’t load your profile" : ""))}
                </span>
              </span>

              {!loading && user ? (
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3.5" strokeWidth={2.5} />
                </span>
              ) : null}
            </div>

            {/* Error Message */}
            {error ? (
              <Alert
                variant="destructive"
                className="mx-auto mt-3 max-w-sm text-left"
              >
                <AlertDescription className="text-xs leading-5">
                  You&apos;re signed in, but your profile could not be loaded.
                  You can continue and try again from your account.
                </AlertDescription>
              </Alert>
            ) : null}

            {/* Primary Action */}
            <Button
              asChild
              className="group mx-auto mt-6 h-12 w-full max-w-sm rounded-full text-xs"
            >
              <Link href="/dashboard">
                <Sparkles className="size-4" />
                Open your workspace
                <ArrowRight className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </Link>
            </Button>

            {/* Secondary Action */}
            <Button
              asChild
              variant="link"
              size="sm"
              className="mt-3 text-xs text-muted-foreground"
            >
              <Link href="/">Back to home</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}
