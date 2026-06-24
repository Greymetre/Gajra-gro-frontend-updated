import { AxiosResponse } from "axios";
export interface ICouponState {
    coupons: any,
    loading : boolean,
    error : boolean
}

// Define user type
export interface Coupon {
    customerid: string;
    firmName: string;
    points : number;
    coupon : string ;
    pointType : string[];
    
}

// Define Different action type
 interface AddCouponAction {
    type: string;
    payload: Coupon;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

interface DeleteCouponAction {
    type: string;
    payload: Coupon;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

export interface CouponState {
    coupons: Coupon;
    loading: boolean;
    error: boolean;
}
export type CouponActionsTypes = AddCouponAction | DeleteCouponAction;
export const COUPON_LIST_REQUEST = "COUPON_LIST_REQUEST"
export const COUPON_LIST_SUCCESS = "COUPON_LIST_SUCCESS"
export const COUPON_LIST_FAIL = "COUPON_LIST_FAIL"
export const COUPON_DETAIL_REQUEST = "COUPON_DETAIL_REQUEST"
export const COUPON_DETAIL_SUCCESS = "COUPON_DETAIL_SUCCESS"
export const COUPON_DETAIL_FAIL = "COUPON_DETAIL_FAIL"
export const COUPON_SAVE_REQUEST = "COUPON_SAVE_REQUEST"
export const COUPON_SAVE_SUCCESS = "COUPON_SAVE_SUCCESS"
export const COUPON_SAVE_FAIL = "COUPON_SAVE_FAIL"
export const COUPON_UPDATE_REQUEST = "COUPON_UPDATE_REQUEST"
export const COUPON_UPDATE_SUCCESS = "COUPON_UPDATE_SUCCESS"
export const COUPON_UPDATE_FAIL = "COUPON_UPDATE_FAIL"
export const COUPON_DELETE_REQUEST = "COUPON_DELETE_REQUEST"
export const COUPON_DELETE_SUCCESS = "COUPON_DELETE_SUCCESS"
export const COUPON_DELETE_FAIL = "COUPON_DELETE_FAIL"
