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
import { MergeIcon} from "lucide-react";
import { errorAlert } from "@/app/utils/alert";



export function MergeButton({ id, orders , setOrders }: { id: string,  orders: getOrdersInterface[], setOrders :  React.Dispatch<React.SetStateAction<getOrdersInterface[]>> }) {

    const [open, setOpen] = useState(false);

    const {removeTable} = useActiveTableStore()

    const [selectedOrders, setSelectedOrders] = useState<string[]>([])
    const [selectedTable, setSelectedTable] = useState<string[]>([])

    const filteredOrders = orders.filter((order) => order._id != id)


    const mutation = useMutation({
        mutationFn: (data: { id : string, ids : string[]}) =>
          axiosInstance.put("/order/merge", data),
        onSuccess: (response) => {
          setOrders(response.data)
          setOpen(false)
          setSelectedOrders([])
          setSelectedTable([])
        },
        onError: (err) => {
          errorAlert("error")
        },
      })


    const selectHandler = (e : React.ChangeEvent<HTMLInputElement>, id : string, table : string) => {
        if(e.target.checked){
            setSelectedOrders((prev) => [...prev, id])
            setSelectedTable((prev) => [...prev, table])
        } else {
            setSelectedOrders((prev) => prev.filter((i) => i != id))
            setSelectedTable((prev) => prev.filter((i) => i != table))
        }
    }

    const mergeHandler = () => {
        if(selectedOrders.length == 0) return errorAlert("no selected tables")
        selectedTable.forEach((table) => {
            removeTable(table)
        })
        mutation.mutate({id : id, ids: selectedOrders})
    }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
            size={"icon"}
            variant={'outline'}
        >
           <MergeIcon className="text-green-800" />
        </Button>
      </DialogTrigger>
      <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>   
           
          </DialogDescription>
        </DialogHeader>
      <DialogContent className="sm:max-w-[500px]">

        <div className="w-full h-[400px] overflow-auto mt-5 p-2">
            {filteredOrders.map((order) => (
                <div key={order._id} className="bg-stone-50 shadow w-full mb-3 p-2">

                    <div className="flex justify-between mt-2">
                         <strong> table: {order.table} </strong>
                         <input type="checkbox"  onChange={(e) => selectHandler(e, order._id, order.table)} />
                    </div>
                    
                    <div className="flex justify-between text-gray-800">
                        <h1> orders </h1>
                        <h1> quantity </h1>
                    </div>
                         
                    <ul>
                        {order.orders.map((item) => (
                            <li key={item.item_id} className="flex justify-between text-gray-400">
                                <h1>{item.name}</h1>
                                <h1>{item.qty}x</h1>
                            </li>
                        ))}
                    </ul>
                    <br />
                    <strong className="text-green-500 mt-5"> bill :{order.grandTotal} </strong>
                </div>
            ))}
        </div>
     
        

        <div className="w-full">
            <Button className="w-full" onClick={mergeHandler}> merge </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}