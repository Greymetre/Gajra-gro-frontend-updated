import {createAction} from "typesafe-actions";

export const getCouponList = createAction('GET_COUPONS', resolve => {
    return (couponList: object) => resolve(couponList);
});