import type { Metadata } from "next"

import AccountPage from "@/features/account/page"

export const metadata: Metadata = {
  title: "Account settings — Drivebridge",
  description: "Review and update your Drivebridge profile.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/account" },
}

export default function Page() {
  return <AccountPage />
}
