"use client";

import { getMenuInterface } from "@/app/types/menu.type";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { backendUrl } from "@/app/utils/url";
import { Edit, Package, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/app/utils/axios";
import { AddButton } from "./components/addButton";
import { EditButton } from "./components/editButton";

export interface getIngredientsInterface {
    _id: string,
    name: string,
    stocks: number,
    branch: string,
    img: string
}

export default function Home() {
    
    const [menu, setMenu] = useState<getMenuInterface[]>([])

    const { data } = useQuery({
        queryKey: ["menu"],
        queryFn: () => axiosInstance.get("/menu")
    })

    useEffect(() => {
        if(data?.data) setMenu(data?.data)
    }, [data])


    return (
        
         
           
            <div className="h-dvh w-full flex flex-col">
      
              {/* Header with Add Button */}
              <div className="w-full h-1/6 bg-white border-b shadow-sm flex items-center justify-between px-6">
                <h1 className="text-2xl font-bold text-gray-800">Food Menu</h1>
                <AddButton setMenu={setMenu} />
              </div>
      
              {/* Content */}
              <div className="w-full h-5/6 bg-gray-100 overflow-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
      
                  {menu.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white relative rounded-2xl shadow hover:shadow-lg border border-gray-200 overflow-hidden transition-all duration-200 group"
                    >
                      {/* Image Section */}
                      <div className="h-72 bg-gray-100 relative overflow-hidden">
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
                        <EditButton menu={item} setMenu={setMenu} />
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
      
            </div>
         
       
      );
      
}