import {createAction} from "typesafe-actions";
import { backendPostAddNewGift} from "../../helpers/backend_helper"
import { Dispatch } from "redux";
import { GiftActionsTypes, GIFT_SAVE_REQUEST, GIFT_SAVE_SUCCESS, GIFT_SAVE_FAIL } from "./index";

export const getGiftList = createAction('GET_GIFTS', resolve => {
    return (giftList: object) => resolve(giftList);
});
