"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export function PlaceOrder() {
  const [open, setOpen] = useState(false);
  const [orderType, setOrderType] = useState("dine in")
  const [table, setTable] = useState("Table 1")

  const handlePlaceOrder = () => {

  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg" onClick={() => setOpen(true)}>
          Place Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
         
        </DialogHeader>

        <div className="space-y-4 mb-6">
          {/* Order Type Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Order Type</label>
            <Select defaultValue="dine_in">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select order type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dine_in">Dine In</SelectItem>
                <SelectItem value="take_out">Take Out</SelectItem>
                <SelectItem value="grab">Grab</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table Number Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Table Number</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select table number" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => (
                  <SelectItem key={i + 1} value={`table_${i + 1}`}>
                    Table {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handlePlaceOrder} className="w-full">Submit</Button>
        </div>

    
      </DialogContent>
    </Dialog>
  );
}
