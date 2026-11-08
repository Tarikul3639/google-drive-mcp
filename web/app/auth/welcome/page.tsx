import type { Metadata } from "next"

import WelcomePage from "@/features/auth/welcome-page"

export const metadata: Metadata = {
  title: "Welcome",
  description: "Your Drivebridge account is ready.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/auth/welcome" },
}

export default function Page() {
  return <WelcomePage />
}
