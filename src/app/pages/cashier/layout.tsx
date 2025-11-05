// app/pages/manager/layout.tsx
"use client"
import useUserStore from "@/app/store/user.store";
import Link from "next/link";
import { CashierSideBar } from "@/components/ui/cashierSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import UnauthorizedPage from '@/components/ui/unauthorizedPage';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {

    const {user} = useUserStore()

    if(!user || !user?.role.isCashier) return <UnauthorizedPage />

    return (
      <div className="flex min-h-screen">
          <SidebarProvider>
                <CashierSideBar />
        
                {/* Main content area */}
                <main className="w-full">
                    {children}
                </main>
          </SidebarProvider>
       
      </div>
    );
  }