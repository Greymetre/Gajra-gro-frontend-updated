export interface CouponProfileInterface {
    _id?: any;
    profileName?: string;
    couponCount?: string;
    startDate?: string;
    expiryDate?: string;
    name?: string;
    productNo?: string;
    description?: string;
    model?: string;
    points?: string;
    mrp?: number;
    price?: number;
    partNo?: string;
    specification?: string;
    weight?: string;
    pcs?: string;
    size?: string;
    customerType: any[];
    products?: any[];
    categories?: any[];
    categoryName?: string;
    subcategoryName?: string; 
    
}

interface CouponInfo {
    couponCount: number;
    productid: string;
    packingList: string;
}

interface CreateCouponProfileInterface {
    _id?: any;
    profileName: string;
    startDate?: string;
    expiryDate?: string;
    customerType?: string[];
    couponInfo: CouponInfo[];
}
interface CreateDamageEntriesInterface {
  customerid?: string | undefined;
  couponGg: string | undefined; 
  couponCode?: string | undefined; 
  couponImage?: string[];
}
export const initialCouponProfileData: CreateCouponProfileInterface = {
    _id: '',
    // profileName:new Date().getTime().toString() + new Date().getMilliseconds().toString(),
    profileName:'',
    startDate: new Date().toISOString().split('T')[0],
    // expiryDate: new Date(`${new Date().getMonth()}
    // /${new Date().getDate()}
    // /${new Date().getFullYear() + 50}`)
    // .toISOString().split('T')[0],
    expiryDate :new Date(
      new Date().getFullYear() + 50, // Year
      new Date().getMonth(),        // Month (0-indexed)
      new Date().getDate()          // Day
    ).toISOString().split('T')[0],
    customerType: [],
    couponInfo: [{ couponCount: 0, productid: '', packingList: '' }],
};
export const initialDamageEntriesData: CreateDamageEntriesInterface = {
  couponImage:[],
  customerid:"",
  couponGg:"",
  couponCode:""
};

export interface CouponSearchInterface {
    _id?: any;
    coupon?: string;
    productsData: {
        name?: string,
        productNo: string,
    };
    createdAt?: any;
}

export interface CouponSearchFilterInterface {
    startDate?: any;
    endDate?: any;
    productid?:any;
  }
  
  export const initialFilterCouponSearch = {
    startDate : '',
    endDate: '',
    productid: '',
  }



  export interface ScanCoupon {
    _id: string;
    profileName: string;
    couponCount: number ; // Adjust this based on actual data type
    customerType: string[]; // Array of strings
    productName: string;
    productNo: string;
    categoryName: string;
    categoryid: string;
    createdAt: string;
  }

  export interface DamageEntriesInterface {
    _id: string;
    active: boolean;
    contactPerson: string ; // Adjust this based on actual data type
    couponCode: string | number; // Array of strings
    couponGg: string | number;
    customerid: string;
    firmName: string;
    mobile: string;
    remark: string;
    statusType: string;
    createdAt: string;
  }