import {
    CATEGORY_SAVE_REQUEST,
    CATEGORY_SAVE_SUCCESS,
    CATEGORY_SAVE_FAIL,
    CATEGORY_DELETE_REQUEST,
    CATEGORY_DELETE_SUCCESS,
    CATEGORY_DELETE_FAIL,
    ICategoryState,
    CategoryActionsTypes
  } from "./index";
  
  const initialState: ICategoryState = {
    categorys: [],
    loading: false,
    error: false
  };
  
  export default function categorysReducer(
    state: ICategoryState = initialState,
    action: CategoryActionsTypes
  ): ICategoryState {
    switch (action.type) {
      case CATEGORY_SAVE_REQUEST:
        return { ...state, loading: true };
      case 'GET_CATEGORY':
        return {...state, categorys : action.payload};

      case CATEGORY_SAVE_SUCCESS:
        return { ...state, categorys: action.payload };
  
      case CATEGORY_SAVE_FAIL:
        return { ...state, loading: false, error: true };
  
      case CATEGORY_DELETE_REQUEST:
        return { ...state, loading: true };
      default:
        return { ...state };
    }
  }