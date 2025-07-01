"use client";
import { ManagerSideBar } from "@/components/ui/managerSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getMenuInterface } from "@/app/types/menu.type";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { backendUrl } from "@/app/utils/url";
import { Edit, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

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
        queryFn: () => axios.get(backendUrl("menu"))
    })

    useEffect(() => {
        if(data?.data) setMenu(data?.data)
    }, [data])


    return (
        <div className="">
            <SidebarProvider>
                <ManagerSideBar />
                <div className="h-dvh w-full">

                    <div className="w-full h-5/6 bg-stone-50 overflow-auto p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {menu.map((item) => (
                                <div 
                                    key={item._id} 
                                    className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
                                >
                                    {/* Image Section */}
                                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                                        {item.img ? (
                                            <img 
                                                src={item.img} 
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    target.nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        <div className={`absolute inset-0 flex items-center justify-center ${item.img ? 'hidden' : ''}`}>
                                            <Package className="w-16 h-16 text-gray-400" />
                                        </div>
                                      
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg text-gray-900 mb-2 truncate">
                                            {item.name}
                                        </h3>

                                        <h3 className="font-semibold text-lg text-gray-900 mb-2 truncate">
                                            {item.price}
                                        </h3>   
                                       
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Empty State */}
                        {menu.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                <Package className="w-16 h-16 mb-4" />
                                <p className="text-lg font-medium">No menu found</p>
                                <p className="text-sm">Add some menu to get started</p>
                            </div>
                        )}
                    </div>

                </div>
            </SidebarProvider>
        </div>
    );
}