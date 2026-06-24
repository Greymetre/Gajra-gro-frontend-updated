import {
    COUNTRY_SAVE_REQUEST,
    COUNTRY_SAVE_SUCCESS,
    COUNTRY_SAVE_FAIL,
    COUNTRY_DELETE_REQUEST,
    COUNTRY_DELETE_SUCCESS,
    COUNTRY_DELETE_FAIL,
    CountryState,
    CountryActionsTypes,
    
  } from "./index";
  
  const initialState: CountryState = {
    country: [],
    loading: false,
    error: false
  };
  
  export default function countryReducer(
    state: CountryState = initialState,
    action: CountryActionsTypes
  ): CountryState {
    switch (action.type) {
      case COUNTRY_SAVE_REQUEST:
        return { ...state, loading: true };
  
      case 'GET_COUNTRIES':
        return {...state, country : action.payload};
      case COUNTRY_SAVE_SUCCESS:
        return { ...state, country: [...state.country, action.payload] };
  
      case COUNTRY_SAVE_FAIL:
        return { ...state, loading: false, error: true };
  
      case COUNTRY_DELETE_REQUEST:
        return { ...state, loading: true };
  
      default:
        return { ...state };
    }
  }