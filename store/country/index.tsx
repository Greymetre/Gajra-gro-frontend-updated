import { AxiosResponse } from "axios";
export interface ICountryState {
    countryList: object
}


// Define user type
export interface Country {
    _id: string;
    countryName: string;
    iso: string;
    phoneCode : string ;
    currency : string;
    timezones : string;
    flag : string;
    active : boolean;
}

// Define Different action type
 interface AddCountryAction {
    type: string;
    payload: any;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

interface DeleteCountryAction {
    type: string;
    payload: Country;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

export interface CountryState {
    country: Country[];
    loading: boolean;
    error: boolean;
}
export type CountryActionsTypes = AddCountryAction | DeleteCountryAction;
export const COUNTRY_LIST_REQUEST = "COUNTRY_LIST_REQUEST"
export const COUNTRY_LIST_SUCCESS = "COUNTRY_LIST_SUCCESS"
export const COUNTRY_LIST_FAIL = "COUNTRY_LIST_FAIL"
export const COUNTRY_DETAIL_REQUEST = "COUNTRY_DETAIL_REQUEST"
export const COUNTRY_DETAIL_SUCCESS = "COUNTRY_DETAIL_SUCCESS"
export const COUNTRY_DETAIL_FAIL = "COUNTRY_DETAIL_FAIL"
export const COUNTRY_SAVE_REQUEST = "COUNTRY_SAVE_REQUEST"
export const COUNTRY_SAVE_SUCCESS = "COUNTRY_SAVE_SUCCESS"
export const COUNTRY_SAVE_FAIL = "COUNTRY_SAVE_FAIL"
export const COUNTRY_UPDATE_REQUEST = "COUNTRY_UPDATE_REQUEST"
export const COUNTRY_UPDATE_SUCCESS = "COUNTRY_UPDATE_SUCCESS"
export const COUNTRY_UPDATE_FAIL = "COUNTRY_UPDATE_FAIL"
export const COUNTRY_DELETE_REQUEST = "COUNTRY_DELETE_REQUEST"
export const COUNTRY_DELETE_SUCCESS = "COUNTRY_DELETE_SUCCESS"
export const COUNTRY_DELETE_FAIL = "COUNTRY_DELETE_FAIL"

