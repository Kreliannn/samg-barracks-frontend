"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useState, type ChangeEvent } from "react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useMutation } from "@tanstack/react-query"
import axiosInstance from "@/app/utils/axios"
import { backendUrl } from "@/app/utils/url"
import { ImageIcon, Upload } from "lucide-react"
import { getIngredientsInterface } from "../page"

export function EditButton({ setIngredients, ingredient } : { ingredient : getIngredientsInterface, setIngredients : React.Dispatch<React.SetStateAction<getIngredientsInterface[]>>}) {
  const [open, setOpen] = useState(false)
  const [productName, setProductName] = useState(ingredient.name)
  const [initialStocks, setInitialStocks] = useState<number>(ingredient.stocks)


  const mutation = useMutation({
    mutationFn: (data: {id : string, name: string, stocks: number}) => axiosInstance.put("/ingredients", data),
    onSuccess: (response) => {
      alert("success")
      setIngredients(response.data)
      setOpen(false)
    },
    onError: (err) => {
      alert(err)
    },
  })

  

  const handleSubmit = async () => {
    if ( !productName || !initialStocks) return alert("emptty")

    mutation.mutate({id : ingredient._id, name: productName, stocks: initialStocks})

  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger onClick={() => setOpen(true)} asChild>
        <Button variant="outline" className="w-full">Edit</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md ">
        <SheetHeader>
          <SheetTitle>Edit Ingredient</SheetTitle>
          <SheetDescription>Fill in the details below to Edit ingredient to your inventory.</SheetDescription>
        </SheetHeader>

        <div className="rounded-lg  bg-card w-5/6   mx-auto h-[500px] overflow-auto p-6 space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <h1  className="text-sm font-medium">
                Ingredients name
            </h1>
            <Input
              id="Ingredients-name"
              type="text"
              placeholder="Enter Ingredients name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Initial Stocks */}
          <div className="space-y-2">
            <h1  className="text-sm font-medium">
              Initial Stock Quantity
            </h1>
            <Input
              id="initial-stocks"
              type="number"
              placeholder="Enter initial stock quantity"
              value={initialStocks}
              onChange={(e) => setInitialStocks(Number(e.target.value))}
              className="w-full"
              min="0"
            />
          </div>
    
        </div>

        <SheetFooter className="gap-2">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button type="submit" onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
