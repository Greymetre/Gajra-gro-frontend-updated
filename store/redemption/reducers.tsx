import {
    REDEMPTION_SAVE_REQUEST,
    REDEMPTION_SAVE_SUCCESS,
    REDEMPTION_SAVE_FAIL,
    REDEMPTION_DELETE_REQUEST,
    REDEMPTION_DELETE_SUCCESS,
    REDEMPTION_DELETE_FAIL,
    IRedemptionState,
    RedemptionActionsTypes
  } from "./index";
  
  const initialState: IRedemptionState = {
    redemptions: [],
    loading: false,
    error: false
  };
  
  export default function redemptionsReducer(
    state: IRedemptionState = initialState,
    action: RedemptionActionsTypes
  ): IRedemptionState {
    switch (action.type) {
      case REDEMPTION_SAVE_REQUEST:
        return { ...state, loading: true };
      case 'GET_REDEMPTIONS':
        return {...state, redemptions : action.payload};

      case REDEMPTION_SAVE_SUCCESS:
        return { ...state, redemptions: action.payload };
  
      case REDEMPTION_SAVE_FAIL:
        return { ...state, loading: false, error: true };
  
      case REDEMPTION_DELETE_REQUEST:
        return { ...state, loading: true };
      default:
        return { ...state };
    }
  }