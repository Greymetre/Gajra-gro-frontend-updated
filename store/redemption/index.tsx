import { AxiosResponse } from "axios";
export interface IRedemptionState {
    redemptions: any,
    loading : boolean,
    error : boolean
}

// Define user type
export interface Redemption {
    customerid: string;
    firmName: string;
    points : number;
    coupon : string ;
    pointType : string;
    
}

// Define Different action type
 interface AddRedemptionAction {
    type: string;
    payload: Redemption;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

interface DeleteRedemptionAction {
    type: string;
    payload: Redemption;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

export interface RedemptionState {
    redemptions: Redemption;
    loading: boolean;
    error: boolean;
}
export type RedemptionActionsTypes = AddRedemptionAction | DeleteRedemptionAction;
export const REDEMPTION_LIST_REQUEST = "REDEMPTION_LIST_REQUEST"
export const REDEMPTION_LIST_SUCCESS = "REDEMPTION_LIST_SUCCESS"
export const REDEMPTION_LIST_FAIL = "REDEMPTION_LIST_FAIL"
export const REDEMPTION_DETAIL_REQUEST = "REDEMPTION_DETAIL_REQUEST"
export const REDEMPTION_DETAIL_SUCCESS = "REDEMPTION_DETAIL_SUCCESS"
export const REDEMPTION_DETAIL_FAIL = "REDEMPTION_DETAIL_FAIL"
export const REDEMPTION_SAVE_REQUEST = "REDEMPTION_SAVE_REQUEST"
export const REDEMPTION_SAVE_SUCCESS = "REDEMPTION_SAVE_SUCCESS"
export const REDEMPTION_SAVE_FAIL = "REDEMPTION_SAVE_FAIL"
export const REDEMPTION_UPDATE_REQUEST = "REDEMPTION_UPDATE_REQUEST"
export const REDEMPTION_UPDATE_SUCCESS = "REDEMPTION_UPDATE_SUCCESS"
export const REDEMPTION_UPDATE_FAIL = "REDEMPTION_UPDATE_FAIL"
export const REDEMPTION_DELETE_REQUEST = "REDEMPTION_DELETE_REQUEST"
export const REDEMPTION_DELETE_SUCCESS = "REDEMPTION_DELETE_SUCCESS"
export const REDEMPTION_DELETE_FAIL = "REDEMPTION_DELETE_FAIL"
