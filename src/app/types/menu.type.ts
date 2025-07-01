export interface menuIngredientsInterface {
    id : string,
    qty : number
}


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

