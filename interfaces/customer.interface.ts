export interface CreateCustomerInterface {
     _id: any;
     firmName: string;
     contactPerson: string;
     phoneCode: string;
     mobile: string;
     email: string;
     password : string;
     customerType : string;
             
                //  remarkid  :any;


     address: {
        postalCode : string;
        address : string;
        city : string;
        state : string;
        country : string;
    };
    avatar? : string;
    shopimage?: string;
    active: boolean;
  }
  export const initialCustomerData = {
    _id: '',
    firmName: "",
    contactPerson: "",
    phoneCode: "+91",
    mobile : '',
    email: '',
    customerType: '',
    password : '',
    active :true,
    // remarkid:'6532639b5dd1e74e4bca9c88',

    address: {
      postalCode : "",
      address : "",
      city : "",
      state : "",
      country : "India",
    },
  }
  export interface ActiveCustomerInterface {
    readonly customerid?: any;
    readonly active?: string;
  }

  export interface CustomerProfileViewInterface {
    _id?: any;
    refno?: any;
    firmName?: string;
    contactPerson?: string;
    phoneCode?: string;
    mobile?: number;
    email?: string;
    customerType? : string;
    grade? : string;
    avatar? :any;
    shopimage?: any;
    active ? : boolean;
    postalCode? : string;
    address? : string;
    city? : string;
    state? : string;
    country? : string;
    createdBy? : string;
    assignUser?:string;
    balancePoint?: number;
    totalTransaction? :number;
    totalRedemption?:number;
     totalRejectedPoint?:number;
    //  remarkid? :any;

    userInfo?: {
      _id? : any;
      fullName? : string;
      firstName?: string;
      lastName?: string;
    };
    reportings?: {
      _id? : any;
      fullName? : string;
      firstName?: string;
      lastName?: string;
    };
    beatName? : string;
    loginAt?: string;
    createdAt?: string;
}
export const initialCustomerProfileData = {
  _id: '',
  firmName: "",
  contactPerson: "",
  phoneCode: "",
  mobile : 0,
  email: '',
  customerType: '',
  grade: '',
  postalCode : "",
  address : "",
  city : "",
  state : "",
  country : "",
  beatName: "",
  // remarkid : '',

  userInfo: {
    fullName : '',
    firstName : '',
    lastName : ''
  },
  reportings: {
    fullName : '',
    firstName : '',
    lastName : ''
  }
}

export interface CustomerBankDetailInterface {
  customerid?: any;
  accountNo? : string;
  holderName? : string;
  bankName? : string;
  accountType? : string;
  ifsc? : string;
  upiNumber? : string;
  upiVerified? : boolean;
  addressVerified?:boolean;
  bankVerified?:boolean;
  verified? : boolean;
}

export const initialBankDetail = {
  customerid : '',
  upiNumber: '',
  accountNo: '',
  accountType: '',
  holderName: '',
  bankName:'',
  ifsc: '',
  verified : false,
  upiVerified : false
}

export interface CustomerFilterInterface {
  startDate?: any;
  endDate?: any;
  existing?: boolean;
  self?: boolean;
  userid?:any;
  condition?: string[];
  customerType:string[];
  // status?:any;
  // Pending?:any;
  // Approved?:any;
  // Rejected?:any;
  // Incomplete?:any;
  // All?:any;
 // "Pending":"Pending",
// "Rejected":"Rejected",
// "Incomplete":"Incomplete",
// "Approved":"Approved
}

export const initialFilterCustomer = {
  startDate : '',
  endDate: '',
  existing: false,
  self: false,
  condition:[],
  
  userid: '',
  customerType:[]
  // Pending:'',
  // Approved:'',
  // Rejected:'',
  // Incomplete:'',
  // All:'',
 // status: [],
}

export interface CustomerInfoInterface {
  _id?: any;
  firmName?: string;
  contactPerson?: string;
  createdAt?: string;
}

export const initialKycData = {
  customerid: "",
  gstinNo: "",
  panNo: "",
  aadharNo : '',
  otherNo: '',
  otherName: '',
  accountNo: '',
  accountType: '',
  holderName: '',
  bankName:'',
  ifsc: '',
  upiNumber: "",
  
}