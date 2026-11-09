"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const

// Let mobile users choose a theme directly from the navigation sidebar.
export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  return (
    <div className="space-y-2 px-2 py-3">
      <p className="px-1 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
        Appearance
      </p>
      <div
        aria-label="Choose appearance"
        className="grid grid-cols-3 gap-1 rounded-xl border border-border/70 bg-muted/40 p-1"
        role="group"
      >
        {themeOptions.map(({ value, label, icon: Icon }) => {
          const selected = mounted && theme === value

          return (
            <button
              key={value}
              type="button"
              aria-label={label}
              aria-pressed={selected}
              onClick={() => setTheme(value)}
              className={`flex h-9 items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-colors ${
                selected
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
