import {createAction} from "typesafe-actions";
import { backendPostAddNewOrder} from "../../helpers/backend_helper"
import { Dispatch } from "redux";
import { OrderActionsTypes, ORDER_SAVE_REQUEST, ORDER_SAVE_SUCCESS, ORDER_SAVE_FAIL } from "./index";

export const getOrderList = createAction('GET_ORDER', resolve => {
    return (orderList: object) => resolve(orderList);
});
