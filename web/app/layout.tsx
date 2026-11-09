import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { cn } from "@/lib/utils"
import { siteUrl, siteConfig } from "@/config/site"
import { StoreProvider } from "@/features/shared/store/provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Drivebridge",
  title: {
    default: "Drivebridge — Google Drive for your AI workspace",
    template: "%s | Drivebridge",
  },
  description:
    "Connect Google Drive to your AI tools with a clear, secure MCP connection. Find and use the files you already work with.",
  keywords: [
    "Google Drive MCP",
    "Model Context Protocol",
    "AI file search",
    "Google Drive integration",
  ],
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.portfolioUrl,
    },
  ],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  icons: { icon: "/favicon.ico" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Drivebridge",
    title: "Drivebridge — Google Drive for your AI workspace",
    description:
      "A calmer way to bring your Drive files into the tools you think with.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Drivebridge — Google Drive for your AI workspace",
    description:
      "Connect Google Drive to your AI tools with a clear, secure MCP connection.",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <StoreProvider>
          <SidebarProvider>
            <ThemeProvider>
              <TooltipProvider>
                <div className="flex min-h-svh w-full min-w-0 flex-col">
                  <AppSidebar />
                  {children}
                </div>
              </TooltipProvider>
            </ThemeProvider>
          </SidebarProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
