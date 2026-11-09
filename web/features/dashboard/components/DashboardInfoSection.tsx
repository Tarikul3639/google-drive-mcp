"use client"

import { motion } from "motion/react"
import { Sparkles, ShieldCheck } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Explain the three connection steps and summarize the access controls.
export function DashboardInfoSection() {
  const steps = [
    ["01", "Connect", "Choose your Google account."],
    ["02", "Authorize", "Review access in Google's flow."],
    ["03", "Use", "Ask your MCP client for a file."],
  ]

  return (
    <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <Card id="connection-help" className="rounded-lg">
        <CardHeader className="p-6 pb-0 sm:p-7 sm:pb-0">
          <Badge
            variant="outline"
            className="w-fit font-mono text-xs tracking-wider text-primary"
          >
            THE SHORT VERSION
          </Badge>
          <CardTitle className="mt-3 font-serif text-2xl tracking-tight sm:text-3xl">
            A bridge you can see.
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-7">
          <div className="grid gap-3 sm:grid-cols-3">
            {steps.map(([number, title, body], index) => (
              <motion.div
                key={number}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
                className="rounded-[15px] border bg-muted/50 p-4"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  /{number}
                </span>
                <h3 className="mt-3 text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {body}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col justify-between rounded-lg bg-secondary">
        <CardContent className="flex h-full flex-col justify-between p-6 sm:p-7">
          <div>
            <span className="grid size-9 place-items-center rounded-xl bg-background text-primary">
              <ShieldCheck className="size-4" />
            </span>
            <h2 className="mt-4 font-serif text-2xl tracking-tight sm:text-3xl">
              Your access, your call.
            </h2>
            <p className="mt-2 text-sm leading-5 text-muted-foreground">
              Disconnect your Google Drive from here at any time. You can also
              review connected apps from your Google Account.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 font-mono text-xs tracking-wider text-primary">
            <Sparkles className="size-4" /> PRIVATE BY DESIGN
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
