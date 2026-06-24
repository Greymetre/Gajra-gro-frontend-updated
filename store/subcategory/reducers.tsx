import {
    SUBCATEGORYS_SAVE_REQUEST,
    SUBCATEGORYS_SAVE_SUCCESS,
    SUBCATEGORYS_SAVE_FAIL,
    SUBCATEGORYS_DELETE_REQUEST,
    SUBCATEGORYS_DELETE_SUCCESS,
    SUBCATEGORYS_DELETE_FAIL,
    ISubCategoryState,
    SubCategoryActionsTypes
  } from "./index";
  
  const initialState: ISubCategoryState = {
    subcategory: [],
    loading: false,
    error: false
  };
  
  export default function subcategoryReducer(
    state: ISubCategoryState = initialState,
    action: SubCategoryActionsTypes
  ): ISubCategoryState {
    switch (action.type) {
      case SUBCATEGORYS_SAVE_REQUEST:
        return { ...state, loading: true };
      case 'GET_SUBCATEGORYS':
        return {...state,  subcategory : action.payload};

      case SUBCATEGORYS_SAVE_SUCCESS:
        return { ...state,  subcategory: action.payload };
  
      case SUBCATEGORYS_SAVE_FAIL:
        return { ...state, loading: false, error: true };
  
      case SUBCATEGORYS_DELETE_REQUEST:
        return { ...state, loading: true };
      default:
        return { ...state };
    }
  }