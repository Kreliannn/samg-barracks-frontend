// app/pages/manager/layout.tsx
import Link from "next/link";
import { CashierSideBar } from "@/components/ui/cashierSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
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