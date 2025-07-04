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
import { ImageIcon, Upload, Utensils, X } from "lucide-react"
import { getMenuInterface, menuIngredientsInterface } from "@/app/types/menu.type"
import { getIngredientsInterface } from "@/app/types/ingredient.type"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Item } from "@radix-ui/react-select"
import { errorAlert, successAlert } from "@/app/utils/alert";

interface dataType  {
    id : string,
    name : string,
    price : number,
    type : string,
    ingredients : menuIngredientsInterface[],
}


export function EditButton({ setMenu, menu } : { menu : getMenuInterface, setMenu : React.Dispatch<React.SetStateAction<getMenuInterface[]>>}) {
  const [open, setOpen] = useState(false)

  const [productName, setProductName] = useState(menu.name)
  const [type, setType] = useState(menu.type)
  const [price, setPrice] = useState<number>(menu.price)
  
  const [ingredients, setIngredients] = useState<menuIngredientsInterface[]>(menu.ingredients)
  

  const [ingredientsData, setIngredientsData] = useState<getIngredientsInterface[]>([])

  const [ingredientSelect, setIngredientSelect] = useState("all")
  const [quantity, setIquantity] = useState(1)

  const { data } = useQuery({
      queryKey: ["ingredients"],
      queryFn: () => axiosInstance.get("/ingredients")
  })

  useEffect(() => {
      if(data?.data) setIngredientsData(data?.data)
  }, [data])

  const mutation = useMutation({
    mutationFn: (data: dataType) =>
      axiosInstance.put("/menu", data),
    onSuccess: (response) => {
      successAlert("save changes")
      setMenu(response.data)
      setOpen(false)
    },
    onError: (err) => {
      errorAlert("error")
    },
  })

  const addIngredientHandler = () => {

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
  

  const handleSubmit = async () => {
    if ( !productName || !price || type == "all") return errorAlert("empty field")

    const data = {
        id : menu._id,
        name : productName,
        price : price,
        ingredients : ingredients,
        type : type
    }
    mutation.mutate(data)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger onClick={() => setOpen(true)} asChild>
            <Button className=" absolute w-full h-full top-0 left-0 opacity-0 "  onClick={() => setOpen(true)}>
                    
            </Button>
      </SheetTrigger>
  
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Edit New Menu</SheetTitle>
          <SheetDescription className="text-sm text-gray-500">
            Fill in the details below to Edit  food item to your menu.
          </SheetDescription>
        </SheetHeader>
  
        <div className="rounded-lg bg-white mx-auto max-h-[500px] overflow-auto p-6 space-y-6 border">
          {/* Menu Name */}
          <div className="space-y-1">
            <label htmlFor="menu-name" className="text-sm font-medium text-gray-700">
              Menu Name
            </label>
            <Input
              id="menu-name"
              type="text"
              placeholder="e.g., Chicken Alfredo"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
  
          {/* Menu Type */}
          <div className="space-y-1">
            <label htmlFor="menu-type" className="text-sm font-medium text-gray-700">
              Menu Type
            </label>
            <Select value={type} onValueChange={setType}>
                <SelectTrigger className="border px-3 py-2 rounded bg-white text-sm w-full">
                  <SelectValue placeholder="Select Ingredient" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem  value={"all"}> select Type </SelectItem>
                    <SelectItem  value={"Ala carte"}> Ala carte </SelectItem>
                    <SelectItem  value={"Sizzling"}> Sizzling </SelectItem>
                    <SelectItem  value={"Beverage"}> Beverage </SelectItem>
                    <SelectItem  value={"Pulutan"}> Pulutan </SelectItem>
                    <SelectItem  value={"Unli"}> Unli </SelectItem>
                    <SelectItem  value={"Others"}> Others </SelectItem>
                </SelectContent>
              </Select>
          </div>
  
          {/* Price */}
          <div className="space-y-1">
            <label htmlFor="price" className="text-sm font-medium text-gray-700">
              Price (₱)
            </label>
            <Input
              id="price"
              type="number"
              placeholder="e.g., 150"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min="0"
            />
          </div>
  
    
  
          {/* Ingredients Selection */}
          <div className="space-y-2">
            <h1 className="text-sm font-medium text-gray-700">Menu Ingredients</h1>
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
              <Input
                type="number"
                placeholder="Qty"
                className="w-24"
                value={quantity}
                onChange={(e) => setIquantity(Number(e.target.value))}
              />
              <Button onClick={addIngredientHandler}>Add</Button>
            </div>
  
            {/* Selected Ingredients List */}
            <div className="space-y-1">
              {ingredients.map((item) => {
                const res = ingredientsData.find((ingredient) => ingredient._id == item.id);
                return (
                  <div key={item.id} className="flex items-center justify-between border p-2 rounded bg-gray-50 text-sm">
                    <span>{item.qty} pcs {res?.name}</span>
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
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
  
}
