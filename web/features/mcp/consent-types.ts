export type ConsentDetails = {
  transaction: string
  client: { clientId: string; name: string }
}

// Validate the authorization response before showing its client details.
export function readConsent(value: unknown): ConsentDetails | null {
  if (typeof value !== "object" || value === null) return null
  const candidate = value as Partial<ConsentDetails>
  if (
    typeof candidate.transaction !== "string" ||
    typeof candidate.client?.clientId !== "string" ||
    typeof candidate.client.name !== "string"
  )
    return null
  return candidate as ConsentDetails
}
