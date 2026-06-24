import {createAction} from "typesafe-actions";
import { backendPostAddNewCustomer} from "../../helpers/backend_helper"
import { Dispatch } from "redux";
import { Customer, CustomerActionsTypes, CUSTOMER_SAVE_REQUEST, CUSTOMER_SAVE_SUCCESS, CUSTOMER_SAVE_FAIL } from "./index";

export const getCustomerList = createAction('GET_CUSTOMERS', resolve => {
    return (customerList: object) => resolve(customerList);
});

export const saveCustomerAction = (customer: Customer): CustomerActionsTypes => ({
    type: CUSTOMER_SAVE_REQUEST,
    payload: customer,
    subtypes: [CUSTOMER_SAVE_REQUEST, CUSTOMER_SAVE_SUCCESS, CUSTOMER_SAVE_FAIL],
    promise: backendPostAddNewCustomer(customer)
});

// = (customer:any) => async (dispatch:any, getState:any) => {
//     try {
//       dispatch({ type: CUSTOMER_SAVE_REQUEST, payload: customer });
//         await backendPostAddNewCustomer(customer).then(async (response) => {
//             if (!response.isError)
//             {
//                 dispatch({ type: CUSTOMER_SAVE_SUCCESS, payload: response.data });
//             }
//             else{
//                 dispatch({ type: CUSTOMER_SAVE_FAIL, payload: response.message });
//             } 
//         },
//         error => {
//             dispatch({ type: CUSTOMER_SAVE_FAIL, payload: error });
//         });
//     } catch (error) {
//         dispatch({ type: CUSTOMER_SAVE_FAIL, payload: error });
//     }
//   };