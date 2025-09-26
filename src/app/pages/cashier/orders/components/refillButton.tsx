"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useState, type ChangeEvent, useEffect } from "react"
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
import { useMutation , useQuery} from "@tanstack/react-query"
import axiosInstance from "@/app/utils/axios"
import { backendUrl } from "@/app/utils/url"
import { ImageIcon, Upload, Utensils, X, Plus, Minus } from "lucide-react"
import { getMenuInterface, menuIngredientsInterface } from "@/app/types/menu.type"
import { getIngredientsInterface, ingredientsInterface } from "@/app/types/ingredient.type"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { errorAlert, successAlert } from "@/app/utils/alert";
import { checkIfHasUnli } from "@/app/utils/customFunction"
import { orderInterface } from "@/app/types/orders.type"
import { RefreshCw  } from "lucide-react"

export function RefillButton({ table, orders } : { table : string, orders : orderInterface[]}) {
 
  const [open, setOpen] = useState(false)

  const [ingredients, setIngredients] = useState<menuIngredientsInterface[]>([])
  

  const [ingredientsData, setIngredientsData] = useState<getIngredientsInterface[]>([])

  const [ingredientSelect, setIngredientSelect] = useState("all")
  const [quantity, setIquantity] = useState(1)

  const { data } = useQuery({
      queryKey: ["ingredients"],
      queryFn: () => axiosInstance.get("/ingredients")
  })

  useEffect(() => {
      if(data?.data) setIngredientsData(data?.data.filter((i : ingredientsInterface) => i.type == "unli"))
  }, [data])

  const mutation = useMutation({
    mutationFn: (data: { id : string, qty : number}[]) =>
      axiosInstance.put("/ingredients/refill", data),
    onSuccess: (response) => {
      successAlert("success")
      setIngredients([])
      setIquantity(1)
      setIngredientSelect("all")
      setOpen(false)
    },
    onError: (err) => {
      errorAlert("error")
    },
  })

  const addIngredientHandler = () => {

    if(ingredientSelect == "all") return errorAlert("select ingredient")

    let extraqty = 0

    ingredients.forEach((item, index) => {
        if(item.id == ingredientSelect)
        {
            extraqty = item.qty
            setIngredients((prev) => prev.filter((i) => i.id != item.id ))
        }
    })

    const newIngredient = {
        id : ingredientSelect,
        qty : quantity + extraqty
    }

    setIngredients(prev => [...prev, newIngredient])

    setIquantity(1)
    setIngredientSelect("all")
  }

  const removeItemHandler = (id : string) => {
    setIngredients((prev) => prev.filter((item) => item.id != id ))
  }

  const incrementQuantity = () => {
    setIquantity(prev => prev + 1)
  }

  const decrementQuantity = () => {
    setIquantity(prev => prev > 1 ? prev - 1 : 1)
  }
  

  const refillHandler = () => {
    if(!ingredients) return errorAlert("empty item")
    mutation.mutate(ingredients)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger onClick={() => setOpen(true)} asChild>
            <Button variant="outline" className="text-black" hidden={checkIfHasUnli(orders)}><RefreshCw /></Button>
      </SheetTrigger>
  
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Refill For {table}</SheetTitle>
          <SheetDescription className="text-sm text-gray-500">
                select refill item
          </SheetDescription>
        </SheetHeader>
  
       
  
        <div className="rounded-lg bg-white mx-auto max-h-[500px] overflow-auto p-6 space-y-6 border h-[500px]">
          {/* Ingredients Selection */}
          <div className="space-y-2">
            <h1 className="text-sm font-medium text-gray-700">Refill Option</h1>
            <div className="flex flex-wrap gap-2">
              <Select value={ingredientSelect} onValueChange={setIngredientSelect}>
                <SelectTrigger className="border px-3 py-2 rounded bg-white text-sm w-47">
                  <SelectValue placeholder="Select Ingredient" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem  value={"all"}>
                      select Ingredient
                    </SelectItem>
                  {ingredientsData?.map((item) => (
                    <SelectItem key={item._id} value={item._id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Quantity Controls */}
              <div className="flex items-center border rounded">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-3 py-1 text-sm min-w-[2rem] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={incrementQuantity}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <Button onClick={addIngredientHandler}>Add</Button>
            </div>
  
            {/* Selected Ingredients List */}
            <div className="space-y-1">
              {ingredients.map((item) => {
                const res = ingredientsData.find((ingredient) => ingredient._id == item.id);
                return (
                  <div key={item.id} className="flex items-center justify-between border p-2 rounded bg-gray-50 text-sm">
                    <span>{item.qty} Order of {res?.name}</span>
                    < X  onClick={() => removeItemHandler(item.id)} className="text-stone-700 hover:text-red-500"/>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
  
        {/* Footer Buttons */}
        <SheetFooter className="mt-4 flex gap-2">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">Cancel</Button>
          </SheetClose>
          <Button
            type="submit"
            onClick={refillHandler}
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? "loading..." : "Submit"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
  
}