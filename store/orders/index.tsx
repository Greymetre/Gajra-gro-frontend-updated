import { AxiosResponse } from "axios";
export interface IOrderState {
    orders: any,
    loading : boolean,
    error : boolean
}
// Define user type
export interface DetailInterface {
    productid:[];
    productDetailid:[];
    quantity:number;
    price:number;
    lineTotal:number;
    
  
}

// Define user type
export interface Order {
    parentid:string;
    subTotal: number;
    totalAmount:number;
    customerid:string;
    paymentStatus:string;

    status :string;
    address:string;
   detail:DetailInterface;
 
}

// Define Different action type
 interface AddOrderAction {
    type: string;
    payload: Order;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

interface DeleteOrderAction {
    type: string;
    payload: Order;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

export interface ProductState {
    Orders: Order;
    loading: boolean;
    error: boolean;
}
export type OrderActionsTypes = AddOrderAction | DeleteOrderAction;
export const ORDER_LIST_REQUEST = "ORDER_LIST_REQUEST"
export const ORDER_LIST_SUCCESS = "ORDER_LIST_SUCCESS"
export const ORDER_LIST_FAIL = "ORDER_LIST_FAIL"
export const ORDER_DETAIL_REQUEST = "ORDER_DETAIL_REQUEST"
export const ORDER_DETAIL_SUCCESS = "ORDER_DETAIL_SUCCESS"
export const ORDER_DETAIL_FAIL = "ORDER_DETAIL_FAIL"
export const ORDER_SAVE_REQUEST = "ORDER_SAVE_REQUEST"
export const ORDER_SAVE_SUCCESS = "ORDER_SAVE_SUCCESS"
export const ORDER_SAVE_FAIL = "ORDER_SAVE_FAIL"
export const ORDER_UPDATE_REQUEST = "ORDER_UPDATE_REQUEST"
export const ORDER_UPDATE_SUCCESS = "ORDER_UPDATE_SUCCESS"
export const ORDER_UPDATE_FAIL = "ORDER_UPDATE_FAIL"
export const ORDER_DELETE_REQUEST = "ORDER_DELETE_REQUEST"
export const ORDER_DELETE_SUCCESS = "ORDER_DELETE_SUCCESS"
export const ORDER_DELETE_FAIL = "ORDER_DELETE_FAIL"

