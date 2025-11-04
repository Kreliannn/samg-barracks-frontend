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



export function getTodayHeader() {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  const formatted = today.toLocaleDateString("en-US", options);
  return `Today ${formatted}`;
}


export function getThisWeekHeader() {
  const today = new Date();

  // Find Monday (start of the week)
  const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay(); // treat Sunday as 7
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek - 1));

  // Find Sunday (end of the week)
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  const start = monday.toLocaleDateString("en-US", options);
  const end = sunday.toLocaleDateString("en-US", options);

  return `This week ${start} - ${end}`;
}


export function getThisMonthHeader() {
  const today = new Date();

  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const monthName = today.toLocaleString("en-US", { month: "long" });
  const start = firstDay.getDate();
  const end = lastDay.getDate();


  return `${monthName} ${start} to ${end}`;
}


export function convertYmdToMdy(ymd  :string | null) {
  if(!ymd) return
  const date = new Date(ymd);
  const mdy = date.toLocaleDateString("en-US"); 
  return  mdy; 
;
}



