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
      <SidebarHeader className="bg-green-900">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-green-900">
            <a href="/" className="font-semibold ">
                <div className="aspect-square size-8 overflow-hidden rounded-lg w-30 h-30">
                  <img src="/web/logo.jpg" alt="Logo" className="object-cover w-full h-full rounded-lg" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-white">Manager</span>
                  <span className="truncate text-xs  text-stone-100 ">{user?.branch}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-gradient-to-r from-green-800 to-green-900">
        <SidebarGroup>
          <SidebarGroupLabel className="text-stone-100">Section</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {

                if(user?.branch != "Main Branch" && item.title == "Branch") return null
                if(user?.branch == "Main Branch" && item.title == "Qr Code Scanner") return null
                if(user?.branch == "Main Branch" && item.title == "Order Request") return null
                if(user?.branch != "Main Branch" && item.title == "Branch Order Request") return null

                return(
                    <SidebarMenuItem key={item.title} className="text-stone-100">
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

      <SidebarFooter className="bg-gradient-to-r from-green-800 to-green-900">
        <SidebarMenu>
          {accountItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className="text-stone-100">
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