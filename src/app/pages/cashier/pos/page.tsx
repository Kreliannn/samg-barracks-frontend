"use client";

import { Button } from "@/components/ui/button";
import { CashierSideBar } from "@/components/ui/cashierSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getMenuInterface } from "@/app/types/menu.type";
import { useState, useEffect, use } from "react";
import { useQuery } from "@tanstack/react-query";
import { backendUrl } from "@/app/utils/url";
import axiosInstance from "@/app/utils/axios";
import { Package, Utensils } from "lucide-react";
import { AddCart } from "./components/addCart";
import { orderInterface } from "@/app/types/orders.type";
import { Cart } from "./components/cart";
import TableGrid from "./components/tables";
import useTableStore from "@/app/store/table.store";

const types = [ "All", "Ala carte", "Unli", "Sizzling", "Pulutan", "Beverage", "Others"]

export default function POS() {

    const { table, setTable } = useTableStore()

    const [menuData, setMenuData] = useState<getMenuInterface[]>([])
    const [menu, setMenu] = useState<getMenuInterface[]>([])

    const { data } = useQuery({
        queryKey: ["menu"],
        queryFn: () => axiosInstance.get("/menu")
    })

    useEffect(() => {
        if(data?.data)
        {
            setMenuData(data.data)
            setMenu(data.data)
        }
    }, [data])

    const filterHandler = (type : string) => {
        if(type == "All") return setMenu(menuData)
        setMenu(menuData.filter((item) => item.type == type))
    }


    if(!table) return <TableGrid  />

  return (
        <div className="h-dvh w-full flex">
          <div className="h-full w-4/6 bg-stone-100">

                <div className="h-[10%] w-full bg-stone-800 shadow-lg flex items-center relative px-4">
                    <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl font-bold text-white">
                        {table}
                    </h1>
          
                    <Button  variant="outline" className="ml-auto" onClick={() => setTable("")}>
                        Switch Table
                    </Button>
                </div>


                <div className="w-full h-[80%] bg-gray-100 overflow-auto p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-3">
        
                    {menu.map((item) => (
                        <div
                        key={item._id}
                        className="bg-white relative  rounded-2xl shadow hover:shadow-lg border border-gray-200 overflow-hidden transition-all duration-200 group"
                        >
                        {/* Image Section */}
                        <div className="h-62 bg-gray-100   overflow-hidden">
                            {item.img ? (
                            <img
                                src={item.img}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                            ) : null}
        
                            {/* Placeholder Icon */}
                            <div className={`absolute inset-0 flex items-center justify-center text-gray-400 ${item.img ? 'hidden' : ''}`}>
                                <Package className="w-12 h-12" />
                            </div>
                        </div>
        
                        {/* Content */}
                        <div className="p-4 space-y-1">
                            <h3 className="font-semibold text-lg text-gray-900 truncate">
                            {item.name}
                            </h3>
                            <p className="text-sm text-gray-500">₱ {item.price}</p>
                            <p className="text-sm text-gray-500">{item.type}</p>
                            <AddCart menu={item} />
                        </div>

                        
                        </div>
                    ))}
        
                    </div>
      
                    {/* Empty State */}
                    {menu.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <Utensils className="w-16 h-16 mb-4" />
                        <p className="text-xl font-semibold">No Menu Found</p>
                        <p className="text-sm">Add items to populate your food menu.</p>
                    </div>
                    )}
              </div>


                <div className="h-[10%] w-full bg-stone-800  flex justify-center items-center gap-5">
                    {types.map((type) => (
                        <Button className="bg-white text-stone-800  hover:bg-stone-200 hover:text-black"  key={type} size={"lg"} onClick={() => filterHandler(type)}> {type} </Button>
                    ))}
                </div>
          </div>
          
          <div className="h-full w-2/6 bg-stone-200">
            <Cart table={table} />
          </div>

        </div>
  );
}