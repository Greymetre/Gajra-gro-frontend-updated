import {
    CITY_SAVE_REQUEST,
    CITY_SAVE_SUCCESS,
    CITY_SAVE_FAIL,
    CITY_DELETE_REQUEST,
    CITY_DELETE_SUCCESS,
    CITY_DELETE_FAIL,
    CityState,
    CityActionsTypes,
    
  } from "./index";
  
  const initialState: CityState = {
    city: [],
    loading: false,
    error: false
  };
  
  export default function cityReducer(
    state: CityState = initialState,
    action: CityActionsTypes
  ): CityState {
    switch (action.type) {
      case CITY_SAVE_REQUEST:
        return { ...state, loading: true };
  
      case 'GET_CITIES':
        return {...state, city : action.payload};
      case CITY_SAVE_SUCCESS:
        return { ...state, city: [...state.city, action.payload] };
  
      case CITY_SAVE_FAIL:
        return { ...state, loading: false, error: true };
  
      case CITY_DELETE_REQUEST:
        return { ...state, loading: true };
  
      default:
        return { ...state };
    }
  }