import { post, del, get, put, patch, submitFormData } from "./api_helper";
import * as url from "./url_helper";

/*========== Auth Module ===============*/
// Login Method
export const backendPostAuthLogin = (data) => post(url.POST_AUTH_LOGIN, data);
// Check User Mobile
export const backendPostAuthMobileExists = (data) =>
  post(url.POST_AUTH_MOBILEEXISTS, data);
// Check User Email
export const backendPostAuthEmailExists = (data) =>
  post(url.POST_AUTH_EMAILEXISTS, data);
// Forgot Password
export const backendPostAuthForgotPassword = (data) =>
  post(url.POST_AUTH_FORGOTPASSWORD, data);
// Change Password
export const backendPostAuthChangePassword = (data) =>
  post(url.POST_AUTH_CHANGEPASSWORD, data);
// Reset Password
export const backendPostAuthResetPassword = (data) =>
  post(url.POST_AUTH_RESETPASSWORD, data);
// New Otp Request
export const backendPostAuthNewOtpRequest = (data) =>
  post(url.POST_AUTH_NEWOTPREQUEST, data);
// Resend Otp Request
export const backendPostAuthResendOtpRequest = (data) =>
  post(url.POST_AUTH_RESENDOTPREQUEST, data);
/*========== Users Module ===============*/
// Get all Users
export const backendGetAllUsers = () => get(url.MODULE_USERS);
// Add New User
export const backendPostAddNewUser = (data) =>
  submitFormData(url.MODULE_USERS, data, "POST");
// Update User
export const backendPatchUpdateUser = (id, data) =>
  submitFormData(`${url.MODULE_USERS}/${id}`, data, "PATCH");
// Get User Info
export const backendGetUserInfo = (id) => get(`${url.MODULE_USERS}/${id}`);
//Delete User
export const backendDeleteUser = (id) => del(`${url.MODULE_USERS}/${id}`);
// Status Update User
export const backendPostUserStatus = (data) => post(url.POST_USER_STATUS, data);
export const backendUsersDropDownList = (data) =>
  post(url.GET_USER_DROPDOWN_LIST, data);

/*========== Customer Module ===============*/
// Get all Customers
export const backendGetAllCustomers = (data) =>
  post(url.GET_ALL_CUSTOMER, data);
// Add New Customer
export const backendPostAddNewCustomer = (data) =>
  submitFormData(url.MODULE_CUSTOMER, data, "POST");
// Update Customer
export const backendPatchUpdateCustomer = (id, data) =>
  submitFormData(`${url.MODULE_CUSTOMER}/${id}`, data, "PATCH");
// Get Customer Info
export const backendGetCustomerInfo = (id) =>
  get(`${url.MODULE_CUSTOMER}/${id}`);
//Delete Customer
export const backendDeleteCustomer = (id) =>
  del(`${url.MODULE_CUSTOMER}/${id}`);
// Status Update Customer
export const backendPostCustomerStatus = (data) =>
  post(url.POST_CUSTOMER_STATUS, data);
// Get all Customers DropDown
export const backendCustomersDropDownList = (data) =>
  post(url.GET_CUSTOMER_DROPDOWN_LIST, data);

export const remarkdropDownList = (data) =>
  post(url.GET_CUSTOMER_DROPDOWN_, data);

// Get all Customers BankInfo
export const backendCustomersBankInfo = (data) =>
  post(url.GET_CUSTOMER_BANKINFO, data);
export const backendCustomersBalance = (data) =>
  post(url.GET_CUSTOMER_BALANCE, data);
// Customer BankInfo
export const backendCustomersBankVerified = (data) =>
  post(url.CUSTOMER_BANK_ACCOUNT_VERIFIED, data);
// Get all Customer Upi
export const backendCustomersUpiVerified = (data) =>
  post(url.CUSTOMER_UPI_VERIFIED, data);
// Customer Clear Bank
export const backendCustomersClearBank = (data) =>
  post(url.CUSTOMER_CLEAR_BANK_DETAIL, data);
// Customer Clear Upi
export const backendCustomersClearUpi = (data) =>
  post(url.CUSTOMER_CLEAR_UPI_DETAIL, data);
export const backendCustomersAllTransaction = (data) =>
  post(url.CUSTOMER_ALL_TRANSACTIONS, data);
