import type { FilePreview, NavItem } from "../types"

export const navItems: NavItem[] = [
  { label: "How it works", href: "#how-it-works" },
  { label: "For your tools", href: "#for-your-tools" },
]

export const filePreviews: FilePreview[] = [
  {
    name: "Q4 product brief",
    kind: "document",
    detail: "Edited today · 8 pages",
    accent: "bg-[#4f8d6a]",
  },
  {
    name: "Launch metrics",
    kind: "sheet",
    detail: "Edited yesterday · 4 sheets",
    accent: "bg-[#8b9a55]",
  },
  {
    name: "Brand direction",
    kind: "slides",
    detail: "Edited Oct 28 · 16 slides",
    accent: "bg-[#bf765d]",
  },
]
