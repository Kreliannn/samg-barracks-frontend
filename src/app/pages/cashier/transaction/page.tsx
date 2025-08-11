"use client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  import { useState, useEffect } from "react";
  import { ordersInterface, getOrdersInterface } from "@/app/types/orders.type";
  import { useQuery } from "@tanstack/react-query";
  import axiosInstance from "@/app/utils/axios";
  import { Button } from "@/components/ui/button";
  

export default function Home() {

    const [orders, setOrders] = useState<getOrdersInterface[]>([]);

    const { data } = useQuery({
        queryKey: ["receipt"],
        queryFn: () => axiosInstance.get("/order/completed")
    });

    useEffect(() => {
        if(data?.data) setOrders(data?.data.reverse());
    }, [data]);


    const printXreading = () => {
      const sales = {
        cash : 0,
        debitCard : 0,
        gcash : 0,
        payMaya : 0,
        grabPayment : 0,
        chequePayment : 0,
        totalSales : 0
      }
      orders.forEach((order) => {
        switch(order.paymentMethod){
          case "cash": sales.cash += order.grandTotal; break;
          case "debitCard": sales.debitCard += order.grandTotal; break;
          case "gcash": sales.gcash += order.grandTotal; break;
          case "payMaya": sales.payMaya += order.grandTotal; break;
          case "grabPayment": sales.grabPayment += order.grandTotal; break;
          case "chequePayment": sales.chequePayment += order.grandTotal; break;
        }
        sales.totalSales += order.grandTotal
      })

      console.log(sales)
    }



  return (
    <div className="min-h-screen bg-stone-100 ">

      <div className="h-18 fixed    w-full bg-gradient-to-r from-green-900 to-emerald-900  flex items-center justify-center     px-6">
          <h1 className="text-2xl font-bold text-stone-100 text-center"> History  </h1>
      </div>

      <br />
      <br />
      <br />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-stone-200 bg-white flex ">
            <div className="w-[80%]">
              <h1 className="text-xl font-semibold text-stone-900">Transaction History</h1>
              <p className="text-sm text-stone-600 mt-1">View detailed records of all transactions</p>
            </div>
            <div className="w-[20%] flex justify-center items-center">
              <Button onClick={printXreading}> X Reading </Button>
            </div>
          </div>

          {/* Table Header */}
          <div className="flex  justify-between items-center gap-4 px-6 py-3 bg-stone-50 border-b border-stone-200 text-xs font-medium text-stone-500 uppercase tracking-wider">
            <div>Date</div>
            <div>Time</div>
            <div>Table</div>
            <div>Cashier</div>
            <div>Payment </div>
            <div>Type</div>
            <div>Total</div>
            <div></div>
          </div>

          {/* Transactions */}
          <Accordion type="single" collapsible className="w-full">
            {orders.map((transaction) => (
              <AccordionItem key={transaction._id} value={transaction._id} className="border-b border-stone-100 last:border-b-0">
                <AccordionTrigger className="flex gap-4 px-6 py-4 text-sm font-medium text-stone-900  transition-colors duration-150">
                  <div className="text-left">
                    <div className="font-medium">{transaction.date}</div>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{transaction.time ||  "10:00 AM"}</div>
                  </div>
                  <div className="text-left">
                    <span className="inline-flex shadow-sm items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                      {transaction.table}
                    </span>
                  </div>
                  <div className="text-left ">
                    <div className="font-medium">{transaction.cashier}</div>
                  </div>
                  <div className="text-left">
                    <span className="">
                      {transaction.paymentMethod}
                    </span>
                  </div>
                  <div className="text-left">
                    
                    <span className="inline-flex shadow-sm items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-stone-100 text-stone-800">
                        <div className="font-medium">{transaction.orderType}</div>
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="text-lg font-semibold text-green-500">
                      ₱{transaction.grandTotal.toFixed(2)}
                    </span>
                  </div>
                  
                </AccordionTrigger>
                
                <AccordionContent className="px-6  " >
                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 mt-4">
                    {/* Items Ordered */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-stone-900 border-b border-stone-200 pb-2">Items Ordered</h3>
                      <div className="space-y-2">
                        {transaction.orders.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 px-3 rounded-lg bg-stone-50">
                            <div className="flex-1">
                              <span className="text-sm font-medium text-stone-900">{item.name}</span>
                              <span className="text-xs text-stone-500 ml-2">× {item.qty}</span>
                            </div>
                            <span className="text-sm font-medium text-green-500">₱{((item.price * item.qty) - item.discount).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="px-6">
                      <h3 className="text-sm font-medium text-stone-900 border-b border-stone-200 pb-2">Payment Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between py-2 px-3 rounded-lg bg-stone-50 mt-2">
                          <span className="text-sm text-stone-600">Subtotal</span>
                          <span className="text-sm font-medium text-stone-900">₱{transaction.subTotal.toFixed(2)}</span>
                        </div>
                        {transaction.totalDiscount > 0 && (
                          <div className="flex justify-between py-2 px-3 rounded-lg bg-stone-50">
                            <span className="text-sm text-green-600">Discount</span>
                            <span className="text-sm font-medium text-green-600">-₱{transaction.totalDiscount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between py-2 px-3 rounded-lg bg-stone-50">
                          <span className="text-sm text-stone-600">Service Fee</span>
                          <span className="text-sm font-medium text-stone-900">₱{transaction.serviceFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 rounded-lg bg-stone-50">
                          <span className="text-sm text-stone-600">VAT (12%)</span>
                          <span className="text-sm font-medium text-stone-900">₱{transaction.vat.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-stone-200 pt-2">
                          <div className="flex justify-between py-2 px-3 rounded-lg bg-emerald-50">
                            <span className="text-sm font-medium text-emerald-900">Total</span>
                            <span className="text-lg font-bold text-emerald-900">₱{transaction.grandTotal.toFixed(2)}</span>
                          </div>
                        </div>
                    
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}