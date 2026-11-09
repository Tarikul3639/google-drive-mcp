import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, LoaderCircle } from "lucide-react"

// Render missing, loading, and unavailable authorization request states.
export function ConsentRequestState({
  transaction,
  loading,
  error,
}: {
  transaction: string
  loading: boolean
  error: string
}) {
  if (!transaction) {
    return (
      <Alert variant="destructive" className="mt-4 rounded-lg py-2.5">
        <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
        <AlertDescription className="text-xs">
          This authorization link is missing its transaction ID.
        </AlertDescription>
      </Alert>
    )
  }
  if (loading) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-3 text-xs text-muted-foreground">
        <LoaderCircle className="size-3.5 animate-spin" /> Loading authorization
        request…
      </div>
    )
  }
  if (error) {
    return (
      <Alert variant="destructive" className="mt-4 rounded-lg py-2.5">
        <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
        <AlertDescription className="text-xs">{error}</AlertDescription>
      </Alert>
    )
  }
  return null
}
