import { orderInterface } from "../types/orders.type";


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
