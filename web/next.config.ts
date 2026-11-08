import type { NextConfig } from "next"
import { backendUrl as url } from "@/config/site"

const backendUrl = url.replace(/\/$/, "")

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `${backendUrl}/api/:path*`,
            },
        ]
    },
}

export default nextConfig
