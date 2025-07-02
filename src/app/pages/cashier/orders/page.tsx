"use client";

import { CashierSideBar } from "@/components/ui/cashierSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <div className="">
      <SidebarProvider>
        <CashierSideBar />
        <div className="h-dvh w-full flex">
            <div className="h-[10%] w-full bg-stone-100">

            </div>

        
        </div>
      </SidebarProvider>
    </div>
  );
}