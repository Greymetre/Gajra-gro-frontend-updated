import { createAction } from "typesafe-actions";
import { LOGIN_USER, LOGIN_SUCCESS, LOGIN_FAILURE } from "../actionTypes"
import { backendPostAuthLogin } from "../../helpers/backend_helper"
import IUserAuthState from "./index";
import { setLoginAuthToken } from "../../helpers/authHelper"
export const postAuthLogin = (data: any, callback : any) => {
    return (dispatch:any) => {
        dispatch({ type: LOGIN_USER });
        backendPostAuthLogin(data)
            .then(async (response) => {
                if (!response.isError)
                {
                    var user = response.data;
                    setLoginAuthToken(user.token)
                    delete user['token']; 
                    localStorage.setItem('authInfo', JSON.stringify(user));
                    dispatch({ type: LOGIN_SUCCESS, payload : user });
                    callback(user)
                } 
            },
            error => {
                dispatch({ type: LOGIN_FAILURE, error });
            }
        );
    }
}