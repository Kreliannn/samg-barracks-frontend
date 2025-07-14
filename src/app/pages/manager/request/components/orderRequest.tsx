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
import { Eye, X, Calendar, User, Building2, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CustomBadge } from "@/components/ui/customBadge";

export default function OrderRequest({ request , setRequest}: { request: getRequestInterface[] , setRequest :  React.Dispatch<React.SetStateAction<getRequestInterface[]>>}) {
    const [selectedRequest, setSelectedRequest] = useState<getRequestInterface | null>(null);
    const [showModal, setShowModal] = useState(false);

    const filteredData = request.filter((item) => (item.status == "pending" || item.status == "to ship"));

    filteredData.reverse()

    const handleViewOrder = (order: getRequestInterface) => {
        setSelectedRequest(order);
        setShowModal(true);
    };


    const mutation = useMutation({
        mutationFn: (data : { id: string }) =>
          axiosInstance.patch(`/request/completed`, data ),
        onSuccess: (response) => {
            successAlert("Status Changed")
            setRequest(response.data)
        },
        onError : () => {
            errorAlert("error")
        }
      });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="h-full w-full bg-stone-100">
            <div className="h-[15%] flex justify-center items-center border-b border-gray-300">
                <h1 className="text-2xl font-bold text-gray-800"> Branch Order Request </h1>
            </div>

            <div className="h-[80%] overflow-auto max-h-[300px]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Request By</TableHead>
                            <TableHead>Orders</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right"> View orders </TableHead>
                            <TableHead className="text-right"> Action </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell className="font-medium">{item.date}</TableCell>
                                <TableCell className="font-medium">{item.manager}</TableCell>
                                <TableCell className="font-medium">{item.request.length}</TableCell>
                                <TableCell className="font-medium text-green-500">₱{item.total}</TableCell>
                                <TableCell className="font-medium text-center">
                                    <CustomBadge status={item.status} />
                                </TableCell>
                                <TableCell className="font-medium text-right">
                                    <Button
                                        onClick={() => handleViewOrder(item)}
                                        className="bg-yellow-500 hover:bg-yellow-600 shadow"
                                    >
                                        <Eye className="w-4 h-4 mr-1" /> View
                                    </Button>
                                </TableCell>
                                <TableCell className="font-medium text-right">
                                    <Button onClick={() => mutation.mutate({ id : item._id})} className="bg-green-500 hover:bg-green-600 shadow" disabled={item.status == "pending"}> Received </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Modal for viewing order details */}
            {showModal && selectedRequest && (
                <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-stone-50 shadow-lg rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="p-6">
                            {/* Modal Header */}
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Order Details</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600 p-1"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Order Information */}
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Building2 className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <span className="text-sm text-gray-500">Branch:</span>
                                            <p className="font-medium text-gray-900">{selectedRequest.branch}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <User className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <span className="text-sm text-gray-500">Manager:</span>
                                            <p className="font-medium text-gray-900">{selectedRequest.manager}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <span className="text-sm text-gray-500">Date:</span>
                                            <p className="font-medium text-gray-900">{formatDate(selectedRequest.date)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        
                                        <div>
                                            <span className="text-sm text-gray-500">Total:</span>
                                            <p className="font-medium text-green-600">₱{selectedRequest.total}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="mb-6">
                                <span className="text-sm text-gray-500">Status:</span>
                                <div className="mt-1">
                                    <CustomBadge status={selectedRequest.status} />
                                </div>
                            </div>

                            {/* Items Table */}
                            <div>
                                <h4 className="font-medium text-gray-900 mb-4">Ordered Items:</h4>
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Item Name</TableHead>
                                                <TableHead className="text-center">Quantity</TableHead>
                                                <TableHead className="text-right">Price</TableHead>
                                                <TableHead className="text-right">Subtotal</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedRequest.request.map((item) => (
                                                <TableRow key={item._id}>
                                                    <TableCell className="font-medium">{item.name}</TableCell>
                                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                                    <TableCell className="text-right">₱{item.price.toFixed(2)}</TableCell>
                                                    <TableCell className="text-right font-medium">
                                                        ₱{(item.quantity * item.price).toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                
                                {/* Total */}
                                <div className="mt-4 flex justify-end">
                                    <div className="bg-gray-50 px-4 py-2 rounded-lg">
                                        <span className="text-sm text-gray-500">Total Amount: </span>
                                        <span className="font-bold text-lg text-green-600">₱{selectedRequest.total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



