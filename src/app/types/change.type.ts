export interface changeInterface {
    branch : string,
    change : number,
    date : string,
    start : string,
    end : string
}

export interface getChangeInterface {
    _id : string,
    branch : string,
    change : number,
    date : string,
    start : string,
    end : string
}

export interface shiftInterface {
    date : string,
    start : string, 
    end : string,
    change : number,
    sales : number,
    discount : number,
    vat : number,
    transaction : number,
    serviceFee : number
  }