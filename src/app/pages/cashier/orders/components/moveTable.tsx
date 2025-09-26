"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogClose 
} from "@/components/ui/dialog";
import {  getOrdersInterface} from "@/app/types/orders.type";
import { useQuery , useMutation} from "@tanstack/react-query";
import axiosInstance from "@/app/utils/axios";
import { useEffect, useState } from "react";
import useTableStore from "@/app/store/table.store";
import useActiveTableStore from "@/app/store/activeTable.store";
import { MoveIcon } from "lucide-react";
import { errorAlert , confirmAlert} from "@/app/utils/alert";


type TableData = {
  table: string;
  x: number;
  y: number;
};



export function MoveItButton({ order, setOrders }: { order: getOrdersInterface, setOrders :  React.Dispatch<React.SetStateAction<getOrdersInterface[]>> }) {
    const [open, setOpen] = useState(false);

    const [positions, setPositions] = useState<TableData[]>([]);

    const { setTable } = useTableStore()
    const { activeTables, removeTable, addTable } = useActiveTableStore()

    const { data } = useQuery({
        queryKey: ["tables"],
        queryFn: () => axiosInstance.get("/branch/tables"),
        refetchInterval: 1000 * 60,
    });

    useEffect(() => {
        if (data?.data) setPositions(data?.data);
    }, [data]);


    const mutation = useMutation({
        mutationFn: (data: { id : string, table : string, branch : string}) =>
          axiosInstance.put("/order/move", data),
        onSuccess: (response) => {
          setOrders(response.data)
          setOpen(false)
        },
        onError: (err) => {
          errorAlert("error")
        },
      })


    const moveOrderHandler = (table : string) => {
        if(activeTables.includes(table)) return errorAlert("table already taken")
        removeTable(order.table)
        addTable(table)
        mutation.mutate({id : order._id, table : table, branch : order.branch})
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
            size={"icon"}
            variant={'outline'}
        >
           <MoveIcon className="text-green-800" />
        </Button>
      </DialogTrigger>
      <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>   
           
          </DialogDescription>
        </DialogHeader>
      <DialogContent className="sm:max-w-full">
     
      <div className=" w-full h-full bg-stone-50 overflow-hidden flex justify-center items-center">
        <div className="w-full h-dvh bg-stone-100 relative">
        <Button className="absolute top-10 left-10" onClick={() => setOpen(false)}> 
            Close
        </Button>
        <div
              style={{
                position: "absolute",
                right: 20,
                top: 20,
                width: 100,
                height: 100,
                
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                fontWeight: 600,
              }}
              className={` bg-white`}
              onClick={() => setTable("No Table")}
            >
              No Table
            </div>
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
              className={` ${activeTables.includes(item.table) ? "bg-gray-500 text-white " : "bg-white   "}  ${order.table == item.table && "bg-green-500"}`}
              onClick={() => moveOrderHandler(item.table)}
            >
              {item.table}
            </div>
          ))}
        </div>
        
      </div>

       
      </DialogContent>
    </Dialog>
  );
}