"use client"

import { useState } from "react"
import { motion } from "motion/react"
import {
    ArrowUpRight,
    Check,
    Clipboard,
    Copy,
    Download,
    Globe,
    Monitor,
    Plug,
    Server,
    ShieldCheck,
} from "lucide-react"

import { siteUrl } from "@/config/site"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const clientName = "Drivebridge"

const clientDescription =
    "Connect Google Drive to your AI tools with Drivebridge through the Model Context Protocol."

const mcpEndpoint = new URL("/mcp", siteUrl).toString()

const clientConfig = JSON.stringify(
    {
        mcpServers: {
            drivebridge: {
                type: "http",
                url: mcpEndpoint,
            },
        },
    },
    null,
    2
)

const clientIcon = "/drivebridge-icon.jpg"

const connectionSteps = [
    {
        number: "01",
        icon: Monitor,
        title: "Open your MCP client",
        description:
            "Open the settings or integrations section of your AI client.",
    },
    {
        number: "02",
        icon: Plug,
        title: "Add a custom MCP server",
        description:
            "Choose the option to add a new server using Streamable HTTP transport.",
    },
    {
        number: "03",
        icon: Globe,
        title: "Enter the connection URL",
        description:
            "Copy the Drivebridge endpoint and paste it into your MCP client's server URL field.",
    },
    {
        number: "04",
        icon: ShieldCheck,
        title: "Authorize your account",
        description:
            "Save the connection. When prompted, sign in with Google and authorize Drive access.",
    },
]

type CopyKey = "endpoint" | "name" | "description" | "config"

