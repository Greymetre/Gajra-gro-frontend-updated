import { AxiosResponse } from "axios";
export interface ICityState {
    cityList: object
}


// Define user type
export interface City {
    _id: string;
    cityName: string;
    iso: string;
    phoneCode : string ;
    pincode :string[] ;
    currency : string;
    timezones : string;
    flag : string;
    active : boolean;
}

// Define Different action type
 interface AddCityAction {
    type: string;
    payload: any;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

interface DeleteCityAction {
    type: string;
    payload: City;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

export interface CityState {
    city: City[];
    loading: boolean;
    error: boolean;
}
export type CityActionsTypes = AddCityAction | DeleteCityAction;
export const CITY_LIST_REQUEST = "CITY_LIST_REQUEST"
export const CITY_LIST_SUCCESS = "CITY_LIST_SUCCESS"
export const CITY_LIST_FAIL = "CITY_LIST_FAIL"
export const CITY_DETAIL_REQUEST = "CITY_DETAIL_REQUEST"
export const CITY_DETAIL_SUCCESS = "CITY_DETAIL_SUCCESS"
export const CITY_DETAIL_FAIL = "CITY_DETAIL_FAIL"
export const CITY_SAVE_REQUEST = "CITY_SAVE_REQUEST"
export const CITY_SAVE_SUCCESS = "CITY_SAVE_SUCCESS"
export const CITY_SAVE_FAIL = "CITY_SAVE_FAIL"
export const CITY_UPDATE_REQUEST = "CITY_UPDATE_REQUEST"
export const CITY_UPDATE_SUCCESS = "CITY_UPDATE_SUCCESS"
export const CITY_UPDATE_FAIL = "CITY_UPDATE_FAIL"
export const CITY_DELETE_REQUEST = "CITY_DELETE_REQUEST"
export const CITY_DELETE_SUCCESS = "CITY_DELETE_SUCCESS"
export const CITY_DELETE_FAIL = "CITY_DELETE_FAIL"

