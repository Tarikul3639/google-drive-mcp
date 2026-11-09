import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import type { ConsentDetails } from "../consent-types"
import { ConsentBrandHeader } from "./ConsentBrandHeader"
import { ConsentIntro } from "./ConsentIntro"
import { ConsentClientDetails } from "./ConsentClientDetails"
import { ConsentRequestState } from "./ConsentRequestState"
import { ConsentDecisionActions } from "./ConsentDecisionActions"

// Compose the complete consent review card from small presentational sections.
export function ConsentCard({
  transaction,
  loading,
  details,
  submitting,
  error,
  onDecision,
}: {
  transaction: string
  loading: boolean
  details: ConsentDetails | null
  submitting: "allow" | "deny" | null
  error: string
  onDecision: (decision: "allow" | "deny") => void
}) {
  return (
    <Card className="rounded-xl border-border/80 bg-card/95 shadow-lg backdrop-blur-xl">
      <CardContent className="p-4 sm:p-5">
        <ConsentBrandHeader />
        <ConsentIntro />
        {details ? (
          <ConsentClientDetails details={details} />
        ) : (
          <ConsentRequestState
            transaction={transaction}
            loading={loading}
            error={error}
          />
        )}
        {error && details ? (
          <Alert variant="destructive" className="mt-2.5 rounded-lg py-2">
            <AlertDescription aria-live="polite" className="text-xs">
              {error}
            </AlertDescription>
          </Alert>
        ) : null}
        {details ? (
          <ConsentDecisionActions
            submitting={submitting}
            disabled={submitting !== null || loading}
            onDecision={onDecision}
          />
        ) : null}
        <p className="mt-4 text-center text-[11px] leading-4 text-muted-foreground">
          Only approve clients you recognize. You can change your mind later.
        </p>
      </CardContent>
    </Card>
  )
}
