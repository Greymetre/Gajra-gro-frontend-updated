import { AxiosResponse } from "axios";
export interface ICustomerState {
    customers: any
}
// Define user type
export interface AddressInterface {
    postalCode: string;
    address: string;
    city : string ;
    state : string;
    country : string;
}

// Define user type
export interface Customer {
    firmName: string;
    contactPerson: string;
    phonecode : string ;
    mobile : number;
    email : string;
    customerType : string;
    address : AddressInterface;
}

// Define Different action type
 interface AddCustomerAction {
    type: string;
    payload: Customer;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

interface DeleteCustomerAction {
    type: string;
    payload: Customer;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

export interface CustomerState {
    customers: any;
    loading: boolean;
    error: boolean;
}
export type CustomerActionsTypes = AddCustomerAction | DeleteCustomerAction;
export const CUSTOMER_LIST_REQUEST = "CUSTOMER_LIST_REQUEST"
export const CUSTOMER_LIST_SUCCESS = "CUSTOMER_LIST_SUCCESS"
export const CUSTOMER_LIST_FAIL = "CUSTOMER_LIST_FAIL"
export const CUSTOMER_DETAIL_REQUEST = "CUSTOMER_DETAIL_REQUEST"
export const CUSTOMER_DETAIL_SUCCESS = "CUSTOMER_DETAIL_SUCCESS"
export const CUSTOMER_DETAIL_FAIL = "CUSTOMER_DETAIL_FAIL"
export const CUSTOMER_SAVE_REQUEST = "CUSTOMER_SAVE_REQUEST"
export const CUSTOMER_SAVE_SUCCESS = "CUSTOMER_SAVE_SUCCESS"
export const CUSTOMER_SAVE_FAIL = "CUSTOMER_SAVE_FAIL"
export const CUSTOMER_UPDATE_REQUEST = "CUSTOMER_UPDATE_REQUEST"
export const CUSTOMER_UPDATE_SUCCESS = "CUSTOMER_UPDATE_SUCCESS"
export const CUSTOMER_UPDATE_FAIL = "CUSTOMER_UPDATE_FAIL"
export const CUSTOMER_DELETE_REQUEST = "CUSTOMER_DELETE_REQUEST"
export const CUSTOMER_DELETE_SUCCESS = "CUSTOMER_DELETE_SUCCESS"
export const CUSTOMER_DELETE_FAIL = "CUSTOMER_DELETE_FAIL"

