// app/pages/manager/layout.tsx
import Link from "next/link";
import { AdminSideBar } from "@/components/ui/adminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import UnauthorizedPage from "@/components/ui/unauthorizedPage";
import useUserStore from "@/app/store/user.store";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
    const {user} = useUserStore()

    if(!user || user?.role != "admin") return <UnauthorizedPage />

    return (
      <div className="flex min-h-screen">
          <SidebarProvider>
                
                <AdminSideBar />
                {/* Main content area */}
                <main className="w-full">
                    {children}
                </main>
          </SidebarProvider>
       
      </div>
    );
  }