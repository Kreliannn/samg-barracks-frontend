"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { getMenuInterface } from "@/app/types/menu.type";
import { Plus, Minus } from "lucide-react";
import { orderInterface } from "@/app/types/orders.type";
import useOrderStore from "@/app/store/cart.store";
import { print3rdReceipt } from "@/app/utils/receiptConsole";
import { ordersInterface , getOrdersInterface} from "@/app/types/orders.type";

import { successAlert, errorAlert } from "@/app/utils/alert";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/app/utils/axios";
import useActiveTableStore from "@/app/store/activeTable.store";

export function PaymentButton({ order, setOrders }: { order: getOrdersInterface, setOrders :  React.Dispatch<React.SetStateAction<getOrdersInterface[]>> }) {
    const [open, setOpen] = useState(false);

    const [payment, setPayment] = useState(0);

    const {removeTable} = useActiveTableStore()
    
  const mutation = useMutation({
    mutationFn: (data: { id : string }) =>
      axiosInstance.put("/order", data),
    onSuccess: (response) => {
      successAlert("success")
      setOrders(response.data)
      setOpen(false)
    },
    onError: (err) => {
      errorAlert("error")
    },
  })

    const completeOrder = () => {
        if(payment < order.grandTotal) return errorAlert("too low")
        removeTable(order.table)
        mutation.mutate({ id : order._id })
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button 
           onClick={() => print3rdReceipt(order, 5000)}
           className="w-[70%] bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
        >
            Proceed to Payment
        </button>
      </DialogTrigger>
      <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>   
           
          </DialogDescription>
        </DialogHeader>
      <DialogContent className="sm:max-w-[600px]">
        <div className="p-5">
            <h1>Bill {order.grandTotal}</h1>
            <h1> Enter Payment</h1>
            <Input type="number" className="mb-4"  value={payment} onChange={(e) => setPayment(Number(e.target.value))} /> 
            <Button className="w-full " onClick={completeOrder}> Pay </Button>
        </div>

     
      </DialogContent>
    </Dialog>
  );
}