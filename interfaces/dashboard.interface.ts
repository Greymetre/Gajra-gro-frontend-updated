export interface DashboardCustomerInterface {
    _id?: string;
    totalCount?: number;
    selfRegistrations?: number;
    loginCount?: number;
}

export interface DashboardTransactionInterface {
    _id?: string;
    totalPoints?: number;
    scannedPoints?: number;
    welcomePoints?: number;
    scannedCount?: number;
}

export interface DashboardRedemptionInterface {
    _id?: any;
    totalPoints?: number;
    totalCount?: number;
    
}

export interface DashboardCouponInterface {
    _id?: any;
    totalCount?: number;
}

