import { AxiosResponse } from "axios";
export interface ISubCategoryState {
    subcategory: any,
    loading : boolean,
    error : boolean
}


// Define user type
export interface SubCategory {
  
    categoryDescription: string;
    categoryName : string ;

    ranking : number;

}

// Define Different action type
 interface AddSubCategoryAction {
    type: string;
    payload: SubCategory;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

interface DeleteSubCategoryAction {
    type: string;
    payload: SubCategory;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

export interface SubCategoryState {
    subcategory: SubCategory;
    loading: boolean;
    error: boolean;
}
export type SubCategoryActionsTypes = AddSubCategoryAction | DeleteSubCategoryAction;
export const SUBCATEGORYS_LIST_REQUEST = "SUBCATEGORYS_LIST_REQUEST"
export const SUBCATEGORYS_LIST_SUCCESS = "SUBCATEGORYS_LIST_SUCCESS"
export const SUBCATEGORYS_LIST_FAIL = "SUBCATEGORYS_LIST_FAIL"
export const SUBCATEGORYS_DETAIL_REQUEST = "SUBCATEGORYS_DETAIL_REQUEST"
export const SUBCATEGORYS_DETAIL_SUCCESS = "SUBCATEGORYS_DETAIL_SUCCESS"
export const SUBCATEGORYS_DETAIL_FAIL = "SUBCATEGORYS_DETAIL_FAIL"
export const SUBCATEGORYS_SAVE_REQUEST = "SUBCATEGORYS_SAVE_REQUEST"
export const SUBCATEGORYS_SAVE_SUCCESS = "SUBCATEGORYS_SAVE_SUCCESS"
export const SUBCATEGORYS_SAVE_FAIL = "SUBCATEGORYS_SAVE_FAIL"
export const SUBCATEGORYS_UPDATE_REQUEST = "SUBCATEGORYS_UPDATE_REQUEST"
export const SUBCATEGORYS_UPDATE_SUCCESS = "SUBCATEGORYS_UPDATE_SUCCESS"
export const SUBCATEGORYS_UPDATE_FAIL = "SUBCATEGORYS_UPDATE_FAIL"
export const SUBCATEGORYS_DELETE_REQUEST = "SUBCATEGORYS_DELETE_REQUEST"
export const SUBCATEGORYS_DELETE_SUCCESS = "SUBCATEGORYS_DELETE_SUCCESS"
export const SUBCATEGORYS_DELETE_FAIL = "SUBCATEGORYS_DELETE_FAIL"

