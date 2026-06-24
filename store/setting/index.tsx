import { AxiosResponse } from "axios";
export interface ISettingState {
    setting: any
}

// Define user type
export interface Setting {
  image:string;
}

// Define Different action type
 interface AddSettingAction {
    type: string;
    payload: Setting;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

export interface SettingState {
    setting: any;
    loading: boolean;
    error: boolean;
}
export type SettingActionsTypes = AddSettingAction ;

export const  SETTING_SAVE_REQUEST = "SETTING_SAVE_REQUEST"
export const  SETTING_SAVE_SUCCESS = "SETTING_SAVE_SUCCESS"
export const  SETTING_SAVE_FAIL = "SETTING_SAVE_FAIL"

