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

export function AddButton({ setIngredients } : { setIngredients : React.Dispatch<React.SetStateAction<getIngredientsInterface[]>>}) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [productName, setProductName] = useState("")
  const [initialStocks, setInitialStocks] = useState<number>(0)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (formData: FormData) =>
      axiosInstance.post("/ingredients", formData, { headers: { "Content-Type": "multipart/form-data" } }),
    onSuccess: (response) => {
      alert("success")
      setProductName("")
      setInitialStocks(0)
      setFile(null)
      setOpen(false)
      setImagePreview(null);
      setIngredients(response.data)
      
    },
    onError: (err) => {
      alert(err)
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
      // ✅ If user clears file input, also clear preview
      setFile(null);
      setImagePreview(null);
    }
  };
  

  const handleSubmit = async () => {
    if (!file || !productName || !initialStocks) return alert("emptty")

    const formData = new FormData()
    formData.append("file", file)
    formData.append("name", productName)
    formData.append("stocks", initialStocks.toString())
    mutation.mutate(formData)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger onClick={() => setOpen(true)} asChild>
        <Button variant="outline">Add Ingredients</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md ">
        <SheetHeader>
          <SheetTitle>Add New Ingredient</SheetTitle>
          <SheetDescription>Fill in the details below to add a new ingredient to your inventory.</SheetDescription>
        </SheetHeader>

        <div className="rounded-lg  bg-card   mx-auto h-[500px] overflow-auto p-6 space-y-6">
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

          {/* File Upload */}
          <div className="space-y-2">
            <h1  className="text-sm font-medium">
              Product Image
            </h1>
            <div className="relative">
            <input
                id="product-image"
                type="file"
                onChange={handleFileChange}
                className="w-full file:px-3 file:py-1.5 file:rounded file:border file:bg-gray-100 file:text-gray-700 file:cursor-pointer"
                accept="image/*"
            />

            </div>
          </div>

          {/* Image Preview */}
          {imagePreview ? (
            <div className="space-y-2">
              <h1 className="text-sm font-medium">Preview</h1>
              <div className="relative w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-hidden bg-muted/50">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Product preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h1 className="text-sm font-medium">Preview</h1>
              <div className="flex items-center justify-center w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">No image selected</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="gap-2">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button type="submit" onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save Ingredient"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
