import { Globe, Monitor, Plug, ShieldCheck } from "lucide-react"

import { backendUrl } from "@/config/site"

export const clientName = "Drivebridge"
export const clientDescription =
  "Connect Google Drive to your AI tools with Drivebridge through the Model Context Protocol."
export const mcpEndpoint = new URL("api/mcp", backendUrl).toString()
export const clientConfig = JSON.stringify(
  { mcpServers: { drivebridge: { type: "http", url: mcpEndpoint } } },
  null,
  2
)
export const clientIcon = "/drivebridge-icon.jpg"

export const connectionSteps = [
  {
    number: "01",
    icon: Monitor,
    title: "Open your MCP client",
    description: "Open the settings or integrations section of your AI client.",
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
] as const

export type CopyKey = "endpoint" | "name" | "description" | "config"
