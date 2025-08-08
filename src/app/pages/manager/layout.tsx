"use client"
import Link from "next/link";
import { ManagerSideBar } from "@/components/ui/managerSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import UnauthorizedPage from '@/components/ui/unauthorizedPage';
import useUserStore from "@/app/store/user.store";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {

  const {user} = useUserStore()

  if(!user || user?.role != "manager") return <UnauthorizedPage />
  
    return (
      <div className="flex min-h-screen">
          <SidebarProvider>
                <ManagerSideBar />
        
                {/* Main content area */}
                <main className="w-full h-dvh overflow-hidden">
                    {children}
                </main>
          </SidebarProvider> 
       
      </div>
    );
  }
  