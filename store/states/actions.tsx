import {createAction} from "typesafe-actions";
import { backendPostAddNewState} from "../../helpers/backend_helper"
import { Dispatch } from "redux";

export const getStatesList = createAction('GET_STATES', resolve => {
    return (statesList: object) => resolve(statesList);
});
