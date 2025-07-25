"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import useOrderStore from "@/app/store/cart.store";
import useUserStore from "@/app/store/user.store";
import { useMutation } from "@tanstack/react-query";
import { ordersInterface , orderInterface} from "@/app/types/orders.type";
import axiosInstance from "@/app/utils/axios";
import { successAlert } from "@/app/utils/alert";
import useTableStore from "@/app/store/table.store";
import { orderInformation } from "@/app/types/orders.type";
import useActiveTableStore from "@/app/store/activeTable.store";

export function PlaceOrder({ orderInfo } : { orderInfo : orderInformation}) {

  const {addTable} = useActiveTableStore()

  const { orders, clearOrders } = useOrderStore()
  const { user } = useUserStore()

  const [open, setOpen] = useState(false);
  const [orderType, setOrderType] = useState("dine in")

  const { table, setTable } = useTableStore()


  const now = new Date();
  const time = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });



 

  const mutation = useMutation({
    mutationFn : (data  : ordersInterface) => axiosInstance.post("/order", data),
    onSuccess : (response) => {
        setOpen(false)
        clearOrders()
        successAlert("order placed")
        //printOrder()
    }, 
    onError : (err) => {
        alert("errror")
    }
  })

  const handlePlaceOrder = () => {
    if(!user?.fullname || !user?.branch) return alert("no user")
    const formattedDate = new Date().toISOString().split('T')[0];
  
    const orderData = {
        orders : orders,
        total : orderInfo.totalWithVat,
        vat : orderInfo.vat,
        subTotal : orderInfo.subTotal,
        grandTotal : orderInfo.discountedTotal,
        totalDiscount : orderInfo.totalDiscount,
        serviceFee : orderInfo.serviceFee,
        orderType : orderType,
        table : table,  
        cashier : user.fullname ,
        branch : user.branch ,
        date : formattedDate.toString(),
        time : time,
        status : "active"
    }
    addTable(table)
    setTable("")
    mutation.mutate(orderData)
  }

  const printOrder = () => {
    const printContent = document.getElementById('print-order-content');
    const originalContent = document.body.innerHTML;
    
    if (printContent) {
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); // Reload to restore React event handlers
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full " size="lg" onClick={() => setOpen(true)}>
            Place Order
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mb-6">
            {/* Order Type Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Order Type</label>
              <Select defaultValue="dine_in" value={orderType} onValueChange={setOrderType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select order type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dine in">Dine In</SelectItem>
                  <SelectItem value="take out">Take Out</SelectItem>
                  <SelectItem value="grab">Grab</SelectItem>
                </SelectContent>
              </Select>
            </div>

          
          
            <Button onClick={handlePlaceOrder} className="w-full">Place Order</Button>
          </div>
        </DialogContent>
      </Dialog>

   
    </>
  );
}