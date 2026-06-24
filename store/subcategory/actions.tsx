import {createAction} from "typesafe-actions";
import { backendPostAddNewSubCategory} from "../../helpers/backend_helper"
import { Dispatch } from "redux";
import { SubCategoryActionsTypes,SUBCATEGORYS_SAVE_REQUEST, SUBCATEGORYS_SAVE_SUCCESS, SUBCATEGORYS_SAVE_FAIL } from "./index";

export const getLoyaltySchemeList = createAction('GET_SUBCATEGORYS', resolve => {
    return (subcategoryList: object) => resolve(subcategoryList);
});
