"use client"
import Link from "next/link";
import { PackagePlus, Home, Building, Search, UserPlus2, User, FileText, BarChart3, Building2, LogOut, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Utensils } from "lucide-react";
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
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import useUserStore from "@/app/store/user.store";

// Navigation items
const navigationItems = [
  {
    title: "Dashboard",
    url: "/pages/cashier/home",
    icon: Home,
  },
  {
    title: "Pos",
    url: "/pages/cashier/pos",
    icon: PackagePlus,
  },
  {
    title: "Orders",
    url: "/pages/cashier/orders",
    icon: PackagePlus,
  },
  {
    title: "Transaction",
    url: "/pages/cashier/transaction",
    icon: PackagePlus,
  },
]

const accountItems = [
  {
    title: "Logout",
    url: "/",
    icon: LogOut,
  }
]

interface AppSidebarProps {
  className?: string
}

export function CashierSideBar({ className }: AppSidebarProps) {
  const { user , clearUser} = useUserStore()
  const [isOpen, setIsOpen] = useState(false)

  
  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={toggleSidebar}
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Desktop Toggle Button */}
      <Button
        onClick={toggleSidebar}
        variant="outline"
        size="icon"
        className="hidden lg:flex fixed top-4 left-4 z-50"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-full transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar className={className}>
        <SidebarHeader className="pt-16">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="/" className="font-semibold">
                  <div className="aspect-square size-8 overflow-hidden rounded-lg w-10 h-10">
                    <img src="/web/logo.jpg" alt="Logo" className="object-cover w-full h-full rounded-lg" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">The Barracks</span>
                    <span className="truncate text-xs text-sidebar-foreground/70">{user?.branch}</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Section</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => {
                  if (user?.branch != "Main Branch" && item.title == "Branch") return null

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url} onClick={() => setIsOpen(false)}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            {accountItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild   onClick={() => clearUser()} > 
                  <Link href={item.url} onClick={() => setIsOpen(false)}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
        </Sidebar>
      </div>
    </>
  )
}