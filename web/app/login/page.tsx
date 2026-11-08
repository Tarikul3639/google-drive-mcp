import type { Metadata } from "next"

import LoginPage from "@/features/auth/page"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in with Google to manage your Drivebridge connection.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: false },
}

export default function Page() {
  return <LoginPage />
}
