import { AxiosResponse } from "axios";
export interface IProductState {
    products: any,
    loading : boolean,
    error : boolean
}
// Define user type
export interface DetailInterface {
    mrp: number;
    price: number;
    partNo : string ;
    specification : string;
}

// Define user type
export interface Product {
    name: string;
    description: string;
    categoryName : string ;
    subcategoryName : string;
    ranking : number;
    productDetail : DetailInterface;
}

// Define Different action type
 interface AddProductAction {
    type: string;
    payload: Product;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

interface DeleteProductAction {
    type: string;
    payload: Product;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

export interface ProductState {
    products: Product;
    loading: boolean;
    error: boolean;
}
export type ProductActionsTypes = AddProductAction | DeleteProductAction;
export const PRODUCT_LIST_REQUEST = "PRODUCT_LIST_REQUEST"
export const PRODUCT_LIST_SUCCESS = "PRODUCT_LIST_SUCCESS"
export const PRODUCT_LIST_FAIL = "PRODUCT_LIST_FAIL"
export const PRODUCT_DETAIL_REQUEST = "PRODUCT_DETAIL_REQUEST"
export const PRODUCT_DETAIL_SUCCESS = "PRODUCT_DETAIL_SUCCESS"
export const PRODUCT_DETAIL_FAIL = "PRODUCT_DETAIL_FAIL"
export const PRODUCT_SAVE_REQUEST = "PRODUCT_SAVE_REQUEST"
export const PRODUCT_SAVE_SUCCESS = "PRODUCT_SAVE_SUCCESS"
export const PRODUCT_SAVE_FAIL = "PRODUCT_SAVE_FAIL"
export const PRODUCT_UPDATE_REQUEST = "PRODUCT_UPDATE_REQUEST"
export const PRODUCT_UPDATE_SUCCESS = "PRODUCT_UPDATE_SUCCESS"
export const PRODUCT_UPDATE_FAIL = "PRODUCT_UPDATE_FAIL"
export const PRODUCT_DELETE_REQUEST = "PRODUCT_DELETE_REQUEST"
export const PRODUCT_DELETE_SUCCESS = "PRODUCT_DELETE_SUCCESS"
export const PRODUCT_DELETE_FAIL = "PRODUCT_DELETE_FAIL"

