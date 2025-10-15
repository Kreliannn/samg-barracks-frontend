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
import {  getOrdersInterface, orderInterface, ordersInterface} from "@/app/types/orders.type";
import { useMutation} from "@tanstack/react-query";
import axiosInstance from "@/app/utils/axios";
import { useEffect, useState } from "react";
import { SplitIcon} from "lucide-react";
import { errorAlert, successAlert } from "@/app/utils/alert";
import { getTotalVat, getTotaldiscount, getTotalWithVat } from "@/app/utils/customFunction";




export function SplitButton({  order , setOrders }: { order: getOrdersInterface, setOrders :  React.Dispatch<React.SetStateAction<getOrdersInterface[]>> }) {

    const [open, setOpen] = useState(false);

    const [firstOrder, setFirstOrder] = useState<orderInterface[]>(order.orders)
    const [secondOrder, setSecondOrder] = useState<orderInterface[]>([])

    useEffect(() => {
        setFirstOrder(order.orders);
        setSecondOrder([]);
    }, [order]);
      
   
    const mutation = useMutation({
        mutationFn: (data: { id : string, item_ids : string[], branch : string, order : ordersInterface }) =>
          axiosInstance.put("/order/split", data),
        onSuccess: (response) => {
          setOrders(response.data)
          setOpen(false)
          setSecondOrder([])
          successAlert("split order")
        },
        onError: (err) => {
          errorAlert("error")
        },
      })


   
      const firstToSecond = (selectedOrder : orderInterface) => {
        if(firstOrder.length == 1) return errorAlert("cannot be empty")
        setFirstOrder((prev) => prev.filter((order) => order.item_id != selectedOrder.item_id))
        setSecondOrder((prev) => [...prev, selectedOrder])
      }


      const secondToFirst = (selectedOrder : orderInterface) => {
        setSecondOrder((prev) => prev.filter((order) => order.item_id != selectedOrder.item_id))
        setFirstOrder((prev) => [...prev, selectedOrder ])
      }


 

    const splitHandler = () => {
        if(secondOrder.length == 0) return errorAlert("no selected items")
        const all_ids = secondOrder.map((item) => item.item_id)
        const orderData = {
            orders : secondOrder,
            total : getTotalWithVat(secondOrder),
            vat : getTotalVat(secondOrder),
            subTotal : getTotalWithVat(secondOrder),
            grandTotal :(getTotalWithVat(secondOrder) - getTotaldiscount(secondOrder)) + (getTotalWithVat(secondOrder) * 0.10),
            totalDiscount : getTotaldiscount(secondOrder),
            serviceFee : (getTotalWithVat(secondOrder) * 0.10),
            orderType : order.orderType,
            table : order.table + " (split)",  
            cashier : order.cashier ,
            branch : order.branch ,
            date : order.date,
            time : order.date,
            status : "active",
            paymentMethod : "pending",
            orderNumber : order.orderNumber
        }

        
       mutation.mutate({id : order._id, item_ids : all_ids, branch : order.branch, order : orderData})
    }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
            size={"icon"}
            variant={'outline'}
        >
           <SplitIcon className="text-green-800" />
        </Button>
      </DialogTrigger>
      <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>   
           
          </DialogDescription>
        </DialogHeader>
      <DialogContent className="sm:max-w-[1000px]">

        <div className="w-full h-[400px] overflow-auto mt-5 p-2 grid grid-cols-2 gap-5">

          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden w-full max-w-2xl flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-900 to-emerald-900 text-white p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">{order.table}</h2>
            </div>

            <div className="p-4 space-y-3">


                <div className="flex items-center justify-center gap-4">
                        <span className="text-sm font-medium text-gray-600">Grand Total: </span>
                        <span className="text-lg font-bold text-green-600">
                            ₱{((getTotalWithVat(firstOrder) - getTotaldiscount(firstOrder)) + (getTotalWithVat(firstOrder) * 0.10)).toFixed(2)}
                        </span>
                 </div>
       
                <div className="flex justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600">Sub Total: </span>
                        <span className="text-lg font-bold text-gray-600">
                            ₱{getTotalWithVat(firstOrder).toFixed(2)}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600">Service Fee: </span>
                        <span className="text-lg font-bold text-gray-600 ">
                            ₱{ (getTotalWithVat(firstOrder) * 0.10).toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600">Total Vat:</span>
                        <span className="text-lg font-bold text-gray-600 ">
                            ₱{getTotalVat(firstOrder).toFixed(2)}
                        </span>
                    </div>


                                

                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600">Discount Total:</span>
                        <span className="text-lg font-bold text-red-600">
                            ₱{getTotaldiscount(firstOrder).toFixed(2)}
                        </span>
                    </div>
                </div>
            
            </div>

            {/* Orders List */}
            <div className="px-4 pb-4 flex-1 flex flex-col">
             
              <div className=" overflow-y-auto max-h-[160px]">
                {firstOrder.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center bg-stone-100 rounded-md shadow p-2 mb-2" onClick={() => firstToSecond(item)}>
                    <div className="flex-1 pr-2">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-gray-800 flex-1">
                          {item.name}
                        </span>
                        <span className="text-gray-600 ml-2">
                          x{item.qty}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-600">
                        <span>
                          {item.discountType && item.discount > 0 ? (
                            <span className="text-red-600">
                              {item.discountType}: -₱{item.discount.toFixed(2)}
                            </span>
                          ) : (
                            <span>No discount</span>
                          )}
                        </span>
                        <span className="font-semibold text-gray-800">
                          ₱{item.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>



          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden w-full max-w-2xl flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-900 to-emerald-900 text-white p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">{order.table} (split) </h2>
            </div>

            <div className="p-4 space-y-3">


                <div className="flex items-center justify-center gap-4">
                        <span className="text-sm font-medium text-gray-600">Grand Total: </span>
                        <span className="text-lg font-bold text-green-600">
                            ₱{((getTotalWithVat(secondOrder) - getTotaldiscount(secondOrder)) + (getTotalWithVat(secondOrder) * 0.10)).toFixed(2)}
                        </span>
                 </div>
       
                <div className="flex justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600">Sub Total: </span>
                        <span className="text-lg font-bold text-gray-600">
                            ₱{getTotalWithVat(secondOrder).toFixed(2)}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600">Service Fee: </span>
                        <span className="text-lg font-bold text-gray-600 ">
                            ₱{ (getTotalWithVat(secondOrder) * 0.10).toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600">Total Vat:</span>
                        <span className="text-lg font-bold text-gray-600 ">
                            ₱{getTotalVat(secondOrder).toFixed(2)}
                        </span>
                    </div>


                                

                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600">Discount Total:</span>
                        <span className="text-lg font-bold text-red-600">
                            ₱{getTotaldiscount(secondOrder).toFixed(2)}
                        </span>
                    </div>
                </div>
            
            </div>

            {/* Orders List */}
            <div className="px-4 pb-4 flex-1 flex flex-col">
             
              <div className=" overflow-y-auto max-h-[160px]">
                {secondOrder.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center bg-stone-100 rounded-md shadow p-2 mb-2" onClick={() => secondToFirst(item)}>
                    <div className="flex-1 pr-2">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-gray-800 flex-1">
                          {item.name}
                        </span>
                        <span className="text-gray-600 ml-2">
                          x{item.qty}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-600">
                        <span>
                          {item.discountType && item.discount > 0 ? (
                            <span className="text-red-600">
                              {item.discountType}: -₱{item.discount.toFixed(2)}
                            </span>
                          ) : (
                            <span>No discount</span>
                          )}
                        </span>
                        <span className="font-semibold text-gray-800">
                          ₱{item.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>




        </div>
     
        <div className="w-full">
            <Button className="w-full" onClick={splitHandler}> Split </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}