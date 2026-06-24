import { AxiosResponse } from "axios";
export interface ITransactionState {
    transactions: any,
    loading : boolean,
    error : boolean
}

// Define user type
export interface Transaction {
    customerid: string;
    firmName: string;
    points : number;
    coupon : string ;
    pointType : string;
    
}

// Define Different action type
 interface AddTransactionAction {
    type: string;
    payload: Transaction;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

interface DeleteTransactionAction {
    type: string;
    payload: Transaction;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

export interface TransactionState {
    transactions: Transaction;
    loading: boolean;
    error: boolean;
}
export type TransactionActionsTypes = AddTransactionAction | DeleteTransactionAction;
export const TRANSACTION_LIST_REQUEST = "TRANSACTION_LIST_REQUEST"
export const TRANSACTION_LIST_SUCCESS = "TRANSACTION_LIST_SUCCESS"
export const TRANSACTION_LIST_FAIL = "TRANSACTION_LIST_FAIL"
export const TRANSACTION_DETAIL_REQUEST = "TRANSACTION_DETAIL_REQUEST"
export const TRANSACTION_DETAIL_SUCCESS = "TRANSACTION_DETAIL_SUCCESS"
export const TRANSACTION_DETAIL_FAIL = "TRANSACTION_DETAIL_FAIL"
export const TRANSACTION_SAVE_REQUEST = "TRANSACTION_SAVE_REQUEST"
export const TRANSACTION_SAVE_SUCCESS = "TRANSACTION_SAVE_SUCCESS"
export const TRANSACTION_SAVE_FAIL = "TRANSACTION_SAVE_FAIL"
export const TRANSACTION_UPDATE_REQUEST = "TRANSACTION_UPDATE_REQUEST"
export const TRANSACTION_UPDATE_SUCCESS = "TRANSACTION_UPDATE_SUCCESS"
export const TRANSACTION_UPDATE_FAIL = "TRANSACTION_UPDATE_FAIL"
export const TRANSACTION_DELETE_REQUEST = "TRANSACTION_DELETE_REQUEST"
export const TRANSACTION_DELETE_SUCCESS = "TRANSACTION_DELETE_SUCCESS"
export const TRANSACTION_DELETE_FAIL = "TRANSACTION_DELETE_FAIL"
