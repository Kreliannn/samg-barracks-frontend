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
    <div className="h-dvh w-full grid grid-cols-1 lg:grid-cols-2 p-5 gap-2 overflow-auto">
      {/* First column */}
      <div className=" ">
        <RequestItem setRequest={setRequest} />
      </div>

      {/* Second column with 2 rows */}
      <div className="grid grid-rows-2 gap-[1%]">

        <div className="">
         <OrderRequest request={request} setRequest={setRequest}/>
        </div>

        <div className="">
          <OrderHistory request={request}/>
        </div>

      </div>
    </div>
  );
}
