"use client"

import Link from "next/link"
import { ArrowRight, ExternalLink, Globe, MessageCircle } from "lucide-react"

import { GitHubIcon } from "./components/GitHubIcon"
import { motion } from "motion/react"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"

const contactLinks = [
  {
    label: "Portfolio",
    description: "Explore the work and projects behind Google Drive MCP.",
    href: siteConfig.author.portfolioUrl,
    icon: Globe,
  },
  {
    label: "GitHub",
    description: "Explore the source code or report a technical issue.",
    href: siteConfig.author.githubUrl,
    icon: GitHubIcon,
  },
].filter((item) => item.href)

export default function ContactPage() {
  return (
    <main className="min-h-svh overflow-hidden bg-background text-foreground">
      <Header />
      <section className="relative isolate border-y border-border bg-muted/40">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-0 -z-10 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_0.8fr] lg:gap-20 lg:px-14 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl space-y-6"
          >
            <p className="font-mono text-[11px] tracking-[0.2em] text-primary">GET IN TOUCH</p>
            <h1 className="font-serif text-4xl leading-[0.98] tracking-tight sm:text-5xl lg:text-7xl">
              Let’s make your Drive workflow <span className="text-primary italic">better.</span>
            </h1>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Have a question about connecting an MCP client, managing access, or using Google Drive MCP?
              Reach out through the project and developer links below.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="h-11 rounded-full px-5">
                <Link href="/mcp/connect">
                  Connection guide <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              {siteConfig.author.githubUrl ? (
                <Button asChild variant="outline" className="h-11 rounded-full px-5">
                  <a href={siteConfig.author.githubUrl} target="_blank" rel="noreferrer">
                    Open GitHub <ExternalLink className="ml-1 size-4" />
                  </a>
                </Button>
              ) : null}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-border/70 bg-background/90 p-5 shadow-sm sm:p-7">
              <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MessageCircle className="size-5" />
              </div>
              <h2 className="font-serif text-2xl tracking-tight">How can we help?</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Choose the channel that best fits your question. For bugs and implementation issues,
                GitHub is the best place to share reproducible details.
              </p>
            </div>
            {contactLinks.map(({ label, description, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-border/70 bg-background/80 p-4 transition-colors hover:border-primary/40 hover:bg-background sm:p-5"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span>
                </span>
                <ExternalLink className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            ))}
            {contactLinks.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                Contact links are not configured yet. Please use the connection guide for setup help.
              </p>
            ) : null}
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
