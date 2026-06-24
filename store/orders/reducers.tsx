import {
    ORDER_SAVE_REQUEST,
    ORDER_SAVE_SUCCESS,
    ORDER_SAVE_FAIL,
    ORDER_DELETE_REQUEST,
    ORDER_DELETE_SUCCESS,
    ORDER_DELETE_FAIL,
    IOrderState,
    OrderActionsTypes
  } from "./index";
  
  const initialState: IOrderState = {
    orders: [],
    loading: false,
    error: false
  };
  
  export default function ordersReducer(
    state: IOrderState = initialState,
    action: OrderActionsTypes
  ): IOrderState {
    switch (action.type) {
      case ORDER_SAVE_REQUEST:
        return { ...state, loading: true };
      case 'GET_ORDER':
        return {...state, orders : action.payload};

      case ORDER_SAVE_SUCCESS:
        return { ...state, orders: action.payload };
  
      case ORDER_SAVE_FAIL:
        return { ...state, loading: false, error: true };
  
      case ORDER_DELETE_REQUEST:
        return { ...state, loading: true };
      default:
        return { ...state };
    }
  }