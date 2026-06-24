
export interface SalesCreateInterface {


    parentid?: string;
    subTotal?:number;
    totalAmount?:number;
    status?:string;
    paymentStatus?:string;
    address?:string;
    detail?:[{
        productid?:any;
        productDetailid?:any;
        quantity?:number;
        price?:number;
        lineTotal?:number;

    }]

}

export const initialSales = {
    parentid: "6386e7f2cdf7fa81c533b10e",
    subTotal: 1,
    totalAmount: 1,
    status:"",
    paymentStatus:"",
    address:"",
    detail:[{
        productid:"",
        productDetailid:"",
        quantity:0,
        price:1,
        lineTotal:1,

    }]
}