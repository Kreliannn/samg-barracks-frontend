"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/app/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { shiftInterface } from "@/app/types/change.type";


export default function Home() {

  const [shift, setShift] = useState<shiftInterface[]>([]);

  const { data } = useQuery({
    queryKey: ["shift"],
    queryFn: () => axiosInstance.get("/branch/shift")
  })    

  useEffect(() => {
      if(data?.data) setShift(data?.data)
  }, [data])





  return (
    <div className="p-6 space-y-4">
      <Card className="shadow-md rounded-2xl">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-semibold">Recent shift</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Vat</TableHead>
                <TableHead>ServiceFee</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Sales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shift.map((a, index) => (
                <TableRow key={index}>
                  <TableCell>{a.date}</TableCell>
                  <TableCell>{a.start}</TableCell>
                  <TableCell>{a.end}</TableCell>
                  <TableCell>₱{a.change}</TableCell>
                  <TableCell>₱{a.discount.toLocaleString()}</TableCell>
                  <TableCell>₱{a.vat.toLocaleString()}</TableCell>
                  <TableCell>₱{a.serviceFee.toLocaleString()}</TableCell>
                  <TableCell>{a.transaction}</TableCell>
                  <TableCell>₱{a.sales.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {shift.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No shift found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