export default function McpConnectPage() {
    const [copied, setCopied] = useState<CopyKey | null>(null)
    const [copyError, setCopyError] = useState("")

    const copyValue = async (key: CopyKey, value: string) => {
        try {
            await navigator.clipboard.writeText(value)
            setCopied(key)
            setCopyError("")

            window.setTimeout(() => {
                setCopied((current) => (current === key ? null : current))
            }, 1800)
        } catch {
            setCopyError("Unable to copy. Please copy the value manually.")
        }
    }

    const downloadIcon = () => {
        const link = document.createElement("a")

        link.href = clientIcon
        link.download = "drivebridge-icon.jpg"
        document.body.appendChild(link)
        link.click()
        link.remove()
    }

    const CopyButton = ({
        copyKey,
        value,
    }: {
        copyKey: CopyKey
        value: string
    }) => {
        const isCopied = copied === copyKey

        return (
            <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label={isCopied ? "Copied" : "Copy"}
                className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
                onClick={() => copyValue(copyKey, value)}
            >
                {isCopied ? (
                    <Check className="size-3.5 text-primary" />
                ) : (
                    <Copy className="size-3.5" />
                )}
            </Button>
        )
    }

    return (
        <main className="relative min-h-dvh overflow-x-clip bg-background px-4 py-12 text-foreground sm:py-16">
            <div className="pointer-events-none absolute -right-32 -top-40 size-96 rounded-full border border-border/60" />
            <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full border border-border/60" />

            <div className="relative mx-auto w-full max-w-3xl space-y-8">
                <header className="space-y-3">
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                    >
                        <Badge variant="secondary" className="gap-1.5 text-[10px]">
                            <Server className="size-3" />
                            MCP CONNECTION
                        </Badge>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.05 }}
                        className="text-3xl font-semibold tracking-tight sm:text-4xl"
                    >
                        Connect your AI client
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="max-w-xl text-sm leading-relaxed text-muted-foreground"
                    >
                        Connect Drivebridge to your favorite MCP-compatible AI client
                        using Streamable HTTP. Your Google Drive files will be available
                        through a secure connection.
                    </motion.p>
                </header>

                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 p-4 sm:p-5">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                                <img
                                    src={clientIcon}
                                    alt="Drivebridge logo"
                                    className="size-full object-cover"
                                />
                            </div>

                            <div className="min-w-0 space-y-0.5">
                                <CardTitle className="text-sm">
                                    {clientName}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    MCP server connection
                                </CardDescription>
                            </div>
                        </div>

                        <Badge variant="outline" className="shrink-0 text-[10px]">
                            <span className="mr-1.5 size-1.5 rounded-full bg-primary" />
                            Streamable HTTP
                        </Badge>
                    </CardHeader>

                    <CardContent className="space-y-5 p-4 pt-0 sm:p-5 sm:pt-0">
                        <div className="space-y-2">
                            <label className="text-xs font-medium">
                                Server URL
                            </label>

                            <div className="flex min-w-0 items-center gap-2 rounded-lg border bg-muted/50 py-1.5 pl-3 pr-1.5 transition-colors focus-within:border-primary">
                                <code className="min-w-0 flex-1 break-all text-xs leading-relaxed">
                                    {mcpEndpoint}
                                </code>
                                <CopyButton
                                    copyKey="endpoint"
                                    value={mcpEndpoint}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="min-w-0 space-y-2">
                                <label className="text-xs font-medium">
                                    Client name
                                </label>

                                <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5 transition-colors focus-within:border-primary">
                                    <p className="min-w-0 flex-1 truncate text-xs">
                                        {clientName}
                                    </p>
                                    <CopyButton
                                        copyKey="name"
                                        value={clientName}
                                    />
                                </div>
                            </div>

                            <div className="min-w-0 space-y-2">
                                <label className="text-xs font-medium">
                                    Client description
                                </label>

                                <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5 transition-colors focus-within:border-primary">
                                    <p className="min-w-0 flex-1 text-xs leading-relaxed text-muted-foreground">
                                        {clientDescription}
                                    </p>
                                    <CopyButton
                                        copyKey="description"
                                        value={clientDescription}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                                    <img
                                        src={clientIcon}
                                        alt="Drivebridge MCP client icon"
                                        className="size-full object-cover"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-medium">
                                        Client icon
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                        JPG · 1254 × 1254
                                    </p>
                                </div>
                            </div>

                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1.5 text-xs"
                                onClick={downloadIcon}
                            >
                                <Download className="size-3.5" />
                                Download icon
                            </Button>
                        </div>

                        {copyError && (
                            <p role="alert" className="text-xs text-destructive">
                                {copyError}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <section className="space-y-4">
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold tracking-tight">
                            How to connect
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Follow these steps to connect Drivebridge to your AI client.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {connectionSteps.map((step) => {
                            const Icon = step.icon

                            return (
                                <div
                                    key={step.number}
                                    className="flex gap-3 rounded-xl border bg-card p-3.5"
                                >
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Icon className="size-4" />
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-[10px] text-muted-foreground">
                                                {step.number}
                                            </span>
                                            <h3 className="text-xs font-medium">
                                                {step.title}
                                            </h3>
                                        </div>

                                        <p className="text-xs leading-relaxed text-muted-foreground">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>

                <section className="space-y-3">
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold tracking-tight">
                            Client configuration
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            For clients that support JSON-based MCP server configuration.
                        </p>
                    </div>

                    <Card>
                        <CardContent className="space-y-3 p-4">
                            <div className="flex items-center gap-2">
                                <Clipboard className="size-4 text-muted-foreground" />
                                <span className="text-xs font-medium">
                                    Streamable HTTP configuration
                                </span>
                            </div>

                            <div className="relative rounded-lg bg-muted">
                                <pre className="overflow-x-auto p-3 pr-12 text-[11px] leading-relaxed">
                                    <code>{clientConfig}</code>
                                </pre>

                                <div className="absolute right-1.5 top-1.5">
                                    <CopyButton
                                        copyKey="config"
                                        value={clientConfig}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <div className="flex items-start gap-2 rounded-xl border bg-muted/30 p-3.5">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                    <p className="text-xs leading-relaxed text-muted-foreground">
                        Drivebridge will ask you to authorize your Google account
                        before accessing your Drive files. You can review the requested
                        permissions before approving access.
                    </p>
                </div>

                <footer className="border-t border-border pt-5 text-center">
                    <p className="text-[11px] text-muted-foreground">
                        Powered by Drivebridge · Model Context Protocol
                    </p>
                </footer>
            </div>
        </main>
    )
}