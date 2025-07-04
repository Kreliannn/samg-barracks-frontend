import { ordersInterface } from "../types/orders.type";


export const print2ndReceipt = (order: ordersInterface) => {
    const serviceCharge = order.subTotal * 0.10;
    const grandtotal = order.grandTotal + serviceCharge;
  
    console.log("=".repeat(40));
    console.log("              ORDER RECEIPT");
    console.log("=".repeat(40));
  
    console.log(`Table: ${order.table}`);
    console.log(`Cashier: ${order.cashier}`);
    console.log(`Branch: ${order.branch}`);
    console.log("-".repeat(40));
  
    console.log("Item                  Qty    Price");
    console.log("-".repeat(40));
    order.orders.forEach((item) => {
      const name = item.name.padEnd(20);
      const qty = String(item.qty).padStart(3);
      const price = item.price - item.discount;
      console.log(`${name}${qty}  ${price}`);
    });
  
    console.log("-".repeat(40));
    console.log(`Subtotal:            ₱${order.subTotal.toFixed(2).padStart(10)}`);
    console.log(`Discount:            ₱${order.totalDiscount.toFixed(2).padStart(10)}`);
    console.log(`VAT (12%):           ₱${order.vat.toFixed(2).padStart(10)}`);
    console.log(`Service Charge (10%):₱${serviceCharge.toFixed(2).padStart(10)}`);
    console.log("-".repeat(40));
    console.log(`GRAND TOTAL:         ₱${grandtotal.toFixed(2).padStart(10)}`);
    console.log("=".repeat(40));
    console.log("       Thank you for dining with us!");
    console.log("=".repeat(40));
};


export const print3rdReceipt = (order: ordersInterface, cash : number) => {
    const serviceCharge = order.subTotal * 0.10;
    const grandtotal = order.grandTotal + serviceCharge;
  
    console.log("=".repeat(40));
    console.log("              ORDER RECEIPT");
    console.log("=".repeat(40));
  
    console.log(`Table: ${order.table}`);
    console.log(`Cashier: ${order.cashier}`);
    console.log(`Branch: ${order.branch}`);
    console.log("-".repeat(40));
  
    console.log("Item                  Qty    Price");
    console.log("-".repeat(40));
    order.orders.forEach((item) => {
      const name = item.name.padEnd(20);
      const qty = String(item.qty).padStart(3);
      const price = item.price - item.discount;
      console.log(`${name}${qty}  ${price}`);
    });
  
    console.log("-".repeat(40));
    console.log(`Subtotal:            ₱${order.subTotal.toFixed(2).padStart(10)}`);
    console.log(`Discount:            ₱${order.totalDiscount.toFixed(2).padStart(10)}`);
    console.log(`VAT (12%):           ₱${order.vat.toFixed(2).padStart(10)}`);
    console.log(`Service Charge (10%):₱${serviceCharge.toFixed(2).padStart(10)}`);
    console.log("-".repeat(40));
    console.log(`GRAND TOTAL:         ₱${grandtotal.toFixed(2).padStart(10)}`);
    console.log("=".repeat(40));
    console.log(`CASH:         ₱${cash.toFixed(2).padStart(10)}`);
    console.log(`CHANGE:         ₱${ (cash - grandtotal).toFixed(2).padStart(10)}`);
    console.log("=".repeat(40));
    console.log("       Thank you for dining with us!");
    console.log("=".repeat(40));
};