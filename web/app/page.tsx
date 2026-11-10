import type { Metadata } from "next"

import HomePage from "@/features/home/page"

export const metadata: Metadata = {
  title: { absolute: "Google Drive MCP — Connect Google Drive to AI" },
  description:
    "Connect Google Drive to your AI tools with a clear, secure MCP connection. Find and use the files you already work with.",
  openGraph: {
    title: "Google Drive MCP — Connect Google Drive to AI",
    description:
      "Connect Google Drive to AI tools through a secure Model Context Protocol server.",
    type: "website",
  },
  alternates: { canonical: "/" },
}

export default function Page() {
  return <HomePage />
}
