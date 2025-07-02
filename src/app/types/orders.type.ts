import { menuInterface , getMenuInterface} from "./menu.type";

export interface orderInterface extends getMenuInterface {
    discount : number,
    discountType : string,
    qty : number,
    total : number,
    branch : string,
}