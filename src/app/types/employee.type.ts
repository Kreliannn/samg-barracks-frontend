export interface AccountInterface {
   
    fullname: string,
    username: string,
    password: string,
    role: {
        isAdmin : boolean,
        isCashier : boolean,
        isManager : boolean,
    },
    branch: string,
}

export interface getAccountInterface {
    _id : string,
    fullname: string,
    username: string,
    password: string,
    role: {
        isAdmin : boolean,
        isCashier : boolean,
        isManager : boolean,
    },
    branch: string,
}