"use client";
import { ManagerSideBar } from "@/components/ui/managerSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AddButton } from "./components/addButton";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { backendUrl } from "@/app/utils/url";
import axios from "axios";

export default function Home() {
    
    const [ingredients, setIngredients] = useState([])

    const { data } = useQuery({
        queryKey : ["ingredients"],
        queryFn : () => axios.get(backendUrl("ingredients"))
    })

    useEffect(() => {
        if(data?.data) setIngredients(data?.data)
    }, [data])

  return (
    <div className="">
        <SidebarProvider>
          <ManagerSideBar />
          <div className="h-dvh w-full">

            <div className="w-full h-1/6 bg-stone-100">
                <AddButton />
            </div>

            <div className="w-full h-5/6 bg-stone-50 overflow-auto">

            </div>
            

          </div>
        </SidebarProvider>
    </div>
  );
}
