import {createAction} from "typesafe-actions";
import { backendPostAddNewCountry} from "../../helpers/backend_helper"
import { Dispatch } from "redux";

export const getCountryList = createAction('GET_COUNTRIES', resolve => {
    return (countryList: object) => resolve(countryList);
});
