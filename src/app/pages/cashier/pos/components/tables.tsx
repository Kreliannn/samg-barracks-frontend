"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { CashierSideBar } from "@/components/ui/cashierSidebar";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/app/utils/axios";
import { useEffect, useState } from "react";
import useTableStore from "@/app/store/table.store";
import useActiveTableStore from "@/app/store/activeTable.store";

type TableData = {
  table: string;
  x: number;
  y: number;
};

export default function TableView() {
  const [positions, setPositions] = useState<TableData[]>([]);

  const { setTable } = useTableStore()
  const { activeTables } = useActiveTableStore()

  const { data } = useQuery({
    queryKey: ["tables"],
    queryFn: () => axiosInstance.get("/branch/tables"),
    refetchInterval: 1000 * 60,
  });

  useEffect(() => {
    if (data?.data) setPositions(data?.data);
  }, [data]);

  return (
    <SidebarProvider>
      <CashierSideBar />
      <div className=" w-full h-full bg-stone-50 overflow-hidden flex justify-center items-center">
        <div className="w-full h-dvh bg-stone-100 relative">
          {positions.map((item) => (
            <div
              key={item.table}
              style={{
                position: "absolute",
                left: item.x,
                top: item.y,
                width: 100,
                height: 100,
                
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                fontWeight: 600,
              }}
              className={` ${activeTables.includes(item.table) ? "bg-green-500 text-white " : "bg-white   "} `}
              onClick={() => setTable(item.table)}
            >
              {item.table}
            </div>
          ))}
        </div>
        
      </div>
    </SidebarProvider>
  );
}
