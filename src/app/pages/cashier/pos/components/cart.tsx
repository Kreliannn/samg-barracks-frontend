"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, X } from "lucide-react";
import useOrderStore from "@/app/store/cart.store";
import { PlaceOrder } from "./placeOrder";

export function Cart() {
  const { orders: cartItems , removeOrder} = useOrderStore();

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalDiscount = cartItems.reduce((sum, item) => sum + (item.price * item.discount / 100), 0);
  const grandTotal = subtotal - totalDiscount;



  return (
    <div className="h-full flex flex-col bg-stone-200">
      {/* Header */}
      <div className="p-4 bg-white border-b">
        <h2 className="text-xl font-bold flex items-center gap-2 ">
          <ShoppingCart className="w-5 h-5" />
          Cart ({cartItems.length})
        </h2>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ShoppingCart className="w-16 h-16 mb-4" />
            <p className="text-lg font-semibold">Your cart is empty</p>
            <p className="text-sm">Add items from the menu to get started</p>
          </div>
        ) : (
          cartItems.map((item, index) => (
            <div key={`${index}-${index}`} className="bg-white rounded-lg p-3 shadow-sm border">
              <div className="flex gap-3">
                {/* Item Image */}
                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  {item.img ? (
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package className="w-6 h-6" />
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{item.name}</h3>
                  <p className="text-xs text-gray-500">₱{item.price.toFixed(2)} x {item.qty}</p>
                  
                  {/* Discount Info */}
                  {item.discount > 0 && (
                    <p className="text-xs text-green-600">
                      {item.discount}% discount applied
                    </p>
                  )}
                </div>

                {/* Total Price */}
                <div className="flex flex-col items-end justify-center">
                  <p className="font-semibold text-sm">₱{item.total.toFixed(2)}</p>
                  {item.discount > 0 && (
                    <p className="text-xs text-green-600">
                      -₱{(item.price *  item.discount / 100).toFixed(2)}
                    </p>
                  )}
                </div>


                <div className="flex flex-col items-end justify-center  ">
                    <X  onClick={() => removeOrder(index)} className="text-red-500 rounded-full bg-stone-50  shadow-sm" />
                </div>



              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer - Total Bill and Place Order */}
      {cartItems.length > 0 && (
        <div className="p-4 bg-white border-t space-y-3">
          {/* Bill Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Total Discount:</span>
                <span>-₱{totalDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total Bill:</span>
                <span>₱{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <PlaceOrder subTotal={subtotal} grandTotal={grandTotal} totalDiscount={totalDiscount}/>
        </div>
      )}
    </div>
  );
}