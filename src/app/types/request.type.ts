


export interface requestInterface {
    branch : string,
    request : {
           _id : string,
        name : string,
        quantity : number,
        price : number
    }[],
    total : number,
    date : string,
    status : string,
    manager : string
}


export interface getRequestInterface {
    _id : string,
    branch : string,
    request : {
        _id : string,
        name : string,
        quantity : number,
        price : number
    }[],
    total : number,
    date : string,
    status : string,
    manager : string
}
