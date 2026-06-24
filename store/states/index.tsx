import { AxiosResponse } from "axios";
export interface IStatesState {
    statesList: object
}


// Define user type
export interface States {
    _id: string;
    stateName: string;
    iso: string;
    phoneCode : string ;
    currency : string;
    timezones : string;
    flag : string;
    active : boolean;
}

// Define Different action type
 interface AddStatesAction {
    type: string;
    payload: any;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

interface DeleteStatesAction {
    type: string;
    payload: States;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

export interface StatesState {
    states: States[];
    loading: boolean;
    error: boolean;
}
export type StatesActionsTypes = AddStatesAction | DeleteStatesAction;
export const STATES_LIST_REQUEST = "STATES_LIST_REQUEST"
export const STATES_LIST_SUCCESS = "STATES_LIST_SUCCESS"
export const STATES_LIST_FAIL = "STATES_LIST_FAIL"
export const STATES_DETAIL_REQUEST = "STATES_DETAIL_REQUEST"
export const STATES_DETAIL_SUCCESS = "STATES_DETAIL_SUCCESS"
export const STATES_DETAIL_FAIL = "STATES_DETAIL_FAIL"
export const STATES_SAVE_REQUEST = "STATES_SAVE_REQUEST"
export const STATES_SAVE_SUCCESS = "STATES_SAVE_SUCCESS"
export const STATES_SAVE_FAIL = "STATES_SAVE_FAIL"
export const STATES_UPDATE_REQUEST = "STATES_UPDATE_REQUEST"
export const STATES_UPDATE_SUCCESS = "STATES_UPDATE_SUCCESS"
export const STATES_UPDATE_FAIL = "STATES_UPDATE_FAIL"
export const STATES_DELETE_REQUEST = "STATES_DELETE_REQUEST"
export const STATES_DELETE_SUCCESS = "STATES_DELETE_SUCCESS"
export const STATES_DELETE_FAIL = "STATES_DELETE_FAIL"

