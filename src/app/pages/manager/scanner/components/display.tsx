"use client"
import { useQuery , useMutation} from "@tanstack/react-query"
import axiosInstance from "@/app/utils/axios"
import { useState, useEffect } from "react"
import { getRequestInterface } from "@/app/types/request.type"
import { X } from "lucide-react"
import { errorAlert, successAlert } from "@/app/utils/alert"
import { Button } from "@/components/ui/button"
import useUserStore from "@/app/store/user.store"


export default function Display({setShowModal, request} : {setShowModal : React.Dispatch<React.SetStateAction<boolean>>, request : getRequestInterface}){

    const {user} = useUserStore()


    const mutation = useMutation({
        mutationFn: (data : { id: string }) =>
          axiosInstance.patch(`/request/completed`, data ),
        onSuccess: (response) => {
            successAlert("Ingredient Added To Inventory")
            setShowModal(false)
        },
        onError : () => {
            errorAlert("error")
        }
      });

      const addToInventory = () => {
        mutation.mutate({ id : request._id})
      }


    return(
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 bg-gray-900/60">
            (request && (
                <div className=" bg-stone-50 shadow-lg  rounded-lg max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
                        <button
                            onClick={() => setShowModal(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        </div>
                        
                        <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                            <span className="text-gray-500">Branch:</span>
                            <p className="font-medium">{request?.branch}</p>
                            </div>
                            <div>
                            <span className="text-gray-500">Manager:</span>
                            <p className="font-medium">{request?.manager}</p>
                            </div>
                            <div>
                            <span className="text-gray-500">Date:</span>
                            <p className="font-medium">{request?.date}</p>
                            </div>
                            <div>
                            <span className="text-gray-500">Total:</span> 
                            <span className="text-green-500 font-bold ms-2">   ₱{request?.total.toFixed(2)} </span>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                            <div className="space-y-2">
                            {request?.request.map((item) => (
                                <div key={item._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="font-medium">{item.name}</span>
                                <span className="text-sm text-gray-600">Quantity: {item.quantity}</span>
                                </div>
                            ))}
                            </div>
                        </div>

                      
                        <div>
                            <Button onClick={addToInventory} className="w-full" disabled={request.status == "completed" || request.branch != user?.branch}> add To Inventory </Button>
                        </div>

                        </div>
                    </div>
                </div>
            ))
        </div>
    )
}