export const backendCustomersAllRedemption = (data) =>
  post(url.CUSTOMER_ALL_REDEMPTIONS, data);
export const backendCustomerkycVerified = (data) =>
  post(url.CUSTOMER_KYC_VERIFIED, data);
export const backendCustomerkycRejected = (data) =>
  post(url.CUSTOMER_KYC_REJECTED, data);
export const backendCustomerListStatus = (data) =>
  post(url.CUSTOMER_LIST_STATUS, data);
export const backendCustomerPendingPayeeList = (data) =>
  post(url.CUSTOMER_PENDING_PAYEELIST, data);
export const backendCustomerUserAssign = (data) =>
  post(url.CUSTOMER_USER_ASSIGN, data);
export const backendCustomerImport = (data) => post(url.CUSTOMER_IMPORT, data);
// Customer Kyc Upload
export const backendCustomerKycUpload = (data) =>
  submitFormData(url.CUSTOMER_KYC_UPDATE, data, "POST");
/*========== Beat Module ===============*/
// Get all Beats
export const backendGetAllBeats = () => get(url.MODULE_BEAT);
// Add New Beat
export const backendPostAddNewBeat = (data) => post(url.MODULE_BEAT, data);
// Update Beat
export const backendPatchUpdateBeat = (id, data) =>
  patch(`${url.MODULE_BEAT}/${id}`, data);
// Get Beat Info
export const backendGetBeatInfo = (id) => get(`${url.MODULE_BEAT}/${id}`);
//Delete Beat
export const backendDeleteBeat = (id) => del(`${url.MODULE_BEAT}/${id}`);
// Status Update Beat
export const backendPostBeatStatus = (data) => post(url.POST_BEAT_STATUS, data);
/*========== BeatSchedule Module ===============*/
// Get all BeatSchedules
export const backendGetAllBeatSchedules = () => get(url.MODULE_BEATSCHEDULES);
// Add New BeatSchedule
export const backendPostAddNewBeatSchedule = (data) =>
  post(url.MODULE_BEATSCHEDULES, data);
// Update BeatSchedule
export const backendPatchUpdateBeatSchedule = (id, data) =>
  patch(`${url.MODULE_BEATSCHEDULES}/${id}`, data);
// Get BeatSchedule Info
export const backendGetBeatScheduleInfo = (id) =>
  get(`${url.MODULE_BEATSCHEDULES}/${id}`);
//Delete BeatSchedule
export const backendDeleteBeatSchedule = (id) =>
  del(`${url.MODULE_BEATSCHEDULES}/${id}`);
// Status Update BeatSchedule
export const backendPostBeatScheduleStatus = (data) =>
  post(url.POST_BEATSCHEDULES_STATUS, data);
/*========== Category Module ===============*/
// Get all Categories
export const backendGetAllCategories = () => get(url.MODULE_CATEGORY);
// Add New Category
export const backendPostAddNewCategory = (data) =>
  submitFormData(url.MODULE_CATEGORY, data, "POST");
// Update Category
export const backendPatchUpdateCategory = (id, data) =>
  submitFormData(`${url.MODULE_CATEGORY}/${id}`, data, "PATCH");
// Get Category Info
export const backendGetCategoryInfo = (id) =>
  get(`${url.GET_CATEGORY_INFO}/${id}`);
//Delete Category
export const backendDeleteCategory = (id) =>
  del(`${url.MODULE_CATEGORY}/${id}`);
// Status Update Category
export const backendPostCategoryStatus = (data) =>
  post(url.POST_CATEGORY_STATUS, data);
// Get Category DropDown List
export const backendGetCategoriesDropdownList = () =>
  get(url.GET_CATEGORY_DROPDOWNLIST);
/*========== SubCategory Module ===============*/
// Get all Categories
export const backendGetAllSubCategories = () => get(url.MODULE_SUBCATEGORY);
// Add New Category
export const backendPostAddNewSubCategory = (data) =>
  submitFormData(url.MODULE_SUBCATEGORY, data, "POST");
// Update Category
export const backendPatchUpdateSubCategory = (id, data) =>
  submitFormData(`${url.MODULE_SUBCATEGORY}/${id}`, data, "PATCH");
