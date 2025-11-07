"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileBarChart2, Search , LoaderCircle, Download} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Value } from "@radix-ui/react-select";
import axiosInstance from "@/app/utils/axios";
import { errorAlert } from "@/app/utils/alert";
import { getTodayHeader, getThisWeekHeader, getThisMonthHeader, convertYmdToMdy} from "@/app/utils/customFunction";
import { getOrdersInterface } from "@/app/types/orders.type";
import { plus1Day, isTime1To3am } from "@/app/utils/customFunction";


interface dataInterface {
      name : string,
      productId : string,
      category : string,
      sold : number,
      sales : number,
      discount : number
}



export default function Page() {

    const [transactions, setTransactions] = useState<getOrdersInterface[]>([]);

    const [type, setType] = useState("overAll")
    const [top, setTop] = useState("sold")

    const [header, setHeader] = useState("Over All")

    const { data } = useQuery({
        queryKey: ["transactionsReport", type],
        queryFn: () => axiosInstance.get(`/order/report/${type}`),
    });

    useEffect(() => {
        if (data?.data && type != "custom"){
            setTransactions(data.data);
            setIsloading(false)
            changeDisplayHeader()
        } 
    }, [data]);

   const mutation = useMutation({
    mutationFn: async (customDate : {start : string, end  :string}) => axiosInstance.post("/order/report", {customDate}),
    onSuccess: (response) => {
      setTransactions(response.data) 
      setIsloading(false)
    },
    onError : (err : { response : { data : string }}) => {
        console.log(err.response.data)
        errorAlert(err.response.data)      
    }
  });


   const [isLoading, setIsloading] = useState(true)

   const [customDate, setCustomDate] = useState<{start : string | null, end : string | null}>({
    start : null,
    end : null
   })

    const fetchData = (value : string) => {
        if(type == value) return
        setIsloading(true)
        setType(value)
   } 

   const fetchCustomDate = () => {
        if(!customDate.start || !customDate.end) return errorAlert("empty date")
        if(customDate.start > customDate.end) return errorAlert("start is greater than end date")
        setIsloading(true)
        changeDisplayHeader()
        mutation.mutate({
            start: customDate.start,
            end: customDate.end,
        } as { start: string; end: string });
   }

   const selectCustomDate = () => {
        setType("custom")
        setTransactions([])
        setHeader("")
   }


   const changeDisplayHeader = () => {
        switch(type)
        {
            case "overAll": setHeader("Over All");  break;
            case "today": setHeader(getTodayHeader());  break;
            case "week": setHeader(getThisWeekHeader());  break;
            case "month": setHeader(getThisMonthHeader());  break;
            case "custom": setHeader(`from ${convertYmdToMdy(customDate.start)} to ${convertYmdToMdy(customDate.end)}`);  break;
        }
   }


    const handleDownloadPDF = () => {
        const buttons = document.querySelectorAll("button");
        buttons.forEach(btn => (btn.style.display = "none"));

        window.print(); 

        setTimeout(() => {
            buttons.forEach(btn => (btn.style.display = "inline-flex"));
        }, 100); 
    };



  return (
    <div className="flex-1 p-6 bg-stone-50 min-h-screen">

        <div className="flex justify-between mb-3">
            <div className="flex gap-2 ">
                <Button variant="outline"  className={`${type === "overAll" ? "bg-green-700 text-white hover:text-white hover:bg-green-600" : ""}`} onClick={() =>  fetchData("overAll")  }>OverAll</Button>
                <Button variant="outline"  className={`${type === "today" ? "bg-green-700 text-white hover:text-white hover:bg-green-600" : ""}`} onClick={() =>  fetchData("today")  }>Today</Button>
                <Button variant="outline"  className={`${type === "week" ? "bg-green-700 text-white hover:text-white hover:bg-green-600" : ""}`} onClick={() =>  fetchData("week")  }>Week</Button>
                <Button variant="outline"  className={`${type === "month" ? "bg-green-700 text-white hover:text-white hover:bg-green-600" : ""}`} onClick={() => fetchData("month") }>Month</Button>
                <Button variant="outline"  className={`${type === "custom" ? "bg-green-700 text-white hover:text-white hover:bg-green-600" : ""}`} onClick={() =>  selectCustomDate()  }>Custom</Button>
            </div>


            <div className={`flex items-center gap-3`}>
               
            {type == "custom" && (
                <>
                    <div className="flex items-center gap-2">
                        <h1 className="text-sm text-gray-600">Start</h1>
                        <input
                            type="date"
                            className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {
                                const selectedDate = e.target.value; 
                                setCustomDate((prev) => ({...prev, start :  selectedDate}))
                            }}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <h1 className="text-sm text-gray-600">End</h1>
                        <input
                            type="date"
                            className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {
                                const selectedDate = e.target.value; 
                                setCustomDate((prev) => ({...prev, end :  selectedDate}))
                            }}
                        />
                    </div>

                    <Button variant={"outline"} onClick={fetchCustomDate}><Search /></Button>
                </>
            )}
                
            </div>

        
        </div>

       

      <Card className="shadow-md rounded-2xl h-[550px] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-semibold  gap-2">
            <div className="flex gap-2">
                <FileBarChart2 className="w-6 h-6 text-green-600" />
                Transaction Report
            </div>
            <h1 className="text-sm text-stone-600"> - {header} </h1>   
          </CardTitle>

           
           <div className="flex gap-2 ">
                <Button variant="outline" className="ms-5"  onClick={ handleDownloadPDF  }> <Download /> Download</Button>
            </div>

        </CardHeader>
       <CardContent>
        <div className="overflow-x-auto">
            {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-gray-500 text-sm">
                <LoaderCircle className="w-5 h-5 animate-spin text-green-600" />
                <span>Loading transactions...</span>
            </div>
            ) : transactions.length === 0 ? (
             <div className="text-center py-10 text-gray-500 text-sm">No transactions found</div>
            ) : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">time</TableHead>
                    <TableHead className="font-semibold">Employee</TableHead>
                    <TableHead className="font-semibold">subTotal</TableHead>
                    <TableHead className="font-semibold">Discount</TableHead>
                    <TableHead className="font-semibold">vat</TableHead>
                    <TableHead className="font-semibold">serviceFee</TableHead>
                    <TableHead className="font-semibold">grandTotal</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {transactions.map((transaction, index) => (
                    <TableRow key={index} className="hover:bg-gray-100">
                        <TableCell className="font-bold text-stone-600">  { (isTime1To3am(transaction.time) ? plus1Day(transaction.date) : transaction.date) } </TableCell>
                        <TableCell>{transaction.time}</TableCell>
                        <TableCell>{transaction.cashier}</TableCell>
                        <TableCell>{transaction.subTotal}  </TableCell>
                        <TableCell>₱{transaction.totalDiscount.toLocaleString()}</TableCell>
                        <TableCell>₱{transaction.vat.toLocaleString()}</TableCell>
                        <TableCell>₱{transaction.serviceFee.toLocaleString()}</TableCell>
                        <TableCell>₱{transaction.grandTotal.toLocaleString()}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            )}
        </div>
        </CardContent>

      </Card>
    </div>
  );
}
