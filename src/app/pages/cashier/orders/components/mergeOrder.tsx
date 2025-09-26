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
import {  Merge} from "lucide-react";
import { errorAlert } from "@/app/utils/alert";





export function MoveItButton({ id, orders , setOrders }: { id: string,  orders: getOrdersInterface[], setOrders :  React.Dispatch<React.SetStateAction<getOrdersInterface[]>> }) {
    const [open, setOpen] = useState(false);

    const [selectedOrders, setSelectedOrders] = useState<string[]>([])

    const filteredOrders = orders.filter((order) => order._id != id)


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
        
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
            size={"icon"}
            variant={'outline'}
        >
           <Merge className="text-green-800" />
        </Button>
      </DialogTrigger>
      <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>   
           
          </DialogDescription>
        </DialogHeader>
      <DialogContent className="sm:max-w-[500px]">

        <div className="w-full h-300px overflow-auto">
            {filteredOrders.map((order) => (
                <div key={order._id}>
                    
                </div>
            ))}
        </div>
     
        

        <div className="w-full">
            <Button className="w-full"> merge </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}