// Get Category Info
export const backendGetSubCategoryInfo = (id) =>
  get(`${url.MODULE_SUBCATEGORY}/${id}`);
//Delete Category
export const backendDeleteSubCategory = (id) =>
  del(`${url.MODULE_SUBCATEGORY}/${id}`);
// Status Update Category
export const backendPostSubCategoryStatus = (data) =>
  post(url.POST_SUBCATEGORY_STATUS, data);

export const backendGetSubCategoriesDropdownList = () =>
  get(url.GET_SUBCATEGORY_DROPDOWNLIST);
/*========== Products Module ===============*/
// Get all Products
export const backendGetAllProducts = (data) => post(url.GET_ALL_PRODUCTS, data);
// Add New Product
export const backendPostAddNewProduct = (data) =>
  submitFormData(url.MODULE_PRODUCT, data, "POST");
// Update Product
export const backendPatchUpdateProduct = (id, data) =>
  submitFormData(`${url.MODULE_PRODUCT}/${id}`, data, "PATCH");
// Get Product Info
export const backendGetProductInfo = (id) => get(`${url.MODULE_PRODUCT}/${id}`);
//Delete Product
export const backendDeleteProduct = (id) => del(`${url.MODULE_PRODUCT}/${id}`);
// Status Update Product
export const backendPostProductStatus = (data) =>
  post(url.POST_PRODUCT_STATUS, data);
// Get all Products
export const backendGetProductsDropdownList = (data) =>
  post(url.GET_PRODUCTS_DROPDOWN, data);
// Import Products
export const backendImportProducts = (data) =>
  post(url.POST_IMPORT_PRODUCTS, data);

/*========== Gift Module ===============*/
// Get all Gifts
export const backendGetAllGifts = () => get(url.MODULE_GIFT);
// Add New Gift
export const backendPostAddNewGift = (data) =>
  submitFormData(url.MODULE_GIFT, data, "POST");
// Update Gift
export const backendPatchUpdateGift = (id, data) =>
  submitFormData(`${url.MODULE_GIFT}/${id}`, data, "PATCH");
// Get Gift Info
export const backendGetGiftInfo = (id) => get(`${url.MODULE_GIFT}/${id}`);
//Delete Gift
export const backendDeleteGift = (id) => del(`${url.MODULE_GIFT}/${id}`);
// Status Update Gift
export const backendPostGiftStatus = (data) => post(url.POST_GIFT_STATUS, data);
// Gift Drop Down List
export const backendGiftDropDownList = () => get(url.MODULE_GIFT);

/*========== Country Module ===============*/
// Get all Country
export const backendGetAllCountries = () => get(url.MODULE_COUNTRY);

export const backendGetCountriesDropdown = () => get(url.GET_COUNTRY_DROPDOWN);
// Get all Country
export const backendGetAllCountryCodes = (data) =>
  post(url.GET_COUNTRY_CODES, data);
// Add New Country
export const backendPostAddNewCountry = (data) =>
  post(url.MODULE_COUNTRY, data);
// Update Country
export const backendPatchUpdateCountry = (id, data) =>
  patch(`${url.MODULE_COUNTRY}/${id}`, data);
// Get Country Info
export const backendGetCountryInfo = (id) => get(`${url.MODULE_COUNTRY}/${id}`);
//Delete Country
export const backendDeleteCountry = (id) => del(`${url.MODULE_COUNTRY}/${id}`);
// Status Update Country
export const backendPostCountryStatus = (data) =>
  post(url.POST_COUNTRY_STATUS, data);
// Get all Cities
export const backendGetCountryFromIP = () => get("https://ipapi.co/json/");
/*========== State Module ===============*/
// Get all States
export const backendGetAllStates = () => get(url.MODULE_STATES);
// Add New State
export const backendPostAddNewState = (data) => post(url.MODULE_STATES, data);
// Update State
export const backendPatchUpdateState = (id, data) =>
  patch(`${url.MODULE_STATES}/${id}`, data);
// Get State Info
export const backendGetStateInfo = (id) => get(`${url.MODULE_STATES}/${id}`);
//Delete State
export const backendDeleteState = (id) => del(`${url.MODULE_STATES}/${id}`);
// Status Update State
export const backendPostStateStatus = (data) =>
  post(url.POST_STATES_STATUS, data);
