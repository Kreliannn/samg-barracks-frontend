export interface menuInterface {
    name : string,
    ingredients : {
        id : string,
        name : string,
        qty : number
    }[],
    type : string,
    price : number,
    branch : string,
    img : string
}

export interface getMenuInterface {
    _id : string,
    name : string,
    ingredients : {
        id : string,
        name : string,
        qty : number
    }[],
    type : string,
    price : number,
    branch : string,
    img : string
}

