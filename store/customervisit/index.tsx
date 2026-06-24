import { AxiosResponse } from "axios";

// Define user type
export interface ICustomerVisitState {
    userid: string;
    customerid: string;
    checkinAt : any ;
    checkinLocation : string;
    checkoutAt : any;
    beatscheduleid : string;
    summary : string;
}

// Define Different action type
 interface AddCustomerVisitAction {
    type: string;
    payload: any;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

interface DeleteCustomerVisitAction {
    type: string;
    payload: any;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

export interface CustomerVisitState {
    customervisit: any;
    loading: boolean;
    error: boolean;
}
export type CustomerVisitActionsTypes = AddCustomerVisitAction | DeleteCustomerVisitAction;
export const CUSTOMERVISIT_LIST_REQUEST = "CUSTOMERVISIT_LIST_REQUEST"
export const CUSTOMERVISIT_LIST_SUCCESS = "CUSTOMERVISIT_LIST_SUCCESS"
export const CUSTOMERVISIT_LIST_FAIL = "CUSTOMERVISIT_LIST_FAIL"
export const CUSTOMERVISIT_DETAIL_REQUEST = "CUSTOMERVISIT_DETAIL_REQUEST"
export const CUSTOMERVISIT_DETAIL_SUCCESS = "CUSTOMERVISIT_DETAIL_SUCCESS"
export const CUSTOMERVISIT_DETAIL_FAIL = "CUSTOMERVISIT_DETAIL_FAIL"
export const CUSTOMERVISIT_SAVE_REQUEST = "CUSTOMERVISIT_SAVE_REQUEST"
export const CUSTOMERVISIT_SAVE_SUCCESS = "CUSTOMERVISIT_SAVE_SUCCESS"
export const CUSTOMERVISIT_SAVE_FAIL = "CUSTOMERVISIT_SAVE_FAIL"
export const CUSTOMERVISIT_UPDATE_REQUEST = "CUSTOMERVISIT_UPDATE_REQUEST"
export const CUSTOMERVISIT_UPDATE_SUCCESS = "CUSTOMERVISIT_UPDATE_SUCCESS"
export const CUSTOMERVISIT_UPDATE_FAIL = "CUSTOMERVISIT_UPDATE_FAIL"
export const CUSTOMERVISIT_DELETE_REQUEST = "CUSTOMERVISIT_DELETE_REQUEST"
export const CUSTOMERVISIT_DELETE_SUCCESS = "CUSTOMERVISIT_DELETE_SUCCESS"
export const CUSTOMERVISIT_DELETE_FAIL = "CUSTOMERVISIT_DELETE_FAIL"

