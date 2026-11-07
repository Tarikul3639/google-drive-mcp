import type { Metadata } from "next"

import DashboardPage from "@/features/dashboard/page"

export const metadata: Metadata = {
  title: "Workspace — Drivebridge",
  description: "Manage your Google Drive connection and Drivebridge account.",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <DashboardPage />
}
