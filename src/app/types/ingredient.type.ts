export interface branchStockInterface {
    branch : string,
    stock : number
}





export interface ingredientsInterface {
    name : string,
    stocks : branchStockInterface[],
    branch : string,
    img : string,
    type : string
}

export interface getIngredientsInterface {
    _id : string,
    name : string,
    stocks : branchStockInterface[],
    branch : string,
    img : string,
    type : string
}