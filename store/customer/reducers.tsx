import {
    CUSTOMER_SAVE_REQUEST,
    CUSTOMER_SAVE_SUCCESS,
    CUSTOMER_SAVE_FAIL,
    CUSTOMER_DELETE_REQUEST,
    CUSTOMER_DELETE_SUCCESS,
    CUSTOMER_DELETE_FAIL,
    CustomerState,
    CustomerActionsTypes
  } from "./index";
  
  const initialState: CustomerState = {
    customers: [],
    loading: false,
    error: false
  };
  
  export default function customersReducer(
    state: CustomerState = initialState,
    action: CustomerActionsTypes
  ): CustomerState {
    switch (action.type) {
      case CUSTOMER_SAVE_REQUEST:
        return { ...state, loading: true };
  
      case 'GET_CUSTOMERS':
        return {...state, customers : action.payload};

      case CUSTOMER_SAVE_SUCCESS:
        return { ...state, customers: action.payload };
  
      case CUSTOMER_SAVE_FAIL:
        return { ...state, loading: false, error: true };
  
      case CUSTOMER_DELETE_REQUEST:
        return { ...state, loading: true };
  
    //   case CUSTOMER_DELETE_SUCCESS:
    //     let newState = [...state.customers];
    //     newState = newState.filter(user => user.id !== action.payload.id);
    //     return { ...state, customers: [...newState] };
    //   case CUSTOMER_DELETE_FAIL:
    //     return { ...state, loading: false, error: true };
      default:
        return { ...state };
    }
  }

// import {AnyAction} from "redux";
// import {HYDRATE} from "next-redux-wrapper";
// import { CUSTOMER_SAVE_REQUEST, CUSTOMER_SAVE_SUCCESS, CUSTOMER_SAVE_FAIL } from "../actionTypes"
// import ICustomerState from "./index";
// const initialState: ICustomerState = {
//     customerList: []
// };

// export function customersReducer(state: ICustomerState = initialState, action: AnyAction): ICustomerState {
//     switch (action.type) {
//         case HYDRATE:
//             // Attention! This will overwrite client state! Real apps should use proper reconciliation.
//             return {...state};
//         case 'GET_CUSTOMERS':
//             return {...state, customerList : action.payload};
//         default:
//             return state;
//     }
// }

// export const customerSaveReducer = (state = { customer: {} }, action:any) => {
//     switch (action.type) {
//       case CUSTOMER_SAVE_REQUEST:
//         return { loading: true };
//       case CUSTOMER_SAVE_SUCCESS:
//         return { loading: false, success: true, customer: action.payload };
//       case CUSTOMER_SAVE_FAIL:
//         return { loading: false, error: action.payload };
//       default:
//         return state;
//     }
// }
