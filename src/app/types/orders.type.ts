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
    subTotal: number;
    totalDiscount: number;
    grandTotal: number;
    branch: string;
    table: string;
    orderType: string;
    cashier: string;
    date : string
  }