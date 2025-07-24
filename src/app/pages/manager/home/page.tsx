"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  Menu, 
  DollarSign, 
  Clock, 
  Truck 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import axiosInstance from '@/app/utils/axios';
import { useQuery } from '@tanstack/react-query';
import useUserStore from '@/app/store/user.store';



export default function Page() {



  const [dashboardData, setDashboardData] = useState({
    totalIngredients: 0,
    totalMenus: 0,
    salesToday: 0,
    pendingRequests:0,
    toShipRequests: 0
  })


  const { data } = useQuery({
      queryKey: ["manager"],
      queryFn: () => axiosInstance.get("/branch/manager")
  })

  useEffect(() => {
      if(data?.data) setDashboardData(data?.data)
  }, [data])


  console.log("data:  console.log(dashboardData)")
  console.log(dashboardData)


  const metrics = [
    {
      title: "Total Ingredients",
      value: dashboardData.totalIngredients,
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Total Menus",
      value: dashboardData.totalMenus,
      icon: Menu,
      color: "text-green-600"
    },
    {
      title: "Sales Today",
      value: dashboardData.salesToday,
      icon: DollarSign,
      color: "text-emerald-600"
    },
    {
      title: "Pending Requests",
      value: dashboardData.pendingRequests,
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "To Ship Requests",
      value: dashboardData.toShipRequests,
      icon: Truck,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="h-dvh w-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your restaurant operations</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {metric.title}
                  </CardTitle>
                  <IconComponent className={`h-5 w-5 ${metric.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}