// Get Country States
export const backendGetCountryStates = (data) =>
  post(url.POST_COUNTRY_STATELIST, data);
export const backendgetRemark = (data) => post(url.POST_REMARK_, data);
/*========== City Module ===============*/
// Get all Cities
export const backendGetAllCities = (data) => post(url.GET_ALLCITY, data);
// Add New City
export const backendPostAddNewCity = (data) => post(url.MODULE_CITY, data);
// Update City
export const backendPatchUpdateCity = (id, data) =>
  patch(`${url.MODULE_CITY}/${id}`, data);
// Get City Info
export const backendGetCityInfo = (id) => get(`${url.MODULE_CITY}/${id}`);
//Delete City
export const backendDeleteCity = (id) => del(`${url.MODULE_CITY}/${id}`);
// Status Update City
export const backendPostCityStatus = (data) => post(url.POST_CITY_STATUS, data);
// Get State Cities
export const backendGetStateCities = (data) =>
  post(url.POST_STATE_CITYLIST, data);
/*========== Attendance Module ===============*/
// Get all Attendances
export const backendGetAllAttendances = () => get(url.MODULE_ATTENDANCE);
// Add New Attendance
export const backendPostAddNewAttendance = (data) =>
  post(url.MODULE_ATTENDANCE, data);
// Update Attendance
export const backendPatchUpdateAttendance = (id, data) =>
  patch(`${url.MODULE_ATTENDANCE}/${id}`, data);
// Get Attendance Info
export const backendGetAttendanceInfo = (id) =>
  get(`${url.MODULE_ATTENDANCE}/${id}`);
//Delete Attendance
export const backendDeleteAttendance = (id) =>
  del(`${url.MODULE_ATTENDANCE}/${id}`);
// Status Update Attendance
export const backendPostAttendanceStatus = (data) =>
  post(url.POST_ATTENDANCE_STATUS, data);
/*========== CustomerVisit Module ===============*/
// Get all CustomerVisits
export const backendGetAllCustomerVisit = () => get(url.MODULE_CUSTOMERVISIT);
// Add New CustomerVisit
export const backendPostAddNewCustomerVisit = (data) =>
  post(url.MODULE_CUSTOMERVISIT, data);
// Update CustomerVisit
export const backendPatchUpdateCustomerVisit = (id, data) =>
  patch(`${url.MODULE_CUSTOMERVISIT}/${id}`, data);
// Get CustomerVisit Info
export const backendGetCustomerVisitInfo = (id) =>
  get(`${url.MODULE_CUSTOMERVISIT}/${id}`);
//Delete CustomerVisit
export const backendDeleteCustomerVisit = (id) =>
  del(`${url.MODULE_CUSTOMERVISIT}/${id}`);
// Status Update CustomerVisit
export const backendPostCustomerVisitStatus = (data) =>
  post(url.POST_CUSTOMERVISIT_STATUS, data);
/*========== Loyalty Scheme Module ===============*/
// Get all LoyaltySchemes
export const backendGetAllLoyaltySchemes = () => get(url.MODULE_LOYALTYSCHEME);
// Add New LoyaltyScheme
export const backendPostAddNewLoyaltyScheme = (data) =>
  submitFormData(url.MODULE_LOYALTYSCHEME, data, "POST");
// Update LoyaltyScheme
export const backendPatchUpdateLoyaltyScheme = (id, data) =>
  submitFormData(`${url.MODULE_LOYALTYSCHEME}/${id}`, data, "PATCH");
// Get LoyaltyScheme Info
export const backendGetLoyaltySchemeInfo = (id) =>
  get(`${url.MODULE_LOYALTYSCHEME}/${id}`);
//Delete LoyaltyScheme
export const backendDeleteLoyaltyScheme = (id) =>
  del(`${url.MODULE_LOYALTYSCHEME}/${id}`);
// Status Update LoyaltyScheme
export const backendPostLoyaltySchemeStatus = (data) =>
  post(url.POST_LOYALTYSCHEME_STATUS, data);
// Get all LoyaltyScheme DropDown
export const backendLoyaltySchemeDropDownList = () =>
  get(url.GET_LOYALTYSCHEME_DROPDOWN_LIST);
