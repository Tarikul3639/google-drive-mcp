import { env } from "./env"

export const siteConfig = {
  name: "Google Drive MCP",
  description: "Connect Google Drive to AI tools through MCP",

  url: env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  backendUrl: env.BACKEND_URL ?? "http://localhost:5000",

  author: {
    name: env.NEXT_PUBLIC_AUTHOR_NAME,
    portfolioUrl: env.NEXT_PUBLIC_AUTHOR_PORTFOLIO_URL,
    githubUrl: env.NEXT_PUBLIC_AUTHOR_GITHUB_URL,
  },
} as const

export const siteUrl = siteConfig.url
export const backendUrl = siteConfig.backendUrl
