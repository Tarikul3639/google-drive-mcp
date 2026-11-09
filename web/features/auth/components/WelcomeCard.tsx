import { motion } from "motion/react"
import { Check } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { UserProfile } from "@/features/shared/types/api"

import { WelcomeProfile } from "./WelcomeProfile"
import { WelcomeActions } from "./WelcomeActions"

const transition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }

// Present the successful sign-in state and the signed-in Google profile.
export function WelcomeCard({
  user,
  loading,
  error,
}: {
  user: UserProfile | null
  loading: boolean
  error: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      className="relative w-full max-w-md"
    >
      <Card className="w-full rounded-lg bg-card/90 text-center shadow-xl backdrop-blur-xl">
        <CardContent className="p-6 sm:p-9">
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
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.08 }}
            className="mt-6"
          >
            <Badge
              variant="secondary"
              className="rounded-full font-mono text-[10px] tracking-[0.22em]"
            >
              ACCOUNT CONNECTED
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.12 }}
            className="mt-3 font-serif text-4xl leading-[0.98] tracking-[-0.07em] sm:text-5xl"
          >
            You&apos;re in.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.18 }}
            className="mx-auto mt-3 max-w-xs text-xs leading-6 text-muted-foreground sm:text-sm"
          >
            Your Drivebridge account is ready. Let&apos;s get your files where
            your ideas are.
          </motion.p>
          <WelcomeProfile user={user} loading={loading} error={error} />
          <WelcomeActions />
        </CardContent>
      </Card>
    </motion.div>
  )
}
