import {
    CUSTOMERVISIT_SAVE_REQUEST,
    CUSTOMERVISIT_SAVE_SUCCESS,
    CUSTOMERVISIT_SAVE_FAIL,
    CUSTOMERVISIT_DELETE_REQUEST,
    CUSTOMERVISIT_DELETE_SUCCESS,
    CUSTOMERVISIT_DELETE_FAIL,
    CustomerVisitState,
    CustomerVisitActionsTypes
  } from "./index";
  
  const initialState: CustomerVisitState = {
    customervisit: [],
    loading: false,
    error: false
  };
  
  export default function customerVisitReducer(
    state: CustomerVisitState = initialState,
    action: CustomerVisitActionsTypes
  ): CustomerVisitState {
    switch (action.type) {
      case CUSTOMERVISIT_SAVE_REQUEST:
        return { ...state, loading: true };
  
      case 'GET_CUSTOMERS':
        return {...state, customervisit : action.payload};

      case CUSTOMERVISIT_SAVE_SUCCESS:
        return { ...state, customervisit: action.payload };
  
      case CUSTOMERVISIT_SAVE_FAIL:
        return { ...state, loading: false, error: true };
  
      case CUSTOMERVISIT_DELETE_REQUEST:
        return { ...state, loading: true };
  
    //   case CUSTOMERVISIT_DELETE_SUCCESS:
    //     let newState = [...state.customervisit];
    //     newState = newState.filter(user => user.id !== action.payload.id);
    //     return { ...state, customervisit: [...newState] };
    //   case CUSTOMERVISIT_DELETE_FAIL:
    //     return { ...state, loading: false, error: true };
      default:
        return { ...state };
    }
  }

// import {AnyAction} from "redux";
// import {HYDRATE} from "next-redux-wrapper";
// import { CUSTOMERVISIT_SAVE_REQUEST, CUSTOMERVISIT_SAVE_SUCCESS, CUSTOMERVISIT_SAVE_FAIL } from "../actionTypes"
// import ICustomerVisitState from "./index";
// const initialState: ICustomerVisitState = {
//     customerList: []
// };

// export function customervisitReducer(state: ICustomerVisitState = initialState, action: AnyAction): ICustomerVisitState {
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
//       case CUSTOMERVISIT_SAVE_REQUEST:
//         return { loading: true };
//       case CUSTOMERVISIT_SAVE_SUCCESS:
//         return { loading: false, success: true, customer: action.payload };
//       case CUSTOMERVISIT_SAVE_FAIL:
//         return { loading: false, error: action.payload };
//       default:
//         return state;
//     }
// }