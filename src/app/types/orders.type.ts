import { menuInterface } from "./menu.type";

export interface orderInterface extends menuInterface {
    discount : number,
    discountType : string,
    qty : number,
    total : number,
    branch : string,
}