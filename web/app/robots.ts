import type { MetadataRoute } from "next"
import { siteUrl } from "@/config/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/account", "/login", "/auth/", "/mcp/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
