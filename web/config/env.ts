import { z } from "zod"

const envSchema = z.object({
    NEXT_PUBLIC_SITE_URL: z.url().optional(),
    NEXT_PUBLIC_AUTHOR_NAME: z.string().min(1, "Author name is required"),
    NEXT_PUBLIC_AUTHOR_PORTFOLIO_URL: z.url({
        error: "A valid portfolio URL is required",
    }),
    NEXT_PUBLIC_AUTHOR_GITHUB_URL: z.url({
        error: "A valid GitHub URL is required",
    }),
})

export const env = envSchema.parse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_AUTHOR_NAME: process.env.NEXT_PUBLIC_AUTHOR_NAME,
    NEXT_PUBLIC_AUTHOR_PORTFOLIO_URL:
        process.env.NEXT_PUBLIC_AUTHOR_PORTFOLIO_URL,
    NEXT_PUBLIC_AUTHOR_GITHUB_URL: process.env.NEXT_PUBLIC_AUTHOR_GITHUB_URL,
})
