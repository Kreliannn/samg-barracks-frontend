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

interface SelectedIngredient {
  _id: string;
  name: string;
  quantity: number;
  price: number;
}



export default function RequestItem({setRequest} : {setRequest : React.Dispatch<React.SetStateAction<getRequestInterface[]>>}) {

    const [ingredients, setIngredients] = useState<getIngredientsInterface[]>([])
    const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([])
    const [showQuantityModal, setShowQuantityModal] = useState(false)
    const [selectedIngredient, setSelectedIngredient] = useState<getIngredientsInterface | null>(null)
    const [quantity, setQuantity] = useState(1)

    const  {user} = useUserStore()

    const { data } = useQuery({
        queryKey: ["ingredients"],
        queryFn: () => axiosInstance.get("/ingredients")
    })
  
    useEffect(() => {
        if(data?.data) setIngredients(data?.data)
    }, [data])

    const mutation = useMutation({
        mutationFn: (data : requestInterface) => axiosInstance.post("/request", data),
        onSuccess: (response) => {
            successAlert("succes")
            setSelectedIngredients([])
            setRequest(response.data)
        },
        onError: (err) => {
          errorAlert("error")
        },
      })
    
      

    const handleIngredientClick = (ingredient: getIngredientsInterface) => {
        setSelectedIngredient(ingredient)
        setShowQuantityModal(true)
        setQuantity(1)
    }

    const handleQuantitySubmit = () => {
        if (!selectedIngredient || !quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
            errorAlert("Please enter a valid quantity")
            return
        }

        const newSelectedIngredient: SelectedIngredient = {
            _id: selectedIngredient._id,
            name: selectedIngredient.name,
            quantity: Number(quantity),
            price: selectedIngredient.price
        }

        // Check if ingredient already exists in selected list
        const existingIndex = selectedIngredients.findIndex(item => item._id === selectedIngredient._id)
        
        if (existingIndex !== -1) {
            // Update existing ingredient quantity
            const updatedIngredients = [...selectedIngredients]
            updatedIngredients[existingIndex].quantity += Number(quantity)
            setSelectedIngredients(updatedIngredients)
        } else {
            // Add new ingredient
            setSelectedIngredients([...selectedIngredients, newSelectedIngredient])
        }

        setShowQuantityModal(false)
        setSelectedIngredient(null)
        setQuantity(1)
    }

    const removeSelectedIngredient = (id: string) => {
        setSelectedIngredients(selectedIngredients.filter(item => item._id !== id))
    }

    const handleSubmit = () => {
        if(!selectedIngredients || !user?.branch) return errorAlert("empty")
        confirmAlert("are you sure you want to request?", "Reqiest Order", () => {
            const formattedDate = new Date().toISOString().split('T')[0];
            const requestData = {
                branch : user?.branch ,
                request : selectedIngredients,
                total : selectedIngredients.reduce((total, item) => total + (item.quantity * item.price), 0),
                date : formattedDate.toString(),
                status :  "pending",
                manager : user.fullname
            }
            mutation.mutate(requestData)
        })
    }

  return (
    <div className="h-full w-full flex flex-col gap-[1%]">

        <div className="h-[60%] w-full bg-stone-100 shadow rounded-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-[15%] flex justify-center items-center border-b border-gray-300">
            <h1 className="text-2xl font-bold text-gray-800">Request Ingredient to Main Branch</h1>
        </div>

        {/* Grid of ingredients */}
        <div className="h-[85%] grid grid-cols-5 gap-4 overflow-y-auto p-4">
            {ingredients.map((ingredient) => (
            <div
                key={ingredient._id}
                className="h-32 bg-white rounded-xl shadow hover:shadow-md transition duration-200 flex flex-col overflow-hidden cursor-pointer"
                onClick={() => handleIngredientClick(ingredient)}
            >
                {/* Image */}
                <div className="h-[60%] bg-gray-100">
                <img
                    src={ingredient.img}
                    alt={ingredient.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                    }}
                />
                <div className="hidden w-full h-full flex items-center justify-center text-sm text-gray-500 bg-gray-200">
                    No Image
                </div>
                </div>

                {/* Info */}
                <div className="h-[40%] px-2 py-1 flex flex-col justify-center">
                <h1 className="text-sm font-medium text-gray-700 truncate">Name: {ingredient.name}</h1>
                <h1 className="text-sm text-gray-500">Price: ₱{ingredient.price}</h1>
                </div>
            </div>
            ))}
        </div>
        </div>

        {/* Selected Ingredients Section */}
        <div className="h-[29%] w-full bg-stone-100 shadow rounded-2xl flex flex-col overflow-hidden">
            <div className="h-[20%] flex justify-between items-center border-b border-gray-300 px-4">
                <h1 className="text-xl font-bold text-gray-800">Selected Ingredients</h1>
                <div className="text-lg font-semibold text-green-600">
                    Total: ₱{selectedIngredients.reduce((total, item) => total + (item.quantity * item.price), 0)}
                </div>
            </div>
            
            <div className="h-[80%] overflow-y-auto p-4">
                {selectedIngredients.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        No ingredients selected
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Unit pirce</TableHead>
                                <TableHead >Total Price</TableHead>
                                <TableHead className="text-right"> remove </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {selectedIngredients.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>₱{item.price} </TableCell>
                                    <TableCell>₱{item.price * item.quantity}</TableCell>
                                    <TableCell className="text-right"> 
                                    <button
                                        onClick={() => removeSelectedIngredient(item._id)}
                                        className="text-red-500 hover:text-red-700 font-bold text-xl"
                                    >
                                        ×
                                    </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>

        <div className="h-[10%] w-full bg-stone-100 shadow rounded flex justify-center items-center p-2">
            <Button className="w-full h-full" onClick={handleSubmit}>
               Send Request To Main Branch
            </Button>
        </div>

        {/* Quantity Modal */}
        {showQuantityModal && (
            <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-xl p-6 w-96 border">
                    <div className="flex justify-between">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Enter Quantity</h2>
                        <h2 className="text-xl font-bold mb-4 text-gray-800">total : <span className="text-green-500">  ₱{ (selectedIngredient?.price) ? selectedIngredient?.price * quantity : 0} </span></h2>
                    </div>
                    <p className="text-gray-600 mb-4">How many {selectedIngredient?.name} do you want to request?</p>
                    
                    <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        placeholder="Enter quantity"
                        className="mb-5"
                        min="1"
                        autoFocus
                    />
                    
                    <div className="flex justify-end gap-3">
                        <Button
                            onClick={() => setShowQuantityModal(false)}
                            
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleQuantitySubmit}
                            className=""
                        >
                            Add
                        </Button>
                    </div>
                </div>
            </div>
        )}
     
    </div>
  );
}