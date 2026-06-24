
export interface OrdersCreateInterface {


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

export const initialOrders = {
    parentid: "",
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

    }],
}