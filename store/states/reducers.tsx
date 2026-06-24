import {
    STATES_SAVE_REQUEST,
    STATES_SAVE_SUCCESS,
    STATES_SAVE_FAIL,
    STATES_DELETE_REQUEST,
    STATES_DELETE_SUCCESS,
    STATES_DELETE_FAIL,
    StatesState,
    StatesActionsTypes,
    
  } from "./index";
  
  const initialState: StatesState = {
    states: [],
    loading: false,
    error: false
  };
  
  export default function statesReducer(
    state: StatesState = initialState,
    action: StatesActionsTypes
  ): StatesState {
    switch (action.type) {
      case STATES_SAVE_REQUEST:
        return { ...state, loading: true };
  
      case 'GET_STATES':
        return {...state, states : action.payload};
      case STATES_SAVE_SUCCESS:
        return { ...state, states: [...state.states, action.payload] };
  
      case STATES_SAVE_FAIL:
        return { ...state, loading: false, error: true };
  
      case STATES_DELETE_REQUEST:
        return { ...state, loading: true };
  
      default:
        return { ...state };
    }
  }