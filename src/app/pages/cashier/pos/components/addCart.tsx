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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useState , useEffect} from "react";
import { getMenuInterface } from "@/app/types/menu.type";
import { Plus, Minus } from "lucide-react";
import { orderInterface } from "@/app/types/orders.type";
import useOrderStore from "@/app/store/cart.store";
import { generateId } from "@/app/utils/customFunction";


export function AddCart({ menu }: { menu: getMenuInterface }) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState("none");
  const [variant, setVariant] = useState("regular");
  const [index, setIndex] = useState(0);

  const { orders,addOrder, updateOrder} = useOrderStore()

  useEffect(() => {
    menu.variants.forEach((item, index) => {
      if(item.variant == variant)setIndex(index)
    })
  }, [variant])


  useEffect(() => {
    if(discount != "none") setQuantity(1)
  }, [discount])

  const addCartHandler = () => {

        let discountAmmount = 0 
        let vat = menu.variants[index].price * 0.12
        let itemPrice = menu.variants[index].price
        
        if(discount != "none"){
          const itemWithoutVat = itemPrice - vat
          discountAmmount = (itemWithoutVat * 0.20) + vat
          console.log(discountAmmount)
          itemPrice = itemWithoutVat - discountAmmount
          vat = 0
        }

        const order : orderInterface = {
            item_id : generateId(),
             _id : menu._id,
            name : menu.name,
            type : menu.type,
            branch : menu.branch,
            img : menu.img,
            ingredients : menu.variants[index].ingredients,
            price :  menu.variants[index].price,
            qty : quantity,
            discount : discountAmmount,
            discountType : discount,
            total : itemPrice * quantity,
            vat : vat
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
    <>
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
                <p className="text-xl font-medium text-green-600">₱{menu.variants[index].price}</p>
              </div>

              <div className="grid grid-cols-2 gap-2"> 
       
                <div className="space-y-1">
                  <label htmlFor="menu-type" className="text-sm font-medium text-gray-700">
                    Menu Variants
                  </label>
                  <Select value={variant} onValueChange={setVariant}>
                      <SelectTrigger className="border px-3 py-2 rounded bg-white text-sm w-full">
                        <SelectValue placeholder="Select Ingredient" />
                      </SelectTrigger>
                      <SelectContent>
                          {menu.variants.map((item, index) => (
                            <SelectItem key={index} value={item.variant}> {item.variant} </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="menu-type" className="text-sm font-medium text-gray-700">
                    Discount
                  </label>
                  <Select value={discount} onValueChange={setDiscount}>
                      <SelectTrigger className="border px-3 py-2 rounded bg-white text-sm w-full">
                        <SelectValue placeholder="Select Discount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Discount</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="pwd">PWD</SelectItem>
                      </SelectContent>
                    </Select>
                </div>

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
                    disabled={discount != "none"}
                  >
                      <Minus />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    disabled={discount != "none"}
                    onChange={handleQuantityChange}
                    min={1}
                    className="w-4/6 text-center"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={incrementQuantity}
                    className="w-1/6 h-8 p-0 bg-green-500 text-white hover:bg-green-600 hover:text-white"
                    disabled={discount != "none"}
                  >
                    <Plus />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                  <Button className="w-full" onClick={addCartHandler}> Add To Cart </Button>
              </div>

            </div>
          </div>
        </DialogContent>
      </Dialog>

     
    </>
  );
}