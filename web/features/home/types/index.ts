export type NavItem = {
  label: string
  href: string
}

export type FilePreview = {
  name: string
  kind: "document" | "sheet" | "slides"
  detail: string
  accent: string
}
