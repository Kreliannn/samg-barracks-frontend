"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { backendUrl } from "@/app/utils/url";
import { useQuery } from "@tanstack/react-query";
import { AdminSideBar } from "@/components/ui/adminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
    
 

  return (
    <div className="">
        <SidebarProvider>
          <AdminSideBar />
          <div>
            <h1> welcole admin</h1>
          </div>
        </SidebarProvider>
    </div>
  );
}

