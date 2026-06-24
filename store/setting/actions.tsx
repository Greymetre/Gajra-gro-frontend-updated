import {createAction} from "typesafe-actions";
import { backendPostAddNewCustomer, backendPostAddsetting} from "../../helpers/backend_helper"
import { Dispatch } from "redux";
import { Setting, SettingActionsTypes,  SETTING_SAVE_REQUEST,  SETTING_SAVE_SUCCESS,  SETTING_SAVE_FAIL } from "./index";

export const getSetting = createAction('GET_SETTING', resolve => {
    return (setting: object) => resolve(setting);
});

export const saveSettingAction = (setting: Setting): SettingActionsTypes => ({
    type: SETTING_SAVE_REQUEST,
    payload: setting,
    subtypes: [SETTING_SAVE_REQUEST, SETTING_SAVE_SUCCESS, SETTING_SAVE_FAIL],
    promise: backendPostAddsetting(setting)
});