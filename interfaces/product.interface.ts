export interface ProductDetailInterface {
    mrp?: number;
    price?: number;
    partNo?: string;
    specification?: string;
  }

  export interface CreateProductInterface {
    _id?: string;
    name?: string;
    description?: string;
    categoryid?: any;
    subcategoryid?: any;
    brand?: string;
    model?: string;
    ranking?: number;
    discount?: number;
    productDetail?: any;
    images?:any[],
  }
  
  export const initialProductDetail = {
    mrp: 0,
    price: 0,
    partNo: '',
    specification: '',
  }
  export const initialProduct = {
    _id:"",
    name: "",
    description: '',
    categoryid: '',
    subcategoryid: "",
    brand: '',
    model: '',
    ranking: 1,
    discount: 0,
    images:[],
    productDetail: [{
        mrp: '',
        price:'',
        partNo: '',
        specification: '',
    }]
  }




export interface ProductViewInterface {
    _id?: any;
    name?: string;
    categoryName?: string;
    subcategoryName?: string;
    brand? : string;
    model? : string;
    description? : string;
    ranking?: number;
    discount?: number;
    productDetail?: any[];
    active? : boolean;
    images? : string[];
    partNo? : string;
    price? : number;
    mrp? : number;
}


export interface ProductDropDownInterface {
  _id?: string;
  name?: string;
}

export interface CategoryDropDownInterface {
  _id?: string;
  categoryName: string;
}

export interface ProductFilterInterface {
  search?: string;
}

export const initialFilterProduct = {
  search : '',
}
