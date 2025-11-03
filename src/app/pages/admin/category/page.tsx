"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileBarChart2, Search , LoaderCircle} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Value } from "@radix-ui/react-select";

export default function Page() {

   const [category, setCategory] = useState([ 
      { name: "Wireless Mouse", category: "Electronics", itemSold: 120, discount: "10%",  price : 100 ,totalSales: "₱48,000" },
      { name: "Gaming Keyboard", category: "Electronics", itemSold: 85, discount: "5%",  price : 100 ,totalSales: "₱42,500" },
      { name: "Office Chair", category: "Furniture", itemSold: 40, discount: "15%",  price : 100 ,totalSales: "₱80,000" },
      { name: "Water Bottle", category: "Accessories", itemSold: 200, discount: "0%",  price : 100 ,totalSales: "₱20,000" },
      { name: "Bluetooth Speaker", category: "Electronics", itemSold: 60, discount: "8%",  price : 100 ,totalSales: "₱54,000" },
     
    ]);

   const [isLoading, setIsloading] = useState(false)

   const [customDate, setCustomDate] = useState<{start : string | null, end : string | null}>({
    start : null,
    end : null
   })

   const [type, setType] = useState("today")
   const [top, setTop] = useState("sold")

   const fetchData = (value : string) => {
        setType(value)
   }

   const fetchCustomDate = () => {
        console.log(customDate)
   }

   const selectCustomDate = () => {
        setType("custom")
        setCategory([])
   }

   

   const changeRanking = (value : string) => {
        setTop(value)
   }




  return (
    <div className="flex-1 p-6 bg-stone-50 min-h-screen">

        <div className="flex justify-between mb-3">
            <div className="flex gap-2 ">
                <Button variant="outline"  className={`${type === "overAll" ? "bg-green-700 text-white hover:text-white hover:bg-green-600" : ""}`} onClick={() =>  fetchData("overAll")  }>OverAll</Button>
                <Button variant="outline"  className={`${type === "today" ? "bg-green-700 text-white hover:text-white hover:bg-green-600" : ""}`} onClick={() =>  fetchData("today")  }>Today</Button>
                <Button variant="outline"  className={`${type === "week" ? "bg-green-700 text-white hover:text-white hover:bg-green-600" : ""}`} onClick={() =>  fetchData("week")  }>This Week</Button>
                <Button variant="outline"  className={`${type === "month" ? "bg-green-700 text-white hover:text-white hover:bg-green-600" : ""}`} onClick={() => fetchData("month") }>This Month</Button>
                <Button variant="outline"  className={`${type === "custom" ? "bg-green-700 text-white hover:text-white hover:bg-green-600" : ""}`} onClick={() =>  selectCustomDate()  }>Custom Date</Button>
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
                <Button variant="outline"  className={`${top === "sold" ? "bg-green-700 text-white hover:text-white hover:bg-green-600" : ""}`} onClick={() => changeRanking("sold") }>Top Sold</Button>
                <Button variant="outline"  className={`${top === "sales" ? "bg-green-700 text-white hover:text-white hover:bg-green-600" : ""}`} onClick={() =>  changeRanking("sales")  }>Top Sales</Button>
            </div>
        </div>

       

      <Card className="shadow-md rounded-2xl h-[550px] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <FileBarChart2 className="w-6 h-6 text-green-600" />
            Product Category Report
          </CardTitle>
        </CardHeader>
       <CardContent>
        <div className="overflow-x-auto">
            {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-gray-500 text-sm">
                <LoaderCircle className="w-5 h-5 animate-spin text-green-600" />
                <span>Loading products...</span>
            </div>
            ) : category.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">No category found</div>
            ) : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="font-semibold">Top</TableHead>
                    <TableHead className="font-semibold">Product Category</TableHead>
                    <TableHead className="font-semibold">Item Sold</TableHead>
                    <TableHead className="font-semibold">Discount</TableHead>
                    <TableHead className="font-semibold">Total Sales</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {category.map((category, index) => (
                    <TableRow key={index} className="hover:bg-gray-100">
                    <TableCell className="font-bold text-stone-600">#{index + 1}</TableCell>
                    <TableCell>{category.category}</TableCell>
                    <TableCell>{category.itemSold}</TableCell>
                    <TableCell>{category.discount}</TableCell>
                    <TableCell>{category.totalSales}</TableCell>
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
