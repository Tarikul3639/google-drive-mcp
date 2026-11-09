import Link from "next/link"
import { ArrowUpRight, Cable } from "lucide-react"

import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-14">
        {/* Logo */}
        <Link
          aria-label="Drivebridge home"
          className="flex items-center gap-2.5"
          href="/"
        >
          <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Cable className="size-4" />
          </span>

          <span className="font-serif text-lg font-semibold capitalize">
            Drivebridge
          </span>
        </Link>

        {/* Author */}
        <div className="flex flex-col gap-1 sm:items-center">
          <p className="text-xs text-muted-foreground">
            Your files stay in your Drive. Your access stays in your hands.
          </p>

          <p className="text-xs text-muted-foreground">
            Built by{" "}
            <a
              href={siteConfig.author.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              {siteConfig.author.name ?? "Tarikul Islam"}
              <ArrowUpRight className="ml-0.5 inline size-3" />
            </a>
          </p>
        </div>

        {/* Get Started */}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="group rounded-full"
        >
          <Link href="/login">
            Get started
            <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Button>
      </div>
    </footer>
  )
}
