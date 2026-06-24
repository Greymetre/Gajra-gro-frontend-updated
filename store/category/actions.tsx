import {createAction} from "typesafe-actions";
import { backendPostAddNewCategory} from "../../helpers/backend_helper"
import { Dispatch } from "redux";
import { CategoryActionsTypes, CATEGORY_SAVE_REQUEST, CATEGORY_SAVE_SUCCESS, CATEGORY_SAVE_FAIL } from "./index";

export const getCategoryList = createAction('GET_CATEGORY', resolve => {
    return (categoryList: object) => resolve(categoryList);
});
