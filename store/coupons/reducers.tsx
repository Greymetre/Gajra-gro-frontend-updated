import {
  COUPON_SAVE_REQUEST,
  COUPON_SAVE_SUCCESS,
  COUPON_SAVE_FAIL,
  COUPON_DELETE_REQUEST,
  COUPON_DELETE_SUCCESS,
  COUPON_DELETE_FAIL,
  ICouponState,
  CouponActionsTypes
} from "./index";

const initialState: ICouponState = {
  coupons: [],
  loading: false,
  error: false
};

export default function couponsReducer(
  state: ICouponState = initialState,
  action: CouponActionsTypes
): ICouponState {
  switch (action.type) {
    case COUPON_SAVE_REQUEST:
      return { ...state, loading: true };
    case 'GET_COUPONS':
      return {...state, coupons : action.payload};

    case COUPON_SAVE_SUCCESS:
      return { ...state, coupons: action.payload };

    case COUPON_SAVE_FAIL:
      return { ...state, loading: false, error: true };

    case COUPON_DELETE_REQUEST:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
}