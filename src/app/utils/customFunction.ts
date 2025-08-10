import { orderInterface } from "../types/orders.type";


export const getTotalWithVat = (items : orderInterface[] ) => {
    let total = 0
    items.forEach((item) => {
      total += (item.price * item.qty)
    })
    return total
}

export const getTotaldiscount= (items : orderInterface[] ) => {
  let totalDiscount = 0
  items.forEach((item) => {
    totalDiscount += item.discount
  })
  return totalDiscount
}

export const getTotalVat= (items : orderInterface[] ) => {
  let totalVat = 0
  items.forEach((item) => {
    totalVat += item.vat
  })
  return totalVat
}



export const checkIfHasUnli = (items : orderInterface[]) => {
    let value = true
    items.forEach((item) => {
        if(item.type == "Unli") value = false
    })
    return value;
}


export function generateId() {
    const timestamp = Math.floor(Date.now() / 1000).toString(16);
    return (
      timestamp +
      "xxxxxxxxxxxxxxxx".replace(/x/g, () => {
        return Math.floor(Math.random() * 16).toString(16);
      })
    ).toLowerCase();
  }
