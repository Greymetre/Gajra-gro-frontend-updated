import {createAction} from "typesafe-actions";

export const getUserList = createAction('GET_USERS', resolve => {
    return (userList: object) => resolve(userList);
});