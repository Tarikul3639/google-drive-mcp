"use client"

import { motion } from "motion/react"
import { ArrowUpRight, ShieldCheck } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import type { ConsentDetails } from "../consent-types"

// Describe the requesting MCP app and the access it will receive.
export function ConsentClientDetails({ details }: { details: ConsentDetails }) {
  return (
    <>
      <Card className="mt-4 rounded-lg bg-muted/30 shadow-none">
        <CardContent className="p-3">
          <p className="font-mono text-[9px] tracking-widest text-muted-foreground">
            REQUESTING APP
          </p>
          <div className="mt-2 flex items-center gap-2.5">
            <motion.span
              initial={{ opacity: 0, y: 3 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 font-serif text-base text-primary"
            >
              {details.client.name.slice(0, 1).toUpperCase()}
            </motion.span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold">
                {details.client.name}
              </span>
              <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                Connect to your Drivebridge account
              </span>
            </span>
            <motion.span whileHover={{ x: 2, y: -2 }} className="inline-flex">
              <ArrowUpRight className="size-3.5 text-muted-foreground" />
            </motion.span>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-2.5 rounded-lg shadow-none">
        <CardContent className="p-3">
          <div className="flex items-start gap-2.5">
            <motion.span
              whileHover={{ rotate: 8, scale: 1.05 }}
              className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"
            >
              <ShieldCheck className="size-3.5" />
            </motion.span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold">
                Full Drivebridge access
              </span>
              <span className="mt-1 block text-[11px] leading-4 text-muted-foreground">
                This client can read and make changes to your Google Drive
                through Drivebridge. You can revoke access anytime.
              </span>
            </span>
          </div>
        </CardContent>
      </Card>
      <motion.div
        initial={{ opacity: 0, y: 3 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="mt-2.5 flex items-start gap-2 rounded-lg bg-muted px-3 py-2 text-[11px] leading-4 text-muted-foreground"
      >
        <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" />
        <span>
          You can revoke this client’s access anytime from your account
          settings.
        </span>
      </motion.div>
    </>
  )
}
