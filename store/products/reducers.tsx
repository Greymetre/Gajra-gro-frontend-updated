import {
    PRODUCT_SAVE_REQUEST,
    PRODUCT_SAVE_SUCCESS,
    PRODUCT_SAVE_FAIL,
    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL,
    IProductState,
    ProductActionsTypes
  } from "./index";
  
  const initialState: IProductState = {
    products: [],
    loading: false,
    error: false
  };
  
  export default function productsReducer(
    state: IProductState = initialState,
    action: ProductActionsTypes
  ): IProductState {
    switch (action.type) {
      case PRODUCT_SAVE_REQUEST:
        return { ...state, loading: true };
      case 'GET_PRODUCTS':
        return {...state, products : action.payload};

      case PRODUCT_SAVE_SUCCESS:
        return { ...state, products: action.payload };
  
      case PRODUCT_SAVE_FAIL:
        return { ...state, loading: false, error: true };
  
      case PRODUCT_DELETE_REQUEST:
        return { ...state, loading: true };
      default:
        return { ...state };
    }
  }