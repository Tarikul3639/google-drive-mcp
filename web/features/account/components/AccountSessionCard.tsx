"use client"

import { LoaderCircle, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Provide a clear sign-out action for the current browser session.
export function AccountSessionCard({
  signingOut,
  onSignOut,
}: {
  signingOut: boolean
  onSignOut: () => void
}) {
  return (
    <Card className="mt-4 min-w-0 rounded-xl">
      <CardContent className="flex min-w-0 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-sm font-semibold">Session</h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Sign out of your Drivebridge account on this browser.
          </p>
        </div>
        <Button
          variant="destructive"
          className="h-10 w-full shrink-0 rounded-full sm:w-auto"
          disabled={signingOut}
          onClick={onSignOut}
          type="button"
        >
          {signingOut ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}
          {signingOut ? "Signing out…" : "Sign out"}
        </Button>
      </CardContent>
    </Card>
  )
}
