"use client";
import { ManagerSideBar } from "@/components/ui/managerSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
    
 

  return (
    <div className="">
        <SidebarProvider>
          <ManagerSideBar />
          <div>
            <h1> welcome Manger</h1>
          </div>
        </SidebarProvider>
    </div>
  );
}
