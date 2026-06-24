export interface RedemptionDetailViewInterface {
    _id?: any;
    refno? : number,
    customerid?: any;
    firmName?: string;
    contactPerson?: string;
    mobile?: number;
    address?: string;
    points? : number;
    approvedAt? : string;
    approverName? : string;
    rejectedAt? : string;
    rejectedName? : string;
    reason? : string;
    paymentDate? : Date;
    transferName? : string;
    method? : string;
    upiNumber? : string;
    accountNo? : string;
    holderName? : string;
    bankName? : string;
    ifsc? : string;
    amount? : number;
    transactionID? : string;
    details? : string;
    status? : string;
    type? : string;
    createdAt?: any;
    fundSource?: any;
}

export interface RedemptionCreateInterface {
    _id?: any;
    customerid?: any;
    points: number;
    type : string
    payment?: {
        upiNumber? : string;
        accountNo? : string;
        holderName? : string;
        bankName? : string;
        ifsc? : string;
        amount? : number;
    };
}

export const initialRedemption = {
    _id: '',
    points: 0,
    customerid : '',
    type: '',
    payment: {
        upiNumber: '',
        accountNo: '',
        holderName: '',
        bankName:'',
        ifsc: '',
        amount: 0,
    },
  }

  export const updateRedemptionData = {
    status: '',
    // amount: 0,
  }

  export interface RedemptionUpdateInterface {
    status : string
    // amount? : number;
}

  export interface RedemptionFilterInterface {
    startDate?: any;
    endDate?: any;
    type?: string[];
    status?: string[];
    customerType?:string[]
}

export const initialFilterRedemption = {
    startDate : '',
    endDate: '',
    type: [],
    status: [],
    customerType:[]
}

export const initialTransferUpdate = {
    status : '',
    redemptionid: '',
    transactionID: '',
    details: '',
}

export interface RedemptionInfoInterface {
    _id?: any;
    customerid? : any;
    firmName?: string;
    contactPerson?: string;
    createdAt?: any;
    points? : number;
  }

   export interface TraansactionFilterInterface {
    
    type?: string[];
    pointType?: string[];
    customerType?:string[];
}

export const initialFiltertransaction = {
   
    type: [],
    pointType: [],
    customerType:[],
}