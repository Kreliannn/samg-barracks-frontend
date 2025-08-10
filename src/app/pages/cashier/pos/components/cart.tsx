"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, X } from "lucide-react";
import useOrderStore from "@/app/store/cart.store";
import { PlaceOrder } from "./placeOrder";
import { orderInformation } from "@/app/types/orders.type";
import { getTotalWithVat, getTotaldiscount , getTotalVat} from "@/app/utils/customFunction";




export function Cart({ table } : { table : string}) {
  const { orders: cartItems , removeOrder} = useOrderStore();
  /*
  const vatRate = 0.12;

  // 1. Compute total VAT-exclusive subtotal (before discount)
  const subTotalBeforeDiscount = cartItems.reduce((sum, item) => {
    const priceWithoutVAT = item.price / (1 + vatRate);
    return sum + (priceWithoutVAT * item.qty);
  }, 0);
  
  // 2. Compute total discount (from VAT-exclusive prices)
  const totalDiscount = cartItems.reduce((sum, item) => {
    const priceWithoutVAT = item.price / (1 + vatRate);
    const discountAmount = priceWithoutVAT * (item.discount / 100);
    return sum + (discountAmount * item.qty);
  }, 0);
  
  // 3. Get discounted subtotal (still VAT-exclusive)
  const subTotal = subTotalBeforeDiscount - totalDiscount;
  
  // 4. Compute VAT on discounted subtotal
  const vat = subTotal * vatRate;


  const serviceFee = subTotal * 0.10
  
  // 5. Grand total (what customer will pay)
  const discountedTotal =  (subTotal + vat) + serviceFee;

  
  // 6. For display, you can still show:
  const totalWithVat = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  */

  const totalWithVat = getTotalWithVat(cartItems)
  const subTotal = getTotalWithVat(cartItems)
  const totalDiscount = getTotaldiscount(cartItems)
  const vat = getTotalVat(cartItems)
  const serviceFee = subTotal * 0.10
  const discountedTotal = (totalWithVat - totalDiscount) + serviceFee

  const orderInfo : orderInformation = {
    totalWithVat,
    totalDiscount,
    discountedTotal,
    subTotal,
    vat,
    serviceFee
  }


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
                      {20}% discount applied
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
              <span>Sub total :</span>
              <span>₱{subTotal.toFixed(2)}</span>
            </div>

            {totalDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Total Discount:</span>
                <span>-₱{totalDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span>Service Fee (10%):</span>
              <span>₱{serviceFee.toFixed(2)}</span>
            </div>

        
            <div className="border-t pt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total Bill:</span>
                <span>₱{discountedTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <PlaceOrder orderInfo={orderInfo}/>
          
        </div>
      )}
    </div>
  );
}