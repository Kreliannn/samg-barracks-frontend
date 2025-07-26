// app/pages/manager/layout.tsx
import Link from "next/link";
import { ManagerSideBar } from "@/components/ui/managerSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
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
  