import type { Metadata } from "next"

import McpConsentPage from "@/features/mcp/consent-page"

export const metadata: Metadata = {
  title: "Authorize MCP client — Drivebridge",
  description: "Review and approve an MCP client's access to your Drivebridge account.",
  robots: { index: false, follow: false },
}

type PageProps = {
  searchParams: Promise<{ transaction?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const { transaction } = await searchParams
  return <McpConsentPage transaction={transaction ?? ""} />
}
