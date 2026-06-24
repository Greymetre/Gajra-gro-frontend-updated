import {AnyAction} from "redux";
import {HYDRATE} from "next-redux-wrapper";
import IAuthUserInfoState from "./index";
const initialState: IAuthUserInfoState = {
    authInfo : {
        id: '',
        firstName : '',
        lastName: '',
        phoneCode : '',
        mobile : 0,
        email : '',
        token : '',
    }
};
export default function authUserReducer(state: IAuthUserInfoState = initialState, action: AnyAction) : IAuthUserInfoState {
    switch (action.type) {
        case HYDRATE:
            return {...state};
        case 'LOGIN_SUCCESS':
            return {...state, authInfo : action.payload};
        default:
            return state;
    }
}