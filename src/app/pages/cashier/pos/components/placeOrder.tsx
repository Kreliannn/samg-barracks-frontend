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

export function PlaceOrder({subTotal, grandTotal, totalDiscount} : {subTotal : number, grandTotal : number , totalDiscount : number}) {

  const { orders, clearOrders } = useOrderStore()
  const { user } = useUserStore()

  const [open, setOpen] = useState(false);
  const [orderType, setOrderType] = useState("dine in")
  const [table, setTable] = useState("Table #1")

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
        subTotal : subTotal,
        grandTotal : grandTotal,
        totalDiscount : totalDiscount,
        orderType : orderType,
        table : table,
        cashier : user.fullname ,
        branch : user.branch ,
        date : formattedDate.toString()
    }

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

            {/* Table Number Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Table Number</label>
              <Select  value={table} onValueChange={setTable}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select table number" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => (
                    <SelectItem key={i + 1} value={`Table #${i + 1}`}>
                      Table #{i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          
            <Button onClick={handlePlaceOrder} className="w-full">Submit</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invisible Print Content */}
      <div id="print-order-content" className="hidden">
        <style>{`
          @media print {
            @page {
              size: 58mm auto; /* Common receipt printer width */
              margin: 0;
            }
            * {
              box-sizing: border-box;
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: 10px;
              line-height: 1.1;
              margin: 0;
              padding: 2mm;
              width: 58mm;
              color: #000;
              background: white;
            }
            .receipt-header {
              text-align: center;
              border-bottom: 1px dashed #000;
              padding-bottom: 3mm;
              margin-bottom: 3mm;
            }
            .receipt-header div:first-child {
              font-weight: bold;
              font-size: 12px;
              margin-bottom: 1mm;
            }
            .receipt-info {
              margin-bottom: 3mm;
              border-bottom: 1px dashed #000;
              padding-bottom: 3mm;
              font-size: 9px;
            }
            .receipt-info div {
              margin-bottom: 1mm;
              word-wrap: break-word;
            }
            .order-list {
              margin-bottom: 3mm;
            }
            .order-list > div:first-child {
              font-weight: bold;
              font-size: 10px;
              margin-bottom: 2mm;
              border-bottom: 1px solid #000;
              padding-bottom: 1mm;
              text-align: center;
            }
            .order-item {
              margin-bottom: 1mm;
              font-size: 9px;
            }
            .order-name {
              word-wrap: break-word;
              margin-bottom: 0.5mm;
            }
            .order-qty {
              text-align: right;
              font-weight: bold;
            }
            .receipt-footer {
              text-align: center;
              border-top: 1px dashed #000;
              padding-top: 3mm;
              margin-top: 3mm;
              font-size: 8px;
            }
          }
        `}</style>
        
        <div className="receipt-header">
          <div style={{fontWeight: 'bold', fontSize: '14px'}}>KITCHEN ORDER</div>
        
        </div>
        
        <div className="receipt-info">
          <div><strong>Table:</strong> {table}</div>
          <div><strong>Cashier:</strong> {user?.fullname}</div>
          <div><strong>Date:</strong> {formatDate(new Date().toISOString())}</div>
          <div><strong>Type:</strong> {orderType}</div>
        </div>
        
        <div className="order-list">
          <div style={{fontWeight: 'bold', marginBottom: '4px', borderBottom: '1px solid #000', paddingBottom: '2px'}}>
            ORDERS
          </div>
          {orders.map((order: orderInterface, index: number) => (
            <div key={index} className="order-item">
              <div className="order-name">{order.name }</div>
              <div className="order-qty">Qty: {order.qty}</div>
            </div>
          ))}
        </div>
        
       
      </div>
    </>
  );
}