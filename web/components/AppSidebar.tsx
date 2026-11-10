"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import { motion } from "motion/react"
import {
  ArrowUpRight,
  CircleHelp,
  LayoutDashboard,
  Home,
  Lightbulb,
  Plug,
  Sparkles,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useGetProfileQuery } from "@/features/auth/api/auth-api"
import { readUserProfile } from "@/features/shared/api/normalize"
import { navItems } from "@/features/home/components/constants"
import { ThemeSelector } from "@/features/home/components/ThemeSelector"

// Render navigation and the signed-in profile using live account data.
export function AppSidebar() {
  const isMobile = useIsMobile()
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const { data, isLoading } = useGetProfileQuery(undefined, { skip: !isMobile })
  const user = readUserProfile(data)

  // Keep the navigation drawer out of tablet and desktop layouts.
  if (!isMobile) return null

  const links = [
    { label: "Home", href: "/", icon: Home },
    ...navItems.map((item, index) => ({
      ...item,
      icon: index === 0 ? Lightbulb : Sparkles,
    })),
    { label: "Connect", href: "/mcp/connect", icon: Plug },
  ]

  return (
    <Sidebar
      side="left"
      collapsible="offcanvas"
      className="border-r border-border/70 bg-background"
    >
      <SidebarHeader className="border-b border-border/70 px-5 py-5">
      <Link
        aria-label="Google Drive MCP home"
        className="group flex items-center gap-2.5"
        href="/"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative block size-8 shrink-0 overflow-hidden rounded-sm transition-transform duration-300 group-hover:scale-105 sm:size-10"
        >
          <img
            src="/google-drive-mcp-logo.svg"
            alt=""
            className="size-full object-cover"
          />
        </motion.span>

        <motion.span
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex flex-col sm:leading-none"
        >
          <span className="whitespace-nowrap text-[17px] font-semibold tracking-[-0.7px] text-foreground sm:text-base">
            Google Drive
          </span>

          <span className="whitespace-nowrap text-[11px] font-semibold tracking-[0.24em] text-primary sm:text-xs">
            MCP
          </span>
        </motion.span>
      </Link>
        <div className="mt-5 rounded-xl border border-border/70 bg-muted/40 p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-foreground">
            <span className="size-2 rounded-full bg-emerald-500" />
            Your AI workspace
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Bring your Google Drive files into the tools you use.
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="mb-2 px-3 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Explore
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {links.map((item) => {
                const Icon = item.icon
                const href = item.href.startsWith("#")
                  ? `/${item.href}`
                  : item.href
                const active = pathname === href

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="h-10 rounded-lg px-3 text-[13px] data-[active=true]:bg-primary/10 data-[active=true]:font-semibold data-[active=true]:text-primary"
                    >
                      <Link href={href} onClick={() => setOpenMobile(false)}>
                        <Icon className="size-4" strokeWidth={1.8} />
                        <span>{item.label}</span>
                        {active ? (
                          <span className="ml-auto size-1.5 rounded-full bg-primary" />
                        ) : null}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6 p-0">
          <SidebarGroupLabel className="mb-2 px-3 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/dashboard")}
                  className="h-10 rounded-lg px-3 text-[13px] data-[active=true]:bg-primary/10 data-[active=true]:font-semibold data-[active=true]:text-primary"
                >
                  <Link href="/dashboard" onClick={() => setOpenMobile(false)}>
                    <LayoutDashboard className="size-4" />
                    <span>Dashboard</span>
                    <ArrowUpRight className="ml-auto size-3.5" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/account")}
                  className="h-10 rounded-lg px-3 text-[13px] data-[active=true]:bg-primary/10 data-[active=true]:font-semibold data-[active=true]:text-primary"
                >
                  <Link href="/account" onClick={() => setOpenMobile(false)}>
                    <CircleHelp className="size-4" />
                    <span>Account settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/70 p-3">
        <ThemeSelector />
        <Link
          href={user ? "/account" : "/login"}
          onClick={() => setOpenMobile(false)}
          className="flex min-w-0 items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted"
        >
          {isLoading ? (
            <Skeleton className="size-9 shrink-0 rounded-full" />
          ) : (
            <Avatar className="size-9 shrink-0 border border-border">
              <AvatarImage src={user?.picture ?? undefined} alt="" />
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {user?.name?.slice(0, 1) ??
                  user?.email?.slice(0, 1).toUpperCase() ??
                  "G"}
              </AvatarFallback>
            </Avatar>
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold">
              {isLoading
                ? "Loading profile…"
                : (user?.name ?? "Welcome to Google Drive MCP")}
            </span>
            <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
              {isLoading
                ? "Fetching your account"
                : (user?.email ?? "Sign in to get started")}
            </span>
          </span>
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
        </Link>
      </SidebarFooter>
    </Sidebar>
  )
}
