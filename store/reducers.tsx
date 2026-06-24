import { combineReducers } from "redux";
import customers from "./customer/reducers";
import users from "./user/reducers";
import authUserInfo from "./login/reducers";
import country from "./country/reducers";
import states from "./states/reducers";
import city from "./city/reducers";
import products from "./products/reducers";
import gifts from "./gifts/reducers";
import loyaltyscheme from "./loyaltyscheme/reducers";
import transactions from "./transaction/reducers";
import redemptions from "./redemption/reducers";
import coupons from "./coupons/reducers";
import setting from "./setting/reducers";
import orders from "./orders/reducers";
import sales from "./sales/reducers";
import categorys from "./category/reducers";
import subcategory from "./subcategory/reducers";
import permission from "./permission/reducers";
 export default combineReducers({
    customers,
    users,
    authUserInfo,
    country,
    states,
    city,
    products,
    orders,
    sales,
    categorys,
    subcategory,
    gifts,
    loyaltyscheme,
    transactions,
    redemptions,
    coupons,
    setting,
    permission
});