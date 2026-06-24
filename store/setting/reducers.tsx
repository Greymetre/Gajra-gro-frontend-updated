import {
    SETTING_SAVE_REQUEST,
    SETTING_SAVE_SUCCESS,
    SETTING_SAVE_FAIL,
   
    SettingState,
    SettingActionsTypes
  } from "./index";
  
  const initialState: SettingState = {
    setting: [],
    loading: false,
    error: false
  };
  
  export default function settingReducer(
    state: SettingState = initialState,
    action: SettingActionsTypes
  ): SettingState {
    switch (action.type) {
      case  SETTING_SAVE_REQUEST:
        return { ...state, loading: true };
  
      case 'GET_ SETTING':
        return {...state, setting : action.payload};
        
      case 'GET_PERMISSIONS':
        return {...state, setting : action.payload};

      case  SETTING_SAVE_SUCCESS:
        return { ...state, setting: action.payload };
  
      case  SETTING_SAVE_FAIL:
        return { ...state, loading: false, error: true };
  
  
  
   
      default:
        return { ...state };
    }
  }

