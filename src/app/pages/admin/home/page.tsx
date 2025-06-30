"use client";
import { AdminSideBar } from "@/components/ui/adminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
    
 

  return (
    <div className="">
        <SidebarProvider>
          <AdminSideBar />
          <div>
            <h1> welcome admin</h1>
          </div>
        </SidebarProvider>
    </div>
  );
}

