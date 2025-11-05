// app/pages/manager/layout.tsx
"use client"
import Link from "next/link";
import { AdminSideBar } from "@/components/ui/adminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import UnauthorizedPage from "@/components/ui/unauthorizedPage";
import useUserStore from "@/app/store/user.store";


export default function ManagerLayout({ children }: { children: React.ReactNode }) {
    const {user} = useUserStore()

    if(!user || !user?.role.isAdmin) return <UnauthorizedPage />

    return (
      <div className="flex min-h-screen ">
          <SidebarProvider>
                
                <AdminSideBar />
                {/* Main content area */}
                <main className="w-full">
                    <div className="mb-[80px] md:mb-[0px]"> </div>
                    {children}
                </main>
          </SidebarProvider>
       
      </div>
    );
  }