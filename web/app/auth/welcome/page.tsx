import type { Metadata } from "next"

import WelcomePage from "@/features/auth/welcome-page"

export const metadata: Metadata = {
  title: "Welcome to Drivebridge",
  description: "Your Drivebridge account is ready.",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <WelcomePage />
}
