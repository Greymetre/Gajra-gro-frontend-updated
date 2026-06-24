import {createAction} from "typesafe-actions";
import { backendPostAddNewCustomer} from "../../helpers/backend_helper"
import { Dispatch } from "redux";
import { CUSTOMERVISIT_SAVE_REQUEST, CUSTOMERVISIT_SAVE_SUCCESS, CUSTOMERVISIT_SAVE_FAIL } from "./index";

export const getCustomerList = createAction('GET_CUSTOMERS', resolve => {
    return (customerList: object) => resolve(customerList);
});
