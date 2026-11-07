import Link from "next/link"
import { ArrowUpRight, Cable } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-foreground/[0.08]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-14">
        <Link
          aria-label="Drivebridge home"
          className="flex items-center gap-2.5"
          href="/"
        >
          <span className="grid size-8 place-items-center rounded-[11px] bg-[#d5ed70] text-[#20231b]">
            <Cable className="size-4" />
          </span>
          <span className="font-serif text-[19px] tracking-[-0.06em]">
            drivebridge
          </span>
        </Link>
        <p className="text-[10px] text-muted-foreground">
          Your files stay in your Drive. Your access stays in your hands.
        </p>
        <Link
          className="group flex w-fit items-center gap-1 text-[10px] font-medium"
          href="/login"
        >
          Get started{" "}
          <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </footer>
  )
}
