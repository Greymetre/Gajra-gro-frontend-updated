import { AxiosResponse } from "axios";
export interface ICategoryState {
    categorys: any,
    loading : boolean,
    error : boolean
}

// Define user type
export interface Category {
    categoryName: string;
    categoryDescription: string;
    ranking : number;

}

// Define Different action type
 interface AddCategoryAction {
    type: string;
    payload: Category;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

interface DeleteCategoryAction {
    type: string;
    payload: Category;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

export interface CategoryState {
    catgorys:Category;
    loading: boolean;
    error: boolean;
}
export type CategoryActionsTypes = AddCategoryAction | DeleteCategoryAction;
export const CATEGORY_LIST_REQUEST = "CATEGORY_LIST_REQUEST"
export const CATEGORY_LIST_SUCCESS = "CATEGORY_LIST_SUCCESS"
export const CATEGORY_LIST_FAIL = "CATEGORY_LIST_FAIL"
export const CATEGORY_DETAIL_REQUEST = "CATEGORY_DETAIL_REQUEST"
export const CATEGORY_DETAIL_SUCCESS = "CATEGORY_DETAIL_SUCCESS"
export const CATEGORY_DETAIL_FAIL = "CATEGORY_DETAIL_FAIL"
export const CATEGORY_SAVE_REQUEST = "CATEGORY_SAVE_REQUEST"
export const CATEGORY_SAVE_SUCCESS = "CATEGORY_SAVE_SUCCESS"
export const CATEGORY_SAVE_FAIL = "CATEGORY_SAVE_FAIL"
export const CATEGORY_UPDATE_REQUEST = "CATEGORY_UPDATE_REQUEST"
export const CATEGORY_UPDATE_SUCCESS = "CATEGORY_UPDATE_SUCCESS"
export const CATEGORY_UPDATE_FAIL = "CATEGORY_UPDATE_FAIL"
export const CATEGORY_DELETE_REQUEST = "CATEGORY_DELETE_REQUEST"
export const CATEGORY_DELETE_SUCCESS = "CATEGORY_DELETE_SUCCESS"
export const CATEGORY_DELETE_FAIL = "CATEGORY_DELETE_FAIL"

