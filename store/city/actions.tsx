import {createAction} from "typesafe-actions";
import { backendPostAddNewCity} from "../../helpers/backend_helper"
import { Dispatch } from "redux";

export const getCityList = createAction('GET_CITIES', resolve => {
    return (cityList: object) => resolve(cityList);
});
