import {createAction} from "typesafe-actions";
import { backendPostAddNewProduct} from "../../helpers/backend_helper"
import { Dispatch } from "redux";
import { ProductActionsTypes, PRODUCT_SAVE_REQUEST, PRODUCT_SAVE_SUCCESS, PRODUCT_SAVE_FAIL } from "./index";

export const getProductList = createAction('GET_PRODUCTS', resolve => {
    return (productList: object) => resolve(productList);
});