/*========== Notification Module ===============*/
// Get all Notifications
export const backendGetAllNotifications = () => get(url.MODULE_NOTIFICATION);
// Add New Notification
export const backendPostAddNewNotification = (data) =>
  post(url.MODULE_NOTIFICATION, data);
// Update Notification
export const backendPatchUpdateNotification = (id, data) =>
  patch(`${url.MODULE_NOTIFICATION}/${id}`, data);
// Get Notification Info
export const backendGetNotificationInfo = (id) =>
  get(`${url.MODULE_NOTIFICATION}/${id}`);
//Delete Notification
export const backendDeleteNotification = (id) =>
  del(`${url.MODULE_NOTIFICATION}/${id}`);
// Status Update Notification
export const backendPostNotificationStatus = (data) =>
  post(url.POST_NOTIFICATION_STATUS, data);
/*========== Shopping Carts Module ===============*/
// Get all Shopping Carts
export const backendGetAllShoppingCarts = () => get(url.MODULE_SHOPPINGCART);
// Add New ShoppingCart
export const backendPostAddNewShoppingCart = (data) =>
  post(url.MODULE_SHOPPINGCART, data);
// Update Notification
export const backendPatchUpdateShoppingCart = (id, data) =>
  patch(`${url.MODULE_SHOPPINGCART}/${id}`, data);
// Get Notification Info
export const backendGetShoppingCartInfo = (id) =>
  get(`${url.MODULE_SHOPPINGCART}/${id}`);
//Delete Notification
export const backendDeleteShoppingCart = (id) =>
  del(`${url.MODULE_SHOPPINGCART}/${id}`);
// Status Update Notification
export const backendPostShoppingCartStatus = (data) =>
  post(url.POST_SHOPPINGCART_STATUS, data);

/*========== Survey Questions Module ===============*/
// Get all Survey Questions
export const backendGetAllSurveyQuestions = () =>
  get(url.MODULE_SURVEYQUESTION);
// Add New SurveyQuestion
export const backendPostAddNewSurveyQuestion = (data) =>
  post(url.MODULE_SURVEYQUESTION, data);
// Update SurveyQuestion
export const backendPatchUpdateSurveyQuestion = (id, data) =>
  patch(`${url.MODULE_SURVEYQUESTION}/${id}`, data);
// Get SurveyQuestion Info
export const backendGetSurveyQuestionInfo = (id) =>
  get(`${url.MODULE_SURVEYQUESTION}/${id}`);
//Delete SurveyQuestion
export const backendDeleteSurveyQuestion = (id) =>
  del(`${url.MODULE_SURVEYQUESTION}/${id}`);
// Status Update SurveyQuestion
export const backendPostSurveyQuestionStatus = (data) =>
  post(url.POST_SURVEYQUESTION_STATUS, data);
/*========== Transactions Module ===============*/
// Get all Transactions
export const backendGetAllTransactions = (data) =>
  post(url.GET_ALL_TRANSACTIONS, data);
// Add New Transaction
export const backendPostAddNewTransaction = (data) =>
  post(url.MODULE_TRANSACTION, data);
// Update Transaction
export const backendPatchUpdateTransaction = (id, data) =>
  patch(`${url.MODULE_TRANSACTION}/${id}`, data);
// Get Transaction Info
export const backendGetTransactionInfo = (id) =>
  get(`${url.MODULE_TRANSACTION}/${id}`);
//Delete Transaction
export const backendDeleteTransaction = (id) =>
  del(`${url.MODULE_TRANSACTION}/${id}`);
// Status Update Transaction
export const backendPostTransactionStatus = (data) =>
  post(url.POST_TRANSACTION_STATUS, data);
// Coupon Scan
export const backendQRCodeScaned = (data) => post(url.POST_SCANED_QRCODE, data);
// Import Coupon Scan
export const backendImportCouponsToScan = (data) =>
  post(url.POST_IMPORT_COUPONS_SCAN, data);
// Import Transactions
export const backendImportTransactions = (data) =>
  post(url.POST_IMPORT_TRANSACTIONS, data);

/*========== Redemption Module ===============*/
// Get all Redemption
export const backendGetAllRedemptions = (data) =>
  post(url.GET_ALL_REDEMPTION, data);
// Add New Redemption
export const backendPostAddNewRedemption = (data) =>
  post(url.MODULE_REDEMPTION, data);
