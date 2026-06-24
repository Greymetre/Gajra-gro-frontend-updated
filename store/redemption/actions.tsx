import {createAction} from "typesafe-actions";

export const getRedemptionList = createAction('GET_REDEMPTIONS', resolve => {
    return (redemptionList: object) => resolve(redemptionList);
});