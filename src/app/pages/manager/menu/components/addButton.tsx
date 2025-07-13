"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useUserStore from "@/app/store/user.store"
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
import { errorAlert, successAlert } from "@/app/utils/alert";

export function AddButton({ setMenu } : { setMenu : React.Dispatch<React.SetStateAction<getMenuInterface[]>>}) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [productName, setProductName] = useState("")
  const [type, setType] = useState("all")
  const [price, setPrice] = useState<number>(0)

  const { user } = useUserStore()
  
  const [ingredients, setIngredients] = useState<menuIngredientsInterface[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)

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
    mutationFn: (formData: FormData) =>
      axiosInstance.post("/menu", formData, { headers: { "Content-Type": "multipart/form-data" } }),
    onSuccess: (response) => {
      successAlert("menu added")
      setMenu(response.data)
      setProductName("")
      setPrice(0)
      setType("all")
      setIngredients([])
      setFile(null)
      setImagePreview(null)
      setOpen(false)
    },
    onError: (err) => {
      errorAlert("error")
    },
  })

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
  
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
  
      setFile(null);
      setImagePreview(null);
    }
  };

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
    if (!file || !productName || !price || type == "all") return errorAlert("empty input field")

    const formData = new FormData()

    const variant = {
      variant : "regular",
      price : price,
      ingredients : ingredients
    }

    formData.append("file", file)
    formData.append("name", productName)
    formData.append("type", type)
    formData.append("variants", JSON.stringify(variant))

    mutation.mutate(formData)
  }


  if(user?.branch != "Main Branch") return null

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger onClick={() => setOpen(true)} asChild>
        <Button >Add Menu</Button>
      </SheetTrigger>
  
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Add New Menu</SheetTitle>
          <SheetDescription className="text-sm text-gray-500">
            Fill in the details below to add a new food item to your menu.
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
  
          {/* Image Upload */}
          <div className="space-y-1">
            <label htmlFor="product-image" className="text-sm font-medium text-gray-700">
              Menu Image
            </label>
            <input
              id="product-image"
              type="file"
              onChange={handleFileChange}
              className="w-full file:px-3 file:py-1.5 file:rounded file:border file:bg-gray-100 file:text-gray-700 file:cursor-pointer"
              accept="image/*"
            />
          </div>
  
          {/* Image Preview */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Image Preview</p>
            {imagePreview ? (
              <div className="w-24 h-24 border-2 border-dashed rounded-lg overflow-hidden">
                <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg text-gray-400 bg-gray-50">
                <ImageIcon className="h-12 w-12" />
              </div>
            )}
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
            {mutation.isPending ? "Saving..." : "Save Menu"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
  
}
