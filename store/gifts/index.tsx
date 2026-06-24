import { AxiosResponse } from "axios";
export interface IGiftState {
    gifts: any,
    loading : boolean,
    error : boolean
}
// Define user type
export interface Gift {
    giftName : string;
    giftDescription: string;
    brand : string ;
    model : string;
    mrp : number;
    price : number;
    points : number;
    giftType : string;
}

// Define Different action type
 interface AddGiftAction {
    type: string;
    payload: Gift;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

interface DeleteGiftAction {
    type: string;
    payload: Gift;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

export interface GiftState {
    gifts: Gift;
    loading: boolean;
    error: boolean;
}
export type GiftActionsTypes = AddGiftAction | DeleteGiftAction;
export const GIFT_LIST_REQUEST = "GIFT_LIST_REQUEST"
export const GIFT_LIST_SUCCESS = "GIFT_LIST_SUCCESS"
export const GIFT_LIST_FAIL = "GIFT_LIST_FAIL"
export const GIFT_DETAIL_REQUEST = "GIFT_DETAIL_REQUEST"
export const GIFT_DETAIL_SUCCESS = "GIFT_DETAIL_SUCCESS"
export const GIFT_DETAIL_FAIL = "GIFT_DETAIL_FAIL"
export const GIFT_SAVE_REQUEST = "GIFT_SAVE_REQUEST"
export const GIFT_SAVE_SUCCESS = "GIFT_SAVE_SUCCESS"
export const GIFT_SAVE_FAIL = "GIFT_SAVE_FAIL"
export const GIFT_UPDATE_REQUEST = "GIFT_UPDATE_REQUEST"
export const GIFT_UPDATE_SUCCESS = "GIFT_UPDATE_SUCCESS"
export const GIFT_UPDATE_FAIL = "GIFT_UPDATE_FAIL"
export const GIFT_DELETE_REQUEST = "GIFT_DELETE_REQUEST"
export const GIFT_DELETE_SUCCESS = "GIFT_DELETE_SUCCESS"
export const GIFT_DELETE_FAIL = "GIFT_DELETE_FAIL"

