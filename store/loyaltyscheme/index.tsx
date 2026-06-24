import { AxiosResponse } from "axios";
export interface ILoyaltySchemeState {
    loyaltyscheme: any,
    loading : boolean,
    error : boolean
}
// Define user type
export interface DetailInterface {
    mrp: number;
    price: number;
    partNo : string ;
    specification : string;
}

// Define user type
export interface LoyaltyScheme {
    loyaltyschemeName: string;
    loyaltyschemeDescription: string;
    categoryName : string ;
    subcategoryName : string;
    ranking : number;
    loyaltyschemeDetail : DetailInterface;
}

// Define Different action type
 interface AddLoyaltySchemeAction {
    type: string;
    payload: LoyaltyScheme;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

interface DeleteLoyaltySchemeAction {
    type: string;
    payload: LoyaltyScheme;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

export interface LoyaltySchemeState {
    loyaltyscheme: LoyaltyScheme;
    loading: boolean;
    error: boolean;
}
export type LoyaltySchemeActionsTypes = AddLoyaltySchemeAction | DeleteLoyaltySchemeAction;
export const LOYALTYSCHEME_LIST_REQUEST = "LOYALTYSCHEME_LIST_REQUEST"
export const LOYALTYSCHEME_LIST_SUCCESS = "LOYALTYSCHEME_LIST_SUCCESS"
export const LOYALTYSCHEME_LIST_FAIL = "LOYALTYSCHEME_LIST_FAIL"
export const LOYALTYSCHEME_DETAIL_REQUEST = "LOYALTYSCHEME_DETAIL_REQUEST"
export const LOYALTYSCHEME_DETAIL_SUCCESS = "LOYALTYSCHEME_DETAIL_SUCCESS"
export const LOYALTYSCHEME_DETAIL_FAIL = "LOYALTYSCHEME_DETAIL_FAIL"
export const LOYALTYSCHEME_SAVE_REQUEST = "LOYALTYSCHEME_SAVE_REQUEST"
export const LOYALTYSCHEME_SAVE_SUCCESS = "LOYALTYSCHEME_SAVE_SUCCESS"
export const LOYALTYSCHEME_SAVE_FAIL = "LOYALTYSCHEME_SAVE_FAIL"
export const LOYALTYSCHEME_UPDATE_REQUEST = "LOYALTYSCHEME_UPDATE_REQUEST"
export const LOYALTYSCHEME_UPDATE_SUCCESS = "LOYALTYSCHEME_UPDATE_SUCCESS"
export const LOYALTYSCHEME_UPDATE_FAIL = "LOYALTYSCHEME_UPDATE_FAIL"
export const LOYALTYSCHEME_DELETE_REQUEST = "LOYALTYSCHEME_DELETE_REQUEST"
export const LOYALTYSCHEME_DELETE_SUCCESS = "LOYALTYSCHEME_DELETE_SUCCESS"
export const LOYALTYSCHEME_DELETE_FAIL = "LOYALTYSCHEME_DELETE_FAIL"

