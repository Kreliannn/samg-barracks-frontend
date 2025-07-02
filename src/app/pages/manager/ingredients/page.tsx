"use client";
import { ManagerSideBar } from "@/components/ui/managerSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AddButton } from "./components/addButton";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { backendUrl } from "@/app/utils/url";
import { Edit, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditButton } from "./components/editButton";
import axiosInstance from "@/app/utils/axios";

export interface getIngredientsInterface {
    _id: string,
    name: string,
    stocks: number,
    branch: string,
    img: string
}

export default function Home() {
    
    const [ingredients, setIngredients] = useState<getIngredientsInterface[]>([])

    const { data } = useQuery({
        queryKey: ["ingredients"],
        queryFn: () => axiosInstance.get("/ingredients")
    })

    useEffect(() => {
        if(data?.data) setIngredients(data?.data)
    }, [data])

    const handleEdit = (ingredient: getIngredientsInterface) => {
        // Handle edit functionality here
        console.log("Edit ingredient:", ingredient);
    }

    return (
        <div className="">
            <SidebarProvider>
                <ManagerSideBar />
                <div className="h-dvh w-full">

                  

                    <div className="w-full h-1/6 bg-white border-b shadow-sm flex items-center justify-between px-6">
                        <h1 className="text-2xl font-bold text-gray-800">Ingredients Inventory</h1>
                        <AddButton setIngredients={setIngredients}/>
                    </div>

                    <div className="w-full h-5/6 bg-stone-50 overflow-auto p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {ingredients.map((ingredient) => (
                                <div 
                                    key={ingredient._id} 
                                    className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
                                >
                                    {/* Image Section */}
                                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                                        {ingredient.img ? (
                                            <img 
                                                src={ingredient.img} 
                                                alt={ingredient.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    target.nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        <div className={`absolute inset-0 flex items-center justify-center ${ingredient.img ? 'hidden' : ''}`}>
                                            <Package className="w-16 h-16 text-gray-400" />
                                        </div>
                                        
                                      
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg text-gray-900 mb-2 truncate">
                                            {ingredient.name}
                                        </h3>
                                        
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Stock:</span>
                                                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                                                    ingredient.stocks > 50 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : ingredient.stocks > 20 
                                                        ? 'bg-yellow-100 text-yellow-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {ingredient.stocks}
                                                </span>
                                            </div>
                                            
                                            <div className="flex justify-between items-center">
                                               <EditButton ingredient={ingredient} setIngredients={setIngredients}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Empty State */}
                        {ingredients.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                <Package className="w-16 h-16 mb-4" />
                                <p className="text-lg font-medium">No ingredients found</p>
                                <p className="text-sm">Add some ingredients to get started</p>
                            </div>
                        )}
                    </div>

                </div>
            </SidebarProvider>
        </div>
    );
}