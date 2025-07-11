"use client";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/app/utils/axios";
import { getIngredientsInterface } from "@/app/types/ingredient.type";
import { successAlert, errorAlert } from "@/app/utils/alert";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { requestInterface } from "@/app/types/request.type";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
import useUserStore from "@/app/store/user.store";
import { confirmAlert } from "@/app/utils/alert";
import { getRequestInterface } from "@/app/types/request.type";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CustomBadge } from "@/components/ui/customBadge";


export default function OrderRequest({request} : {request : getRequestInterface[]}) {

    const filteredData = request.filter((item)=> (item.status == "pending" || item.status == "to ship"))


  return (
    <div className="h-full w-full bg-stone-100">
        <div className="h-[15%] flex justify-center items-center border-b border-gray-300">
            <h1 className="text-2xl font-bold text-gray-800"> Branch Order Request </h1>
        </div>

        <div className="h-[80%] overflow-auto   ">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Request By</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right"> View orders </TableHead>
                        <TableHead  className="text-right"> Action </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredData.map((item) => (
                        <TableRow key={item._id}>
                            <TableCell className="font-medium">{item.date}</TableCell>
                            <TableCell className="font-medium">krelian quimson</TableCell>
                            <TableCell className="font-medium">{item.request.length}</TableCell>
                            <TableCell className="font-medium text-green-500">{item.total}</TableCell>
                            <TableCell className="font-medium text-center">  <CustomBadge status={item.status} />   </TableCell>
                            <TableCell className="font-medium text-right">
                                <Button size={"icon"} className="bg-yellow-500 hover:bg-yellow-600">  <Eye /> </Button>
                            </TableCell>
                            <TableCell className="font-medium text-right">
                                <Button className="bg-green-500 hover:bg-green-600"> Received </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

     
    </div>
  );
}




