"use client";
import UnauthorizedPage from '@/components/ui/unauthorizedPage';
import { CashierSideBar } from "@/components/ui/cashierSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getOrdersInterface } from "@/app/types/orders.type";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axiosInstance from "@/app/utils/axios";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { RefillButton } from "./components/refillButton";
import { print2ndReceipt, print3rdReceipt } from "@/app/utils/receiptConsole";
import { PaymentButton } from "./components/paymentButton";
import { RotateCw } from 'lucide-react';
import { confirmAlert } from '@/app/utils/alert';
import { orderInterface } from '@/app/types/orders.type';
import { successAlert, errorAlert } from '@/app/utils/alert';
import useUserStore from '@/app/store/user.store';
import useActiveTableStore from '@/app/store/activeTable.store';
import { MoveItButton } from './components/moveTable';


export default function Home() {

    const {removeTable} = useActiveTableStore()
    
    const { user } = useUserStore()
    const [orders, setOrders] = useState<getOrdersInterface[]>([]);

    const { data } = useQuery({
        queryKey: ["order"],
        queryFn: () => axiosInstance.get("/order/active")
    });

    useEffect(() => {
        if(data?.data) setOrders(data?.data);
    }, [data]);

    /*
    const mutation = useMutation({
        mutationFn: (data: { branch : string,  order_id : string,  item_id : string,}) => axiosInstance.patch("/order/refund", data),
        onSuccess: (response) => {
          successAlert("success")
          setOrders(response.data.orders)
          if(response.data.table != "none"){
            removeTable(response.data.table)
          }
        },
        onError: (err) => {
          errorAlert("error")
        },
      }) 

    const refundHandler = (item : orderInterface, table : string, order_id : string) => {
        if(!user) return
        confirmAlert(`you want to refund ${item.qty}x ${item.name} from ${table}`, "refund", () => {
            mutation.mutate({branch : user.branch, order_id : order_id, item_id : item.item_id})
        })
    } */
      

    return (
                <div className="h-dvh w-full flex flex-col">
                    <div className="h-[10%] w-full bg-gradient-to-r from-green-900 to-emerald-900  flex items-center justify-center     px-6">
                        <h1 className="text-2xl font-bold text-stone-100 text-center"> Active Tables </h1>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 bg-stone-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {orders.map((order, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                                    {/* Header */}
                                    <div className="bg-gradient-to-r from-green-900 to-emerald-900  text-white p-4 flex items-center justify-between">
                                        <h2 className="text-xl font-bold">{order.table}</h2>
                                        <MoveItButton setOrders={setOrders} order={order}/>
                                        <RefillButton table={order.table}  orders={order.orders}/>
                                    </div>

                                    
                                    {/* Order Info */}
                                    <div className="p-4 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">Order Type:</span>
                                            <span className="text-sm font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                                                {order.orderType}
                                            </span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">Grand Total:</span>
                                            <span className="text-lg font-bold text-green-600">
                                                ₱{order.grandTotal.toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">Service Fee:</span>
                                            <span className="text-lg font-bold text-gray-600 ">
                                                ₱{order.serviceFee.toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">Total Vat:</span>
                                            <span className="text-lg font-bold text-gray-600 ">
                                                ₱{order.vat.toFixed(2)}
                                            </span>
                                        </div>


                              

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">Discount Total:</span>
                                            <span className="text-lg font-bold text-red-600">
                                                ₱{order.totalDiscount.toFixed(2)}
                                            </span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">Cashier:</span>
                                            <span className="text-sm font-semibold text-gray-800">
                                                {order.cashier}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">Date:</span>
                                            <span className="text-sm font-semibold text-gray-800">
                                                {order.time}  {order.date} 
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Orders List */}
                                    <div className="px-4 pb-4">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-2 border-b pb-1">
                                            Order Items ({order.orders.length})
                                        </h3>
                                        <div className="space-y-2 h-48 overflow-y-auto">
                                            {order.orders.map((item, itemIndex) => {
                           
                                                return (
                                                    <div key={itemIndex} className='flex bg-stone-100 rounded-md shadow'>

                                                        <div  className="  p-3  text-sm w-[100%] ">
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
                                                    
                                                );
                                            })}
                                        </div>
                                    </div>
                                    
                                    {/* Footer */}
                                    <div className="p-4 bg-gradient-to-r from-green-900 to-emerald-900  border-t flex gap-2">
                                        <Button 
                                            variant={"outline"}
                                            onClick={() => print2ndReceipt(order)}
                                            className="w-[30%]   font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                                        >
                                            Bill Out 
                                        </Button>
                                       <PaymentButton order={order} setOrders={setOrders} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {orders.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-lg">No orders found</div>
                                <div className="text-gray-500 text-sm mt-2">Orders will appear here once they are placed</div>
                            </div>
                        )}
                    </div>
                </div>
    );
}