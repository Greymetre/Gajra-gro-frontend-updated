import {
    LOYALTYSCHEME_SAVE_REQUEST,
    LOYALTYSCHEME_SAVE_SUCCESS,
    LOYALTYSCHEME_SAVE_FAIL,
    LOYALTYSCHEME_DELETE_REQUEST,
    LOYALTYSCHEME_DELETE_SUCCESS,
    LOYALTYSCHEME_DELETE_FAIL,
    ILoyaltySchemeState,
    LoyaltySchemeActionsTypes
  } from "./index";
  
  const initialState: ILoyaltySchemeState = {
    loyaltyscheme: [],
    loading: false,
    error: false
  };
  
  export default function loyaltyschemeReducer(
    state: ILoyaltySchemeState = initialState,
    action: LoyaltySchemeActionsTypes
  ): ILoyaltySchemeState {
    switch (action.type) {
      case LOYALTYSCHEME_SAVE_REQUEST:
        return { ...state, loading: true };
      case 'GET_LOYALTYSCHEMES':
        return {...state, loyaltyscheme : action.payload};

      case LOYALTYSCHEME_SAVE_SUCCESS:
        return { ...state, loyaltyscheme: action.payload };
  
      case LOYALTYSCHEME_SAVE_FAIL:
        return { ...state, loading: false, error: true };
  
      case LOYALTYSCHEME_DELETE_REQUEST:
        return { ...state, loading: true };
      default:
        return { ...state };
    }
  }