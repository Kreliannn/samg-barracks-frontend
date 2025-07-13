export interface menuIngredientsInterface {
    id : string,
    qty : number
}

export interface menuVariantInterface{
    variant : string,
    price : number
    ingredients : menuIngredientsInterface[]
}


export interface menuInterface {
    name : string,
    type : string,
    variants : menuVariantInterface[],
    branch : string,
    img : string
}

export interface getMenuInterface {
    _id : string,
    name : string,
    type : string,
    variants : menuVariantInterface[],
    branch : string,
    img : string
}











/*
export interface menuInterface {
    name : string,
    ingredients : menuIngredientsInterface[],
    type : string,
    price : number,
    branch : string,
    img : string
}

export interface getMenuInterface {
    _id : string,
    name : string,
    ingredients : menuIngredientsInterface[],
    type : string,
    price : number,
    branch : string,
    img : string
}
*/
