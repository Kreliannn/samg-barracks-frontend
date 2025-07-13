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
import useUserStore from "@/app/store/user.store"
import { menuVariantInterface } from "@/app/types/menu.type"
import { Plus } from "lucide-react"

export function AddVariant({ setMenu, menu } : { menu : getMenuInterface, setMenu : React.Dispatch<React.SetStateAction<getMenuInterface[]>>}) {
  const [open, setOpen] = useState(false)


  const [price, setPrice] = useState<number>(0)

  const [variant, setVariant] = useState("")
  
  const [ingredients, setIngredients] = useState<menuIngredientsInterface[]>([])
  
  const { user }  = useUserStore()

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
    mutationFn: (data: { variants : menuVariantInterface, id : string}, ) =>
      axiosInstance.patch("/menu", data),
    onSuccess: (response) => {
      successAlert("save changes")
      setMenu(response.data)
      setOpen(false)
      setVariant("")
      setPrice(0)
      setIngredients([])
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
    if ( !variant || !price ) return errorAlert("empty field")

    const data = {
        variant : variant,
        price : price,
        ingredients : ingredients
    }
    mutation.mutate({ variants : data, id : menu._id})
  }



  if(user?.branch != "Main Branch") return null

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger onClick={() => setOpen(true)} asChild>

        <Button className="absolute top-2 right-2 shadow" size={"icon"} onClick={() => setOpen(true)}>
                <Plus />
        </Button>

      </SheetTrigger>
  
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Add Variant Menu</SheetTitle>
          <SheetDescription className="text-sm text-gray-500">
            Fill in the details below to add  Variant  to your menu.
          </SheetDescription>
        </SheetHeader>
  
        <div className="rounded-lg bg-white mx-auto max-h-[500px] overflow-auto p-6 space-y-6 border">

          <div className="">
                <h1 className="text-xl font-bold">menu : <span>{menu.name}</span></h1>
          </div>

          {/* Menu Name */}
          <div className="space-y-1">
            <label htmlFor="menu-name" className="text-sm font-medium text-gray-700">
              Variant
            </label>
            <Input
              id="Variant-name"
              type="text"
              placeholder="e.g., large, to share"
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
            />
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
