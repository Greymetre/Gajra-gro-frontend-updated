import {createAction} from "typesafe-actions";
import { backendPostAddNewLoyaltyScheme} from "../../helpers/backend_helper"
import { Dispatch } from "redux";
import { LoyaltySchemeActionsTypes, LOYALTYSCHEME_SAVE_REQUEST, LOYALTYSCHEME_SAVE_SUCCESS, LOYALTYSCHEME_SAVE_FAIL } from "./index";

export const getLoyaltySchemeList = createAction('GET_LOYALTYSCHEMES', resolve => {
    return (loyaltyschemeList: object) => resolve(loyaltyschemeList);
});
