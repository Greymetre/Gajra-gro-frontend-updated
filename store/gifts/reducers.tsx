import {
    GIFT_SAVE_REQUEST,
    GIFT_SAVE_SUCCESS,
    GIFT_SAVE_FAIL,
    GIFT_DELETE_REQUEST,
    GIFT_DELETE_SUCCESS,
    GIFT_DELETE_FAIL,
    IGiftState,
    GiftActionsTypes
  } from "./index";
  
  const initialState: IGiftState = {
    gifts: [],
    loading: false,
    error: false
  };
  
  export default function giftsReducer(
    state: IGiftState = initialState,
    action: GiftActionsTypes
  ): IGiftState {
    switch (action.type) {
      case GIFT_SAVE_REQUEST:
        return { ...state, loading: true };
      case 'GET_GIFTS':
        return {...state, gifts : action.payload};

      case GIFT_SAVE_SUCCESS:
        return { ...state, gifts: action.payload };
  
      case GIFT_SAVE_FAIL:
        return { ...state, loading: false, error: true };
  
      case GIFT_DELETE_REQUEST:
        return { ...state, loading: true };
      default:
        return { ...state };
    }
  }