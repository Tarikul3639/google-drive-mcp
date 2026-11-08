import type { Metadata } from "next"

import DashboardPage from "@/features/dashboard/page"

export const metadata: Metadata = {
  title: "Workspace",
  description: "Manage your Google Drive connection and Drivebridge account.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/dashboard" },
}

export default function Page() {
  return <DashboardPage />
}
