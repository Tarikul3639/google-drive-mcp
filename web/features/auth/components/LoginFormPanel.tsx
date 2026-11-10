import Link from "next/link"
import { motion } from "motion/react"
import { ArrowLeft, ArrowUpRight, LoaderCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Render the Google sign-in action and its loading state.
export function LoginFormPanel({
  checkingSession,
  starting,
  onGoogleLogin,
}: {
  checkingSession: boolean
  starting: boolean
  onGoogleLogin: () => void
}) {
  return (
    <section className="flex min-h-[40svh] flex-col justify-center px-6 py-12 sm:px-12 lg:min-h-svh lg:px-[clamp(3rem,8vw,8rem)]">
      <Button
        asChild
        variant="ghost"
        className="mb-14 w-fit rounded-full text-muted-foreground"
      >
        <Link href="/">
          <ArrowLeft className="size-3.5" /> Back to home
        </Link>
      </Button>
      <Card className="max-w-107.5 rounded-lg">
        <CardContent className="p-6 sm:p-8">
          <Badge
            variant="outline"
            className="rounded-full font-mono text-[10px] tracking-[0.2em] text-primary"
          >
            ONE SECURE STEP
          </Badge>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.3 }}
            className="mt-4 font-serif text-[clamp(2.8rem,5vw,4.3rem)] leading-[0.98] tracking-[-0.065em]"
          >
            Make the connection.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.3 }}
            className="mt-5 max-w-92.5 text-[13px] leading-6 text-muted-foreground"
          >
            Use your Google account to sign in. You can choose and manage your
            Drive connection after that.
          </motion.p>
          {checkingSession ? (
            <div className="mt-8 flex h-14 items-center justify-center gap-2 rounded-full border text-[12px] text-muted-foreground">
              <LoaderCircle className="size-4 animate-spin" /> Checking your
              account…
            </div>
          ) : (
            <Button
              className="group mt-8 flex h-14 w-full justify-between rounded-full pr-2 pl-6 text-[13px]"
              disabled={starting}
              onClick={onGoogleLogin}
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
              <span className="grid size-10 place-items-center rounded-full bg-primary-foreground/15 transition-transform group-hover:rotate-45">
                <ArrowUpRight className="size-4" />
              </span>
            </Button>
          )}
          <p className="mt-5 text-center text-[10px] leading-5 text-muted-foreground">
            By continuing, you agree to use Google Drive MCP with the Google account
            you select.
          </p>
        </CardContent>
      </Card>
      <p className="mt-auto pt-16 text-[10px] text-muted-foreground">
        A bridge, not a black box.
      </p>
    </section>
  )
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="size-5.5" viewBox="0 0 48 48">
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
