import type { Metadata } from "next"

import McpConnectPage from "@/features/mcp/connect-page"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export const metadata: Metadata = {
  title: "Connect an MCP client",
  description:
    "Learn how to connect Drivebridge to your AI client using Streamable HTTP.",
  alternates: {
    canonical: "/mcp/connect",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Page() {
  return (
    <main className="min-h-svh overflow-hidden bg-background text-foreground">
      <Header />
      <McpConnectPage />
      <Footer />
    </main>
  )
}
