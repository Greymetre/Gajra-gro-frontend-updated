export interface LoyaltySchemeDetailInterface {
  detailName?: string;
  products?: string[];
  categories?: string[];
  subcategories?: string[];
  minimum?: number;
  maximum?: number;
  points?: number;
}

export interface LoyaltySchemeInterface {
  _id?: any;
  schemeName?: string;
  schemeDescription?: string;
  startedAt?: any;
  endedAt?: any;
  schemeType?: string;
  customerType?: string[];
  customers?: string[];
  states?: string[];
  cities?: string[];
  basedOn?: string;
  frequency?: string;
  image?: string;
  schemeDetail: LoyaltySchemeDetailInterface[];
  active?: boolean;
}

export const initialLoyaltySchemeDetail = {
  detailName: "",
  categories: [],
  products: [],
  points: 1,
}
export const initialLoyaltyScheme = {
  _id: '',
  schemeName: "",
  startedAt: '',
  endedAt: '',
  schemeType: "",
  basedOn: '',
  frequency: '',
  schemeDescription:'',
  image: '',
  customerType: ["Mechanic"],
  states: [""],
  cities: [],
  active:true,
  customers: [],
  schemeDetail: [{
    detailName: "",
    categories: [],
    products: [],
    points: 1,
  }]
}


