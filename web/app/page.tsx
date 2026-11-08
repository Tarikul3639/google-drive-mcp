import type { Metadata } from "next"

import HomePage from "@/features/home/page"

export const metadata: Metadata = {
  title: { absolute: "Drivebridge — Google Drive for your AI workspace" },
  description:
    "Connect Google Drive to your AI tools with a clear, secure MCP connection. Find and use the files you already work with.",
  openGraph: {
    title: "Drivebridge — Google Drive for your AI workspace",
    description:
      "A calmer way to bring your Drive files into the tools you think with.",
    type: "website",
  },
  alternates: { canonical: "/" },
}

export default function Page() {
  return <HomePage />
}
