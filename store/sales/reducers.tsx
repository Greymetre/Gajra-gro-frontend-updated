import {
    SALE_SAVE_REQUEST,
    SALE_SAVE_SUCCESS,
    SALE_SAVE_FAIL,
    SALE_DELETE_REQUEST,
    SALE_DELETE_SUCCESS,
    SALE_DELETE_FAIL,
    ISaleState,
    SaleActionsTypes
  } from "./index";
  
  const initialState: ISaleState = {
    sales: [],
    loading: false,
    error: false
  };
  
  export default function salesReducer(
    state: ISaleState = initialState,
    action: SaleActionsTypes
  ): ISaleState {
    switch (action.type) {
      case SALE_SAVE_REQUEST:
        return { ...state, loading: true };
      case 'GET_SALE':
        return {...state, sales : action.payload};

      case SALE_SAVE_SUCCESS:
        return { ...state, sales: action.payload };
  
      case SALE_SAVE_FAIL:
        return { ...state, loading: false, error: true };
  
      case SALE_DELETE_REQUEST:
        return { ...state, loading: true };
      default:
        return { ...state };
    }
  }