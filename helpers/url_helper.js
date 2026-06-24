//Auth Routes
export const POST_AUTH_LOGIN = "/user/auth/login";
export const POST_AUTH_MOBILEEXISTS = "/user/auth/mobileExists";
export const POST_AUTH_EMAILEXISTS = "/user/auth/emailExists";
export const POST_AUTH_FORGOTPASSWORD = "/user/auth/forgotPassword";
export const POST_AUTH_CHANGEPASSWORD = "/user/auth/changePassword";
export const POST_AUTH_RESETPASSWORD = "/user/auth/resetPassword";
export const POST_AUTH_NEWOTPREQUEST = "/user/auth/newOtpRequest";
export const POST_AUTH_RESENDOTPREQUEST = "/user/auth/resendOtpRequest";

//User Routes
export const MODULE_USERS = "/user/users";
export const POST_USER_STATUS = "/user/users/updateStatus";
export const GET_USER_DROPDOWN_LIST = "/user/users/dropdown";
//Customers Routes
export const MODULE_CUSTOMER = "/user/customers";
export const POST_CUSTOMER_STATUS = "/user/customers/updateStatus";
export const GET_CUSTOMER_DROPDOWN_LIST = "/user/customers/dropdown";
export const GET_CUSTOMER_DROPDOWN_ = "/remark";

export const GET_ALL_CUSTOMER = "/user/customers/all";
export const GET_CUSTOMER_BANKINFO = "/user/customers/getCustomerBankInfo";
export const GET_CUSTOMER_BALANCE = "/user/redemptions/getCustomerBalance";
export const CUSTOMER_BANK_ACCOUNT_VERIFIED =
  "/user/customers/bankAccountVerified";
export const CUSTOMER_UPI_VERIFIED = "/user/customers/upiVerified";
export const CUSTOMER_CLEAR_BANK_DETAIL = "/user/customers/clearBankInfo";
export const CUSTOMER_CLEAR_UPI_DETAIL = "/user/customers/clearUpiInfo";
export const CUSTOMER_KYC_VERIFIED = "/user/customers/kycVerified";
export const CUSTOMER_KYC_REJECTED = "/user/customers/kycRejected";
export const CUSTOMER_LIST_STATUS = "/user/customers/status";
export const CUSTOMER_PENDING_PAYEELIST = "/user/customers/pendingPayee";
export const CUSTOMER_USER_ASSIGN = "/user/customers/userAssign";
export const CUSTOMER_IMPORT = "/user/customers/importCustomers";
export const CUSTOMER_KYC_UPDATE = "/user/customers/kycUpdate";

//Beat Routes
export const MODULE_BEAT = "/user/customers";
export const POST_BEAT_STATUS = "/user/customers/updateStatus";
//Beat Schedules Routes
export const MODULE_BEATSCHEDULES = "/user/beatschedules";
export const POST_BEATSCHEDULES_STATUS = "/user/beatschedules/updateStatus";
//Category Routes
export const MODULE_CATEGORY = "/user/category";
export const POST_CATEGORY_STATUS = "/user/category/updateStatus";
export const GET_CATEGORY_DROPDOWNLIST = "/user/category/dropdown";
export const GET_CATEGORY_INFO = "/user/category/info";
//SubCategory Routes
export const MODULE_SUBCATEGORY = "/user/subcategory";
export const POST_SUBCATEGORY_STATUS = "/user/subcategory/updateStatus";
export const GET_SUBCATEGORY_DROPDOWNLIST = "/user/subcategory";
//Product Routes
export const MODULE_PRODUCT = "/user/products";
export const POST_PRODUCT_STATUS = "/user/products/updateStatus";
export const POST_IMPORT_PRODUCTS = "/user/products/importProducts";
export const GET_ALL_PRODUCTS = "/user/products/all";
export const GET_PRODUCTS_DROPDOWN = "/user/products/dropdown";
//Gift Routes
export const MODULE_GIFT = "/user/gift";
export const POST_GIFT_STATUS = "/user/gift/updateStatus";

//Country Routes
export const MODULE_COUNTRY = "/user/country";
export const POST_COUNTRY_STATUS = "/user/country/updateStatus";
export const GET_COUNTRY_CODES = "/user/country/getCountryCodes";
export const GET_COUNTRY_DROPDOWN = "/user/address";
//States Routes
export const MODULE_STATES = "/user/states";
export const POST_STATES_STATUS = "/user/states/updateStatus";
export const POST_COUNTRY_STATELIST = "/user/address/getStates";
export const POST_REMARK_ = "/remark";

//City Routes
export const MODULE_CITY = "/user/city";
export const GET_ALLCITY = "/user/city/all";
export const POST_CITY_STATUS = "/user/city/updateStatus";
export const POST_STATE_CITYLIST = "/user/city/getStateCities";
//Attendance Routes
export const MODULE_ATTENDANCE = "/user/attendances";
export const POST_ATTENDANCE_STATUS = "/user/attendances/updateStatus";
//Customervisit Routes
export const MODULE_CUSTOMERVISIT = "/user/customervisit";
export const POST_CUSTOMERVISIT_STATUS = "/user/customervisit/updateStatus";
//Loyalty Scheme Routes
export const MODULE_LOYALTYSCHEME = "/user/loyaltyscheme";
export const POST_LOYALTYSCHEME_STATUS = "/user/loyaltyscheme/updateStatus";
export const GET_LOYALTYSCHEME_DROPDOWN_LIST = "/user/loyaltyscheme";
//Notification Routes
export const MODULE_NOTIFICATION = "/user/notifications";
export const POST_NOTIFICATION_STATUS = "/user/notifications/updateStatus";
//Shopping Cart Routes
export const MODULE_SHOPPINGCART = "/user/shoppingcart";
export const POST_SHOPPINGCART_STATUS = "/user/shoppingcart/updateStatus";
//Order Routes
export const MODULE_ORDER = "/user/orders";
export const POST_ORDER_STATUS = "/user/orders/updateStatus";
//Sales Routes
export const MODULE_SALES = "/user/sales";
export const POST_SALES_STATUS = "/user/sales/updateStatus";

