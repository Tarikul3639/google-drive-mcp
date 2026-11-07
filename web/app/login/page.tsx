import type { Metadata } from "next"

import LoginPage from "@/features/auth/page"

export const metadata: Metadata = {
  title: "Sign in — Drivebridge",
  description: "Sign in with Google to manage your Drivebridge connection.",
}

export default function Page() {
  return <LoginPage />
}
