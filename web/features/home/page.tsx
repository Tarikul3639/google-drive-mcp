import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import { Hero } from "./components/Hero"
import { HowItWorks } from "./components/HowItWorks"
import { ToolBand } from "./components/ToolBand"

export default function HomePage() {
  return (
    <main className="min-h-svh overflow-hidden bg-background text-foreground">
      <Header />
      <Hero />
      <HowItWorks />
      <ToolBand />
      <Footer />
    </main>
  )
}