//Survey Questions Routes
export const MODULE_SURVEYQUESTION = "/user/surveyquestions";
export const POST_SURVEYQUESTION_STATUS = "/user/surveyquestions/updateStatus";
//Transactions Routes
export const MODULE_TRANSACTION = "/user/transactions";
export const POST_TRANSACTION_STATUS = "/user/transactions/updateStatus";
export const POST_SCANED_QRCODE = "/user/transactions/couponScans";
export const GET_ALL_TRANSACTIONS = "/user/transactions/all";
export const CUSTOMER_ALL_TRANSACTIONS = "/user/transactions/customer";
export const POST_IMPORT_COUPONS_SCAN = "/user/transactions/importCouponScan";
export const POST_IMPORT_TRANSACTIONS =
  "/user/transactions/importCRTransactions";

//Redemption Routes
export const MODULE_REDEMPTION = "/user/redemptions";
export const GET_ALL_REDEMPTION = "/user/redemptions/all";
export const APPROVERD_REDEMPTION = "/user/redemptions/approvedRedemption";
export const REJECT_REDEMPTION = "/user/redemptions/rejectRedemption";
export const TRANSFERED_REDEMPTION = "/user/redemptions/transferRedemption";
export const CREATE_NEFT_REDEMPTION = "/user/redemptions/neftRedemption";
export const CREATE_UPI_REDEMPTION = "/user/redemptions/upiRedemption";
export const CUSTOMER_ALL_REDEMPTIONS = "/user/redemptions/customer";
export const REDEMPTION_BULKSTATUS_CHANGE =
  "/user/redemptions/bulkStatusChange";
export const GET_PENDING_REDEMPTIONS =
  "/user/redemptions/getPendingRedemptions";
//Coupons Routes
export const MODULE_COUPONS = "/user/coupons";
export const MODULE_COUPONS_IMPORT = "/user/coupons/couponMultipleImport";
export const MODULE_COUPONS_EXPORT_ALL = "/user/coupons/export-all";



export const MODULE_DAMAGEQR = "/user/transactions/allInvalidCoupon";
export const MODULE_DAMAGEQRPRODUCT = "/user/transactions/productDropdown";
export const MODULE_APPROVEDQR = "/user/transactions/updateCouponStatus";
export const MODULE_ADDDAMAGEENTRIES = "/loyalty/transactions/add-invalid";
export const MODULE_ADDDAMAGEENTRIESINTOTRANSACTION = "/loyalty/transactions/coupon-scan-by-admin";







//Settings
export const BANNER_IMAGEUPLOAD = "/user/setting/uploadBannerImages";
export const MODULE_SETTING = "/user/setting";
export const GET_CATEGORY_PRODUCTS = "/products";
export const GET_CUSTOMERTYPE_LIST = "/user/setting/getCustomerType";
export const GET_REMARK_LIST = "/remark";
export const POST_REMARK = "/remark";

export const GET_REDEEMTYPES_LIST = "/user/setting/getRedeemTypes";
export const GET_REJECT_REASON = "/user/setting/getRejectReason";
export const GET_USER_ROLES = "/user/setting/getRoles";
export const GET_SCHEME_TYPES = "/user/setting/getSchemeType";
export const GET_SCHEME_BASEDON = "/user/setting/getSchemeBasedOn";
export const GET_USER_PERMISSIONS = "/user/setting/getPermissions";
export const GET_PERMISSIONS = "/user/setting/permissions";
export const UPDATE_ROLE_PERMISSIONS = "/user/setting/updatePermission";
export const GET_ROLE_PERMISSIONS = "/user/setting/getRolePermissions";
export const GET_CALLTYPES = "/user/setting/getCallTypes";
export const GET_CALLSTATUS = "/user/setting/getCallStatus";
export const REMOVE_BANNER_IMAGE = "/user/setting/removeBannerImage";


export const UPDATE_YOUTUBE_SHORTS =
  "/user/setting/youtube-shorts";

export const GET_YOUTUBE_SHORTS =
  "/user/setting/youtube-shorts";

  
//Download Files
export const COUPON_PROFILE_EXPORT = "/user/coupons/couponProfileExport";

export const COUPON_SEARCH = "/user/coupons/search";
//Dashboard Data
export const GET_DASHBOARD_DATA = "/user/dashboard";

//Reports
export const GET_OTPLOG_REPORTS = "/user/customers/getOtpLog";

//Product Routes
export const MODULE_CALLSUMMARY = "/user/callcenter";
export const MODULE_CALLSUMMARY_ALL = "/user/callcenter/all";
export const CUSTOMER_CALLSUMMARY = "/user/callcenter/customer";
export const POST_IMPORT_CALLSUMMARY = "/user/callcenter/import";

//Loyalty Module Routes
export const GET_NEWOTP_REQUEST = "/loyalty/auth/newOtpRequest";
export const REPLACE_PACKAGE_NUMBER = "/user/coupons/replacePackingSlip";