// Update Redemption
export const backendPatchUpdateRedemption = (id, data) =>
  patch(`${url.MODULE_REDEMPTION}/${id}`, data);
// Get Redemption Info
export const backendGetRedemptionInfo = (id) =>
  get(`${url.MODULE_REDEMPTION}/${id}`);
//Delete Redemption
export const backendDeleteRedemption = (id) =>
  del(`${url.MODULE_REDEMPTION}/${id}`);
//Approved Redemption
export const backendApprovedRedemption = (data) =>
  post(url.APPROVERD_REDEMPTION, data);
//Approved Redemption
export const backendRejectRedemption = (data) =>
  post(url.REJECT_REDEMPTION, data);
//Transfer Redemption
export const backendTransferRedemption = (data) =>
  post(url.TRANSFERED_REDEMPTION, data);
//Create Neft Redemption
export const backendCustomerNeftRedemption = (data) =>
  post(url.CREATE_NEFT_REDEMPTION, data);
//Create Upi Redemption
export const backendCustomerUpiRedemption = (data) =>
  post(url.CREATE_UPI_REDEMPTION, data);
//Redemption Bulk Status Cahnage
export const backendBulkStatusChangeRedemption = (data) =>
  post(url.REDEMPTION_BULKSTATUS_CHANGE, data);
//Pending Redemption List
export const backendGetPendingRedemption = (data) =>
  post(url.GET_PENDING_REDEMPTIONS, data);
/*========== Transactions Module ===============*/
// Get all Transactions
// Coupons list (supports optional date filters via query params)
// params: { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' }
export const backendGetAllCoupons = (params = {}) =>
  get(url.MODULE_COUPONS, { params });
// Add New COUPON
export const backendPostAddNewCoupon = (data) => post(url.MODULE_COUPONS, data);
// IMPORT New COUPONS
export const backendPostImportNewCoupon = (data) => post(url.MODULE_COUPONS_IMPORT, data);
// GET EXPORT ALL COUPONS
export const backendGetExportAllCoupons = (params = {}) => get(url.MODULE_COUPONS_EXPORT_ALL, { params });
// GET EXPORT ALL COUPONS
export const replacePackageNumber = (data) => post(url.REPLACE_PACKAGE_NUMBER, data);
// Update Transaction
export const backendPatchUpdateCoupon = (id, data) =>
  patch(`${url.MODULE_COUPONS}/${id}`, data);
// Get Transaction Info
export const backendGetCouponInfo = (id) => get(`${url.MODULE_COUPONS}/${id}`);
//Delete Transaction
export const backendDeleteCoupon = (id) => del(`${url.MODULE_COUPONS}/${id}`);
/*=============== Setting Module ==================*/
export const backendPostAddsetting = (data) => post(url.MODULE_SETTING, data);
export const getRejectReasonList = () => get(url.GET_REJECT_REASON);
export const getUserRoleList = () => get(url.GET_USER_ROLES);
export const backendGetSchemeTypes = () => get(url.GET_SCHEME_TYPES);
export const backendGetSchemeBasedOn = () => get(url.GET_SCHEME_BASEDON);
export const backendGetUserPermissions = () => get(url.GET_USER_PERMISSIONS);
export const backendGetPermissions = () => get(url.GET_PERMISSIONS);
export const backendUpdateRolePermission = (data) =>
  post(url.UPDATE_ROLE_PERMISSIONS, data);
export const backendGetRolePermissions = () => get(url.GET_ROLE_PERMISSIONS);
export const backendGetCallTypes = () => get(url.GET_CALLTYPES);
export const backendGetCallStatus = () => get(url.GET_CALLSTATUS);
export const backendUploadBannerImages = (data) =>
  submitFormData(url.BANNER_IMAGEUPLOAD, data, "POST");
export const backendRemoveBanerImage = (data) =>
  post(url.REMOVE_BANNER_IMAGE, data);

export const backendUpdateYoutubeShorts = (data) =>
  post(url.UPDATE_YOUTUBE_SHORTS, data);

export const backendGetYoutubeShorts = () =>
  get(url.GET_YOUTUBE_SHORTS);



/*========== DAMAGE Module ===============*/
export const backendGetAllDamageCoupons = (data) => post(url.MODULE_DAMAGEQR, data);
export const backendGetAllDamageCouponsProject = (data) => post(url.MODULE_DAMAGEQRPRODUCT, data);
export const backendGetApprovedQR = (data) => post(url.MODULE_APPROVEDQR, data);

