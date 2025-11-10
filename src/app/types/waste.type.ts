export interface wasteInterface {
    item: string,
    qty : number,
    branch: string,
    date: string,
    price: number,
    cost: number,
    reason: string
}


export interface getWasteInterface {
    _id : string,
    item: string,
    qty : number,
    branch: string,
    date: string,
    price: number,
    cost: number,
    reason: string
}