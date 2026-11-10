import type { FilePreview, NavItem } from "../types"

export const navItems: NavItem[] = [
  { label: "How it works", href: "#how-it-works" },
  { label: "For your tools", href: "#for-your-tools" },
  { label: "Contact", href: "/contact" },
]

export const filePreviews: FilePreview[] = [
  {
    name: "Q4 product brief",
    kind: "document",
    detail: "Edited today · 8 pages",
    accent: "bg-[#2563EB] text-white",
  },
  {
    name: "Launch metrics",
    kind: "sheet",
    detail: "Edited yesterday · 4 sheets",
    accent: "bg-[#059669] text-white",
  },
  {
    name: "Brand direction",
    kind: "slides",
    detail: "Edited Oct 28 · 16 slides",
    accent: "bg-[#7C3AED] text-white",
  },
]
