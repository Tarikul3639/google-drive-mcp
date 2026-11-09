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
    <Card className="mt-4 rounded-xl">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-sm font-semibold">Session</h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Sign out of your Drivebridge account on this browser.
          </p>
        </div>
        <Button
          variant="destructive"
          className="h-10 shrink-0 rounded-full"
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
