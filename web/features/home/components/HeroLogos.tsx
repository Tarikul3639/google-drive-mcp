// Keep the Google Drive file-type marks together for the animated preview.
// Official Google Drive logo (original brand colors)
export function GoogleDriveLogo({
  className = "size-6",
}: {
  className?: string
}) {
  return (
    <svg viewBox="0 0 87.3 78" className={className} aria-hidden="true">
      <path
        d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
        fill="#0066da"
      />
      <path
        d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0-1.2 4.5h27.5z"
        fill="#00ac47"
      />
      <path
        d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
        fill="#ea4335"
      />
      <path
        d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
        fill="#00832d"
      />
      <path
        d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
        fill="#2684fc"
      />
      <path
        d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
        fill="#ffba00"
      />
    </svg>
  )
}

export function DocsLogo() {
  return (
    <svg viewBox="0 0 40 44" className="size-6" fill="none">
      <path d="M7 2h17l10 10v29H7V2Z" fill="#4285F4" />
      <path d="M24 2v11h10" fill="#A1C2FA" />
      <path
        d="M13 21h15M13 27h15M13 33h11"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SheetsLogo() {
  return (
    <svg viewBox="0 0 40 44" className="size-6" fill="none">
      <path d="M7 2h17l10 10v29H7V2Z" fill="#0F9D58" />
      <path d="M24 2v11h10" fill="#87CEAC" />
      <path
        d="M13 20h15v14H13zM20.5 20v14M13 27h15"
        stroke="white"
        strokeWidth="1.8"
      />
    </svg>
  )
}

export function SlidesLogo() {
  return (
    <svg viewBox="0 0 40 44" className="size-6" fill="none">
      <path d="M7 2h17l10 10v29H7V2Z" fill="#F4B400" />
      <path d="M24 2v11h10" fill="#FCE8B2" />
      <rect x="12" y="19" width="17" height="13" rx="1.5" fill="white" />
      <path d="m17 32 4-5 4 5" fill="#F4B400" />
    </svg>
  )
}

export function PdfLogo() {
  return (
    <svg viewBox="0 0 40 44" className="size-6" fill="none">
      <path d="M7 2h17l10 10v29H7V2Z" fill="#EA4335" />
      <path d="M24 2v11h10" fill="#F5A49D" />
      <path
        d="M12 27c5-9 5-9 7-5 2 4 4 6 8 5M12 29h17"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function McpLogo() {
  return (
    <svg viewBox="0 0 48 48" className="size-6" fill="none">
      <path
        d="M17 12a7 7 0 1 1 7 7H12a5 5 0 1 0 5 5v-5m14 17a7 7 0 1 1-7-7h12a5 5 0 1 0-5-5v5M24 19v10"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="3" fill="currentColor" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */
