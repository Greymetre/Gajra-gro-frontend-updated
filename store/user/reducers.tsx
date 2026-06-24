import {AnyAction} from "redux";
import {HYDRATE} from "next-redux-wrapper";
import IUserState from "./index";
const initialState: IUserState = {
    userList: []
};
export default function usersReducer(state: IUserState = initialState, action: AnyAction): IUserState {
    switch (action.type) {
        case HYDRATE:
            // Attention! This will overwrite client state! Real apps should use proper reconciliation.
            return {...state};
        case 'GET_USERS':
            return {...state, userList : action.payload};
        default:
            return state;
    }
}