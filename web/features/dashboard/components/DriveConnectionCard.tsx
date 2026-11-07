"use client"

import { useState } from "react"
import {
  Check,
  Cloud,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  Unplug,
} from "lucide-react"

import { googleDriveApi } from "@/features/shared/api/client"
import type { GoogleDriveConnection } from "@/features/shared/types/api"

type DriveConnectionCardProps = {
  connection: GoogleDriveConnection
  onConnectionChange: (connection: GoogleDriveConnection) => void
  onRefresh: () => Promise<void>
}

export function DriveConnectionCard({
  connection,
  onConnectionChange,
  onRefresh,
}: DriveConnectionCardProps) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  const isConnected = connection.connected === true

  function beginConnect() {
    setBusy(true)
    window.location.assign(googleDriveApi.connectUrl)
  }

  async function disconnect() {
    setBusy(true)
    setMessage("")
    try {
      await googleDriveApi.disconnect()
      onConnectionChange({ connected: false, email: null })
      setMessage("Google Drive access has been revoked.")
    } catch {
      setMessage("We could not disconnect Drive. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="relative overflow-hidden rounded-[24px] bg-[#25291f] p-6 text-[#f5f4ed] sm:p-8">
      <div className="absolute -top-20 -right-14 size-64 rounded-full border border-[#c5d87b]/20" />
      <div className="absolute -top-8 -right-2 size-44 rounded-full border border-[#c5d87b]/15" />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="font-mono text-[9px] tracking-[0.2em] text-[#c5d87b]">
              GOOGLE DRIVE
            </span>
            <h2 className="mt-2 font-serif text-[30px] tracking-[-0.055em]">
              Your files, within reach.
            </h2>
            <p className="mt-2 max-w-md text-[11px] leading-5 text-white/60">
              Connect your Drive to make its files available to your MCP
              compatible tools.
            </p>
          </div>
          <span className="grid size-12 place-items-center rounded-[16px] bg-white/10 text-[#d5ed70]">
            <Cloud className="size-5" />
          </span>
        </div>

        <div className="mt-7 flex flex-col justify-between gap-5 rounded-[17px] border border-white/10 bg-white/[0.05] p-4 sm:flex-row sm:items-center sm:px-5">
          <div className="flex items-center gap-3">
            <span
              className={`grid size-9 place-items-center rounded-xl ${isConnected ? "bg-[#d5ed70] text-[#25291f]" : "bg-white/10 text-white/60"}`}
            >
              {isConnected ? (
                <Check className="size-4" />
              ) : (
                <Cloud className="size-4" />
              )}
            </span>
            <span>
              <span className="block text-[11px] font-medium">
                {isConnected
                  ? "Drive is connected"
                  : connection.connected === false
                    ? "Drive is not connected"
                    : "Connection status unavailable"}
              </span>
              <span className="mt-1 block font-mono text-[9px] text-white/50">
                {connection.email ??
                  (connection.connected === null
                    ? "Refresh to check the current status"
                    : "Google Drive access can be revoked anytime")}
              </span>
            </span>
          </div>

          <div className="flex gap-2">
            <button
              className="flex h-10 items-center justify-center gap-2 rounded-full border border-white/15 px-4 text-[10px] font-medium transition hover:bg-white/10 disabled:opacity-50"
              disabled={busy}
              onClick={() => void onRefresh()}
              type="button"
            >
              {busy ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : (
                <RefreshCw className="size-3.5" />
              )}{" "}
              Refresh
            </button>
            {isConnected ? (
              <button
                className="flex h-10 items-center justify-center gap-2 rounded-full bg-white/10 px-4 text-[10px] font-medium transition hover:bg-[#a35142] disabled:opacity-50"
                disabled={busy}
                onClick={disconnect}
                type="button"
              >
                {busy ? (
                  <LoaderCircle className="size-3.5 animate-spin" />
                ) : (
                  <Unplug className="size-3.5" />
                )}{" "}
                Disconnect
              </button>
            ) : null}
          </div>
        </div>

        <section className="mt-5 rounded-[17px] border border-white/10 bg-white/[0.05] p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/10 text-[#d5ed70]">
              <ShieldCheck className="size-4" />
            </span>
            <div>
              <h3 className="text-[11px] font-semibold">Google Drive permissions</h3>
              <p className="mt-1 max-w-xl text-[10px] leading-5 text-white/55">
                Drivebridge requests full access so it can view, create, edit,
                and delete files in your Google Drive. You can revoke access anytime.
              </p>
            </div>
          </div>

          <button
            className="mt-4 h-9 rounded-full bg-[#d5ed70] px-4 text-[10px] font-semibold text-[#25291f] transition hover:bg-[#e0f58a] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={busy}
            onClick={beginConnect}
            type="button"
          >
            {busy ? "Opening Google…" : isConnected ? "Reconnect with full access" : "Connect with full access"}
          </button>
        </section>

        {message ? (
          <p aria-live="polite" className="mt-3 text-[10px] text-[#d5ed70]">
            {message}
          </p>
        ) : null}
      </div>
    </section>
  )
}
