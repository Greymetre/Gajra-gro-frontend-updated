export interface AddressCityViewInterface {
    _id?: any;
    cityName?: string;
    pincode?: string[];
    state?: string;
    country?: string;
    refno? : number;
    active? : boolean;
    district?: string;
    districtid?: any;
    sfaId?: number | null;
}

export interface AddressDistrictViewInterface {
    _id?: any;
    districtName?: string;
    stateid?: any;
    state?: string;
    country?: string;
    active?: boolean;
    sfaId?: number | null;
}