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
  // basedOn "Percentage": total % of the normal schemes' points per mechanic category
  categoryPercentages?: CategoryPercentageInterface[];
  // "Regular" (base points) or "Booster" (extra points on top)
  schemeTag?: string;
}

export interface CategoryPercentageInterface {
  category: string;
  percentage: any;
}

// Starting values of a new category scheme, lowest category first (the user can change them)
export const defaultCategoryPercentages: CategoryPercentageInterface[] = [
  { category: "Bronze", percentage: 100 },
  { category: "Silver", percentage: 125 },
  { category: "Gold", percentage: 175 },
  { category: "Diamond", percentage: 200 },
  { category: "Platinum", percentage: 250 },
];

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
  categoryPercentages: [] as CategoryPercentageInterface[],
  schemeTag: "Regular",
  schemeDetail: [{
    detailName: "",
    categories: [],
    products: [],
    points: 1,
  }]
}


