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
import { getIngredientsInterface } from "@/app/types/ingredient.type"
import { errorAlert, successAlert } from "@/app/utils/alert";
import useUserStore from "@/app/store/user.store"

export function EditButton({ setIngredients, ingredient, index } : {index : number,  ingredient : getIngredientsInterface, setIngredients : React.Dispatch<React.SetStateAction<getIngredientsInterface[]>>}) {
  const [open, setOpen] = useState(false)
  const [productName, setProductName] = useState(ingredient.name)
  const [initialStocks, setInitialStocks] = useState<number>(ingredient.stocks[index].stock)
  const [price, setPrice] = useState<number>(ingredient.price)
  const { user } = useUserStore()


  const mutation = useMutation({
    mutationFn: (data: {id : string, name: string, stocks: number, price : number}) => axiosInstance.put("/ingredients", data),
    onSuccess: (response) => {
      successAlert("success")
      setIngredients(response.data)
      setOpen(false)
    },
    onError: (err) => {
      errorAlert("error")
    },
  })

  

  const handleSubmit = async () => {
    if ( !productName || !price) return errorAlert("empty field")

    mutation.mutate({id : ingredient._id, name: productName, stocks: initialStocks, price : price})

  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger onClick={() => setOpen(true)} asChild>
                  <Button className=" absolute w-full h-full top-0 left-0 opacity-0 "  onClick={() => setOpen(true)}>
                    
                  </Button>
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
              disabled={user?.branch != "Main Branch"}
            />
          </div>


          <div className="space-y-2">
            <h1  className="text-sm font-medium">
                Ingredients price
            </h1>
            <Input
              id="Ingredients-price"
              type="text"
              placeholder="Enter Ingredients price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full"
              disabled={user?.branch != "Main Branch"}
            />
          </div>

          {/* Initial Stocks */}
          <div className="space-y-2">
            <h1  className="text-sm font-medium">
               Stock Quantity
            </h1>
            <Input
              id="initial-stocks"
              type="number"
              placeholder="Enter new stock quantity"
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
