import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

// Provide navigation from the welcome screen to the workspace or home page.
export function WelcomeActions() {
  return (
    <>
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
      <Button
        asChild
        variant="link"
        size="sm"
        className="mt-3 text-xs text-muted-foreground"
      >
        <Link href="/">Back to home</Link>
      </Button>
    </>
  )
}
