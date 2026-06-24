import {createAction} from "typesafe-actions";
export const getPermission = createAction('GET_PERMISSION', resolve => {
    return (permission: object) => resolve(permission);
});