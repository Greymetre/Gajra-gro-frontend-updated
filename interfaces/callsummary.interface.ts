export const initialCallSummary = {
    userid: '',
    customerid : '',
    callType: '',
    summary: '',
    callStatus: '',
    createdAt: '',
  }

  export interface CallSummaryInterface {
    _id? : any;
    userid?: any;
    customerid?: any;
    firmName?: string;
    contactPerson?: string;
    userName? : string;
    callType?: string;
    summary?: string;
    callStatus?: string;
    createdAt?: any;
}

export const initialCreateCallSummary = {
  customerid : '',
  callType: '',
  summary: '',
  callStatus: '',
  notes: '',
}

export interface CreateCallSummaryInterface {
  customerid?: any;
  callType?: string;
  summary?: string;
  callStatus?: string;
  notes?: string;
}