export const backendPostAddNewDAMAGEENTRIES = (data) => submitFormData(url.MODULE_ADDDAMAGEENTRIES, data, "POST");
export const backendPostAddNewDAMAGEENTRIESIntoTransaction = (data) => post(url.MODULE_ADDDAMAGEENTRIESINTOTRANSACTION, data);



///*========== Orders Module ===============*/
// Get all Orders
export const backendGetAllOrders = () => get(url.MODULE_ORDER);
// Add New Order
export const backendPostAddNewOrder = (data) => post(url.MODULE_ORDER, data);
// Update Order
export const backendPatchUpdateOrder = (id, data) =>
  patch(`${url.MODULE_ORDER}/${id}`, data);
// Get Order Info
export const backendGetOrderInfo = (id) => get(`${url.MODULE_ORDER}/${id}`);
//Delete Order
export const backendDeleteOrder = (id) => del(`${url.MODULE_ORDER}/${id}`);
// Status Update Order
export const backendPostOrderStatus = (data) =>
  post(url.POST_ORDER_STATUS, data);
/*========== Sales Module ===============*/
// Get all Sales
export const backendGetAllSales = () => get(url.MODULE_SALES);
// Add New Sale
export const backendPostAddNewSale = (data) => post(url.MODULE_SALES, data);
// Update Sale
export const backendPatchUpdateSale = (id, data) =>
  patch(`${url.MODULE_SALES}/${id}`, data);
// Get Sale Info
export const backendGetSaleInfo = (id) => get(`${url.MODULE_SALES}/${id}`);
//Delete Sale
export const backendDeleteSale = (id) => del(`${url.MODULE_SALES}/${id}`);
// Status Update Sale
export const backendPostSaleStatus = (data) =>
  post(url.POST_SALES_STATUS, data);
export const backendGetSetting = () => get(url.MODULE_SETTING);
// Status Update Sale
export const getCategoryProducts = (data) =>
  post(url.GET_CATEGORY_PRODUCTS, data);
export const getCustomerTypeList = () => get(url.GET_CUSTOMERTYPE_LIST);
export const getRemarkList = () => get(url.GET_REMARK_LIST);
export const addremark = (data) => post(url.POST_REMARK, data);

export const getRedeemTypeList = () => get(url.GET_REDEEMTYPES_LIST);
export const downloadCouponProfile = (data) =>
  post(url.COUPON_PROFILE_EXPORT, data);

// Get Dashboard Data
// export const backendGetDashboards = (data) => get(url.GET_DASHBOARD_DATA?data);
export const backendGetDashboards = (data) => get(`${url.GET_DASHBOARD_DATA}?customerType=${data}`);
//Reports
export const backendOtpLogReport = (data) => post(url.GET_OTPLOG_REPORTS, data);

/*========== Call Summary Module ===============*/
// Get all Call Summary
export const backendGetAllCallSummary = (data) =>
  post(url.MODULE_CALLSUMMARY_ALL, data);
// Add New Call Summary
export const backendAddNewCallSummary = (data) =>
  post(url.MODULE_CALLSUMMARY, data);
// Update Call Summary
export const backendUpdateCallSummary = (id, data) =>
  patch(`${url.MODULE_CALLSUMMARY}/${id}`, data);
// Get Call Summary Info
export const backendGetCallSummary = (id) =>
  get(`${url.MODULE_CALLSUMMARY}/${id}`);
//Delete Call Summary
export const backendDeleteCallSummary = (id) =>
  del(`${url.MODULE_CALLSUMMARY}/${id}`);
//Cusromer Wise Call Summary
export const backendCustomerCallSummary = (data) =>
  post(url.CUSTOMER_CALLSUMMARY, data);

export const backendImportCallSummary = (data) =>
  post(url.POST_IMPORT_CALLSUMMARY, data);
/*========== Loyalty Module ===============*/
export const backendNewOtpRequest = (data) =>
  post(url.GET_NEWOTP_REQUEST, data);

/*========== Coupon Searc Module ===============*/
export const backendSearchCoupons = (data) => post(url.COUPON_SEARCH, data);
