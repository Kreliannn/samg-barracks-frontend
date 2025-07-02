"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { getMenuInterface } from "@/app/types/menu.type";
import { Plus, Minus } from "lucide-react";
import { orderInterface } from "@/app/types/orders.type";
import useOrderStore from "@/app/store/cart.store";


export function AddCart({ menu }: { menu: getMenuInterface }) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState("none");

  const {addOrder} = useOrderStore()

  const addCartHandler = () => {
        const discountTemp = (discount != "none") ? 20 : 0

        const order : orderInterface = {
            ...menu,
            qty : quantity,
            discount : discountTemp,
            discountType : discount,
            total : menu.price * quantity
        }
        addOrder(order)
        setOpen(false)
        setDiscount("none")
        setQuantity(1)
  }

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(value > 0 ? value : 1);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="absolute w-full h-full top-0 left-0 opacity-0"
          onClick={() => setOpen(true)}
        ></Button>
      </DialogTrigger>
      <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>   
           
          </DialogDescription>
        </DialogHeader>
      <DialogContent className="sm:max-w-[600px]">
        <div className="grid grid-cols-2 gap-6">
          {/* First Column - Image */}
          <div className="w-full h-64 relative rounded-xl overflow-hidden">
            <img
              src={menu.img}
              alt={menu.name}
              className="w-full h-full object-cover"
            />
          </div>        

          {/* Second Column - Details */}
          <div className="space-y-4">
            {/* Name */}
            <div className="flex gap-10">
              <h2 className="text-xl font-semibold">{menu.name}</h2> 
              <p className="text-xl font-medium text-green-600">₱{menu.price}</p>
            </div>


            {/* Quantity */}
            <div className="space-y-2 ">
              <h3 className="text-sm font-medium">Quantity</h3>
              <div className="flex items-center space-x-2 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decrementQuantity}
                  className="w-1/6 h-8 p-0 bg-red-500 text-white hover:bg-red-600 hover:text-white"
                >
                    <Minus />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min={1}
                  className="w-4/6 text-center"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={incrementQuantity}
                  className="w-1/6 h-8 p-0 bg-green-500 text-white hover:bg-green-600 hover:text-white"
                >
                  <Plus />
                </Button>
              </div>
            </div>

            {/* Discount */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Discount Type</h3>
              <Select value={discount} onValueChange={setDiscount}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select discount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Discount</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="pwd">PWD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
                <Button className="w-full" onClick={addCartHandler}> Add To Cart </Button>
            </div>

          </div>
        </div>

     
      </DialogContent>
    </Dialog>
  );
}