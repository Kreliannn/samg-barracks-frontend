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
    date : string
  }



  export interface orderInformation {
    totalWithVat : number,
    totalDiscount : number,
    discountedTotal : number,
    subTotal : number,
    vat : number,
  }