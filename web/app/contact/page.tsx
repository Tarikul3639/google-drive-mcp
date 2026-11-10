import type { Metadata } from "next"

import ContactPage from "@/features/contact/page"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get help with Google Drive MCP, MCP client connections, and access management.",
  alternates: { canonical: "/contact" },
}

export default function Page() {
  return <ContactPage />
}
