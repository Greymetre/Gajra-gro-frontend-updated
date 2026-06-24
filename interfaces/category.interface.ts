export interface CreateCategoryInterface {
  categoryName?: string;
  categoryDescription?: string,
  ranking?: number;
  image?: string;
}
export const initialCategory = {
  categoryName: "",
  categoryDescription: '',
  ranking: 1,
  image: "",
}
export interface CreateSubCategoryInterface {
  subcategoryName?: string;
  subcategoryDescription?: string,
  categoryid: any,
  ranking?: number;
  image?: string;
}

export const initialSubCategory = {
  subcategoryName: "",
  subcategoryDescription: '',
  categoryid: '',
  ranking: 1,
  image: "",
}
export interface CategoryViewInterface {
  _id: any;
  categoryName?: string;
  categoryDescription?: string,
  ranking?: number;
  image?: string;
}
export interface SubCategoryViewInterface {
  _id: any;
  subcategoryName: string;
  subcategoryDescription?: string;
  categoryName? : string; 
  categoryid?: any,
  ranking?: number;
  image?: string;
  active?: boolean;
}
export interface ProductLoyaltyViewInterface {
  _id: any;
  name?: any;
  productNo?: any,
  categoryid?: any;
  subcategoryid?: any;
}