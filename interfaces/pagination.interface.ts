export interface PaginationInterface {
  currentPage: number;
  recordPerPage : number;
  search : string;
  

}
export interface PaginationCustomerInterface {
  currentPage: number;
  recordPerPage : number;
  search : string;
    condition:string[],

  startDate: any;
  endDate:any;

}
export interface PaginationTransInterface {
  currentPage: number;
  recordPerPage : number;
  search : string;
  pointType:string[];

  // [{
  //    CouponScan:string,
  //   GajraLoyalty2:string,
  //   boasterScheme:string 
  // }];
  endDate:any;
startDate:any;
customerType:string[]

}

export interface ResPaginateInterface {
  totalDocs : number;
  totalPages : number;
}

export const initialResPaginate = {
  totalDocs : 0,
  totalPages : 1,
}

export const initialPagination = {
  currentPage : 1,
  recordPerPage : 100,
  search : '',
}

export const initialTransPagination = {
  currentPage : 1,
  recordPerPage : 10,
  search : '',
  pointType:[
  ],
  endDate:'',
startDate:'',
customerType:[]
}
export const initialCustomerPagination = {
  currentPage : 1,
  recordPerPage : 100,
  search : '',

  condition:[],
  endDate:'',
startDate:''
}
export interface SelectDropDownInterface {
  label : string;
  value : string;
  aadharVerified :any;

  // bankVerified: boolean;
   
  //    otherVerified: boolean;
  //    panVerified: boolean;
  //    totalRedemption: number;
}
export interface SelectRemarkInterface {
 
   _id ?: string;
   remark?:string;
    label ?: any;
  value ?: any;

  // bankVerified: boolean;
   
  //    otherVerified: boolean;
  //    panVerified: boolean;
  //    totalRedemption: number;
}