import { menuInterface , getMenuInterface} from "./menu.type";

export interface orderInterface extends getMenuInterface {
    discount : number,
    discountType : string,
    qty : number,
    total : number,
    branch : string,
}

export interface ordersInterface {
    orders: orderInterface[];
    vat : number,
    subTotal: number;
    totalDiscount: number;
    grandTotal: number;
    branch: string;
    table: string;
    orderType: string;
    cashier: string;
    date : string;
    time : string;
    status : string;
    serviceFee : number;
  }


  
export interface getOrdersInterface {
  _id : string,
  orders: orderInterface[];
  vat : number,
  subTotal: number;
  totalDiscount: number;
  grandTotal: number;
  branch: string;
  table: string;
  orderType: string;
  cashier: string;
  date : string;
  time : string;
  status : string;
  serviceFee : number;
}




  export interface orderInformation {
    totalWithVat : number,
    totalDiscount : number,
    discountedTotal : number,
    subTotal : number,
    vat : number,
    serviceFee : number
  }