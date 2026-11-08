import { Footer } from "./components/Footer"
import { Header } from "../../components/Header"
import { Hero } from "./components/Hero"
import { HowItWorks } from "./components/HowItWorks"
import { ToolBand } from "./components/ToolBand"

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Drivebridge",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    description:
      "Connect Google Drive to AI tools through a clear, secure Model Context Protocol connection.",
  }

  return (
    <main className="min-h-svh overflow-hidden bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <Hero />
      <HowItWorks />
      <ToolBand />
      <Footer />
    </main>
  )
}
