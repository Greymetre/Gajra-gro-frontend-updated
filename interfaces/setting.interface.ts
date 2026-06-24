
export interface SettingInterface {
    helpdesk?:{
        phone?:string;
        whatsapp?:string;
        email?:string;
        address?:string;
    }
    socialmedia?:{
        facebook?:string;
        youtube?:string;
        instagram?:string;
        linkedin?:string;
        twitter?:string;
    }
    catalogue?:{
        privacy?:string;
        terms?:string;
        loyalty?:string;
    }
    loyaltyscheme?:{
        coupon_based?:boolean;
        sales_based?:boolean;
        customerType_based?:boolean;
        scheme_start_alert?:boolean;
        startedAt?:string;
        endedAt?:string;
        scheme_types?:string[]; 
        scheme_based?:string[];
        states_based?:boolean;
        city_based?:boolean;
        customer_based?:boolean;
        category_based?:boolean;
        subcategory_based?:boolean;
        product_based?:boolean;
    }
    points?:{
        point_value?:number;
        welcome?:number;
        point_types?:string[];
    }
    redemption?:{
        startedAt?:string;
        endedAt?:string;
        every_threshold?:boolean;
        first_threshold?:boolean;
        threshold?:number;
        milestone_points?:boolean;
        automated?:boolean;
        approval?:boolean;
        redeem_types?:string[]; 
    }
    gift?:{
        gift_types?:string[];
    }
    image? : any
    customerType?:string[];

    login?:{
        background?:boolean;
        login_with_password?:boolean;
        login_with_otp?:boolean;
        verified_check?:boolean;
    }
}

export interface SettingLoyaltyInterface {
    coupon_based?:boolean;
    sales_based?:boolean;
    customerType_based?:boolean;
    scheme_start_alert?:boolean;
    startedAt?:string;
    endedAt?:string;
    scheme_types?:string[]; 
    scheme_based?:string[];
    states_based?:boolean;
    city_based?:boolean;
    customer_based?:boolean;
    category_based?:boolean;
    subcategory_based?:boolean;
    product_based?:boolean;
}
export const initialLoyaltySettingData = {
    coupon_based : false,
    sales_based : false,
    customerType_based : false,
    scheme_start_alert : false,
    startedAt: '',
    endedAt: '',
    scheme_types:[],
    scheme_based:[],
    states_based : false,
    city_based : false,
    customer_based : false,
    category_based : false,
    subcategory_based : false,
    product_based : false,
  }

export const initialSettingData = {
    loyaltyscheme: {
        coupon_based : false,
        sales_based : false,
        customerType_based : false,
        scheme_start_alert : false,
        startedAt: '',
        endedAt: '',
        scheme_types:[],
        scheme_based:[],
        states_based : false,
        city_based : false,
        customer_based : false,
        category_based : false,
        subcategory_based : false,
        product_based : false,
    },
    points:{
        point_value:0,
        welcome:0,
        point_types:[],
    },
    redemption:{
        startedAt: '',
        endedAt:'',
        every_threshold : false,
        first_threshold : false,
        threshold : 0,
        milestone_points : false,
        automated : false,
        approval : false,
        redeem_types:[],
        reject_reason : []
    },
    gift:{
        gift_types:[]
    },
    helpdesk:{
        phone : '',
        whatsapp : '',
        email : '',
        address : '',
    },
    socialmedia:{
        facebook : '',
        youtube : '',
        instagram : '',
        linkedin : '',
        twitter : '',
    },
    catalogue :{
        privacy :'',
        terms :'',
        loyalty :'',
        product :'',
    },
    customerType : [],
    banner : [],
    login:{
        background : false,
        login_with_password : false,
        login_with_otp : false,
        verified_check : false,
    },
    mobileapp :{
        loyalty_version :'',
        sales_version :'',
        distributor_version :'',
    },
    callcenter:{
        calltypes : [],
        callstatus :[],
    },
  }
  export interface SidebarManuInterface {
    label:string;
    href:string;
    icon?:any;
    submanus?:any;
    canAccess:string;
}

export interface ModuleAccessInterface {
    canCreate? : boolean;
    canUpdate? : boolean;
    canDelete? : boolean;
    canRead? : boolean;
    canExport? : boolean;
    canImport? : boolean;
}
export interface RolePermissionInterface {
    role : string;
    canAccess: [],
}

export const initialRolePermission = [{
    role: "",
    canAccess: []
}]

export interface PermissionRenderInterface {
    coupons: Array<string>;
    customers: Array<string>;
    gift: Array<string>;
    loyaltyscheme: Array<string>;
    products: Array<string>;
    redemptions: Array<string>;
    reports: Array<string>;
    setting: Array<string>;
    transactions: Array<string>;
    users: Array<string>;
}

export const initialPermissionRenderData = {
    coupons: [],
    customers: [],
    gift: [],
    loyaltyscheme: [],
    products: [],
    redemptions: [],
    reports: [],
    setting: [],
    transactions: [],
    users: []
}