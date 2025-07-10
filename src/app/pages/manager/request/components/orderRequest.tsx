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



export default function OrderRequest({request} : {request : getRequestInterface[]}) {

    const filteredData = request.filter((item)=> (item.status == "pending" || item.status == "to ship"))


  return (
    <div className="h-full w-full bg-stone-100">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead >Status</TableHead>
                    <TableHead > View orders </TableHead>
                    <TableHead > Action </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredData.map((item) => (
                    <TableRow key={item._id}>
                        <TableCell className="font-medium">{item.date}</TableCell>
                        <TableCell className="font-medium">{item.request.length}</TableCell>
                        <TableCell className="font-medium">{item.total}</TableCell>
                        <TableCell className="font-medium">{item.status}</TableCell>
                        <TableCell className="font-medium">
                            <Button> view </Button>
                        </TableCell>
                        <TableCell className="font-medium">
                            <Button> Received </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
}