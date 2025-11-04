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

interface dataInterface {
      name : string,
      productId : string,
      category : string,
      sold : number,
      sales : number,
      discount : number
}



export default function Page() {

    const [products, setProducts] = useState<dataInterface[]>([]);

    const [reportType, setReportType] = useState("product")
    const [type, setType] = useState("overAll")
    const [top, setTop] = useState("sold")

    const [header, setHeader] = useState("Over All")

    const { data } = useQuery({
        queryKey: ["productReport", type, reportType],
        queryFn: () => axiosInstance.get(`/menu/productReport/${reportType}/${type}`),
    });

    useEffect(() => {
        if (data?.data && type != "custom"){
            const fetchedData : dataInterface[] = data.data
            setProducts(fetchedData.sort((a, b) => b.sold - a.sold));
            setIsloading(false)
            changeDisplayHeader()
        } 
    }, [data]);

   const mutation = useMutation({
    mutationFn: async (customDate : {start : string, end  :string}) => axiosInstance.post("/menu/productReport/", {customDate, reportType}),
    onSuccess: (response) => {
      const fetchedData : dataInterface[]  = response.data
      setProducts(type == "sold" ? fetchedData.sort((a, b) => b.sold - a.sold) : fetchedData.sort((a, b) => b.sales - a.sales) )
      setIsloading(false)
    },
    onError : (err : { response : { data : string }}) => {
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
        setProducts([])
        setHeader("")
   }

   const changeRanking = (value : string) => {
        setTop(value)
        switch(value){
            case "sold": setProducts((prev) => prev.sort((a, b) => b.sold - a.sold)); break;
            case "sales": setProducts((prev) => prev.sort((a, b) => b.sales - a.sales)); break;
        }
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

            <div className="flex gap-2 ">
                <Button variant="outline"  className={`${reportType === "product" ? "bg-green-700 text-white hover:text-white hover:bg-green-600" : ""}`} onClick={() => setReportType("product") }>Product</Button>
                <Button variant="outline"  className={`${reportType === "category" ? "bg-green-700 text-white hover:text-white hover:bg-green-600" : ""}`} onClick={() =>  setReportType("category")  }>Category</Button>
            </div>
        </div>

       

      <Card className="shadow-md rounded-2xl h-[550px] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-semibold  gap-2">
            <div className="flex gap-2">
                <FileBarChart2 className="w-6 h-6 text-green-600" />
                Product Report
            </div>
            <h1 className="text-sm text-stone-600"> - {header} </h1>   
          </CardTitle>

           
           <div className="flex gap-2 ">
                <Button variant="outline"  className={`${top === "sold" ? "bg-green-700 text-white hover:text-white hover:bg-green-600" : ""}`} onClick={() => changeRanking("sold") }>Top Sold</Button>
                <Button variant="outline"  className={`${top === "sales" ? "bg-green-700 text-white hover:text-white hover:bg-green-600" : ""}`} onClick={() =>  changeRanking("sales")  }>Top Sales</Button>
                <Button variant="outline" className="ms-5"  onClick={ handleDownloadPDF  }> <Download /> Download</Button>
            </div>

        </CardHeader>
       <CardContent>
        <div className="overflow-x-auto">
            {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-gray-500 text-sm">
                <LoaderCircle className="w-5 h-5 animate-spin text-green-600" />
                <span>Loading products...</span>
            </div>
            ) : products.length === 0 ? (
             <div className="text-center py-10 text-gray-500 text-sm">No products found</div>
            ) : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="font-semibold">Top</TableHead>
                    <TableHead className={`font-semibold ${reportType != "product" && "hidden"}`}>Name</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Item Sold</TableHead>
                    <TableHead className="font-semibold">Discount</TableHead>
                    <TableHead className="font-semibold">Total Sales</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {products.map((product, index) => (
                    <TableRow key={index} className="hover:bg-gray-100">
                    <TableCell className="font-bold text-stone-600">#{index + 1}</TableCell>
                    <TableCell className={`${reportType != "product" && "hidden"}`}>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.sold}  </TableCell>
                    <TableCell>₱{product.discount.toLocaleString()}</TableCell>
                    <TableCell>₱{product.sales.toLocaleString()}</TableCell>
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
