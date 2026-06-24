import {createAction} from "typesafe-actions";

export const getSaleList = createAction('GET_SALE', resolve => {
    return (saleList: object) => resolve(saleList);
});