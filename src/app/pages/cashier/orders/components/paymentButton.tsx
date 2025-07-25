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
import Image from "next/image";
import { successAlert, errorAlert } from "@/app/utils/alert";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/app/utils/axios";
import useActiveTableStore from "@/app/store/activeTable.store";

const money = [20, 50, 100, 200, 500, 1000]

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
      setPayment(0)
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

    const addMoney = (amount : number) => {
      setPayment((prev) => prev += amount)
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
           onClick={() => print3rdReceipt(order, 5000)}
           variant={"outline"}
           className="w-[70%]  font-semibold py-2 px-4 rounded-md transition-colors duration-200"
        >
            Proceed to Payment
        </Button>
      </DialogTrigger>
      <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>   
           
          </DialogDescription>
        </DialogHeader>
      <DialogContent className="sm:max-w-[600px]">
        <div className="p-5">
            <h1 className="text-3xl font-bold">Bill :  <span className="text-green-500"> ₱ {order.grandTotal.toFixed(2)} </span></h1>

            <div className="w-full  grid grid-cols-2 gap-3 mt-3 mb-3">
                {money.map((money) => (
                  <div key={money} className="h-24 bg-red-100 shadow-lg relative" onClick={() => addMoney(money)}>
                    <Image
                      src={`/money/${money}.jpg`}
                      alt={`Money ${money}`}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                ))}
            </div>

            <h1 className="mb-2"> Customer Cash:  </h1>
            <Input type="number" className="mb-4 p-5 text-2xl font-bold  text-green-500"  value={payment} onChange={(e) => setPayment(Number(e.target.value))} /> 
            <Button className="w-full " size={"lg"} onClick={completeOrder}> Pay </Button>
        </div>

     
      </DialogContent>
    </Dialog>
  );
}