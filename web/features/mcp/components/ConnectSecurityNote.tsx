import { ShieldCheck } from "lucide-react"

// Remind users that Drive access is authorized explicitly and can be reviewed.
export function ConnectSecurityNote() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-4 sm:p-5">
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
      <p className="text-xs leading-relaxed text-muted-foreground">
        Google Drive MCP will ask you to authorize your Google account before
        accessing your Drive files. You can review the requested permissions
        before approving access.
      </p>
    </div>
  )
}
