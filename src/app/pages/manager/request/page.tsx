"use client";
import RequestItem from "./components/requestItem";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/app/utils/axios";
import { getRequestInterface } from "@/app/types/request.type";
import OrderRequest from "./components/orderRequest";
import OrderHistory from "./components/orderHistory";


export default function Page() {

  const [request, setRequest] = useState<getRequestInterface[]>([])
 
  const { data } = useQuery({
    queryKey: ["request"],
    queryFn: () => axiosInstance.get("/request/branch")
  })

  useEffect(() => {
      if(data?.data) setRequest(data?.data)
  }, [data])

  console.log(request)

  return (
    <div className="h-dvh w-full grid grid-cols-1 lg:grid-cols-2 p-4 md:p-5 gap-4 overflow-auto">
      {/* First column */}
      <div>
        <RequestItem setRequest={setRequest} />
      </div>
  
      {/* Second column */}
      <div className="grid grid-cols-1 lg:grid-rows-2 gap-4">
        <div className="max-h-[350px]">
          <OrderRequest request={request} setRequest={setRequest} />
        </div>
        <div className="max-h-[350px]">
          <OrderHistory request={request} />
        </div>
      </div>
    </div>
  );
  
}
