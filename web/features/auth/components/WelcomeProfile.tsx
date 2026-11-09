import { Check, LoaderCircle } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { UserProfile } from "@/features/shared/types/api"

// Show the Google profile details returned after sign-in.
export function WelcomeProfile({
  user,
  loading,
  error,
}: {
  user: UserProfile | null
  loading: boolean
  error: boolean
}) {
  return (
    <>
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
              : (user?.email ?? (error ? "We couldn’t load your profile" : ""))}
          </span>
        </span>
        {!loading && user ? (
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <Check className="size-3.5" strokeWidth={2.5} />
          </span>
        ) : null}
      </div>
      {error ? (
        <Alert
          variant="destructive"
          className="mx-auto mt-3 max-w-sm text-left"
        >
          <AlertDescription className="text-xs leading-5">
            You&apos;re signed in, but your profile could not be loaded. You can
            continue and try again from your account.
          </AlertDescription>
        </Alert>
      ) : null}
    </>
  )
}
