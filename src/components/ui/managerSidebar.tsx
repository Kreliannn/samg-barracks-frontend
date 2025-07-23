"use client"
import Link from "next/link";
import { useState, useEffect } from "react"
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
import useUserStore from "@/app/store/user.store";
import {
  PackagePlus,
  Home,
  Building2,
  LogOut,
  Utensils,
  ClipboardList,
  ShoppingCart,
  Table,
  QrCode
} from "lucide-react";

// Navigation items
const navigationItems = [
  {
    title: "Dashboard",
    url: "/pages/manager/home",
    icon: Home,
  },
  {
    title: "Manage Ingredients",
    url: "/pages/manager/ingredients",
    icon: PackagePlus, // Optional alternative: Boxes
  },
  {
    title: "Manage Menu",
    url: "/pages/manager/menu",
    icon: Utensils,
  },
  {
    title: "Order Request",
    url: "/pages/manager/request",
    icon: ClipboardList,
  },
  {
    title: "Branch Order Request",
    url: "/pages/manager/branchOrderRequest",
    icon: ShoppingCart,
  },
  {
    title: "Qr Code Scanner",
    url: "/pages/manager/scanner",
    icon: QrCode,
  },
  {
    title: "Tables",
    url: "/pages/manager/table",
    icon: Table,
  },
];

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

export function ManagerSideBar({ className }: AppSidebarProps) {
  const { user } = useUserStore()
    
  return (
    <Sidebar className={className}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/" className="font-semibold">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Building2 className="size-4" />
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

                if(user?.branch != "Main Branch" && item.title == "Branch") return null
                if(user?.branch == "Main Branch" && item.title == "Qr Code Scanner") return null
                if(user?.branch == "Main Branch" && item.title == "Order Request") return null
                if(user?.branch != "Main Branch" && item.title == "Branch Order Request") return null

                return(
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
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
              <SidebarMenuButton asChild>
                <Link href={item.url}>
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
  )
}