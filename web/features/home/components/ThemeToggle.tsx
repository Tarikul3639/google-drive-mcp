"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="group flex size-10 items-center justify-center rounded-full border border-foreground/15 bg-background text-foreground transition duration-300 hover:-rotate-12 hover:border-[#74855d] hover:bg-[#e9eddf] dark:hover:bg-[#293026]"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      type="button"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}
