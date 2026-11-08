import type { NextConfig } from "next"

import { env } from "@/config/env"

const backendUrl = env.BACKEND_URL.replace(/\/$/, "")

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
