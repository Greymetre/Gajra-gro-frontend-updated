import { PermissionState, PermissionActionsTypes } from "./index";
  const initialState: PermissionState = {
    permission: [],
    loading: false,
    error: false
  };
  
  export default function permissionReducer(
    state: PermissionState = initialState,
    action: PermissionActionsTypes
  ): PermissionState {
    switch (action.type) {
      case 'GET_PERMISSION':
        return {...state, permission : action.payload};
      default:
        return { ...state };
    }
  }

