"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/app/utils/axios";
import { errorAlert } from "@/app/utils/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { AddWaste } from "./components/addWaste";
import { getWasteInterface } from "@/app/types/waste.type";
import { convertYmdToMdy } from "@/app/utils/customFunction";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WasteData {
  item: string;
  qty: number;
  branch: string;
  date: string;
  cost: number;
  reason: string;
}

const getTotalCost = (waste : WasteData[]) => {
    let total = 0
    waste.forEach((e) => {
        total += e.cost
    })
    return total
}

export default function Page() {
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  const [month, setMonth] = useState("year")


    const [wastes, setWastes] = useState<getWasteInterface[]>([])

    const { data, refetch } = useQuery({
        queryKey: ["waste", month],
        queryFn: () => axiosInstance.get("/waste/" + month)
    })

    useEffect(() => {
        if(data?.data) setWastes(data?.data)
    }, [data])


  const handleViewReason = (reason: string) => {
    setSelectedReason(reason);
    setOpen(true);
  };

  return (
    <div className="p-5">

        <div className="flex justify-between mb-2">

            <div className="w-[105px]">
                <Select onValueChange={(value) => setMonth(value)} value={month}>
                    <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Date" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="year">This Year</SelectItem>
                        <SelectItem value="1">January</SelectItem>
                        <SelectItem value="2">February</SelectItem>
                        <SelectItem value="3">March</SelectItem>
                        <SelectItem value="4">April</SelectItem>
                        <SelectItem value="5">May</SelectItem>
                        <SelectItem value="6">June</SelectItem>
                        <SelectItem value="7">July</SelectItem>
                        <SelectItem value="8">August</SelectItem>
                        <SelectItem value="9">September</SelectItem>
                        <SelectItem value="10">October</SelectItem>
                        <SelectItem value="11">November</SelectItem>
                        <SelectItem value="12">December</SelectItem>
                    </SelectContent>
                </Select>
            </div>

       


            <AddWaste refetch={refetch} />
        </div>


        <Card className="shadow-sm">
            <CardHeader className="flex justify-between">
                <CardTitle className="text-lg font-semibold">Waste Records</CardTitle>
                <div >
                    <h1 className="text-sm font-bold text-stone-700"> Cost :  <span className="text-2xl font-bold text-red-500"> ₱ {getTotalCost(wastes).toLocaleString()} </span></h1>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-end">Reason</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {wastes.length > 0 ? (
                        wastes.map((waste, i) => (
                        <TableRow key={i}>
                            <TableCell>{waste.item}</TableCell>
                            <TableCell>{waste.qty}</TableCell>
                            <TableCell>{waste.price}</TableCell>
                            <TableCell>₱{waste.cost.toLocaleString()}</TableCell>
                            <TableCell>{waste.branch}</TableCell>
                            <TableCell>{convertYmdToMdy( waste.date)}</TableCell>
                            <TableCell className="flex justify-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewReason(waste.reason)}
                                    className="flex items-center gap-1"
                                >
                                    <Eye className="w-4 h-4" /> View
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                            No waste records found
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </div>
            </CardContent>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reason</DialogTitle>
                </DialogHeader>
                <p className="text-gray-700">{selectedReason}</p>
                </DialogContent>
            </Dialog>
        </Card>
    </div>
    
  );
}
