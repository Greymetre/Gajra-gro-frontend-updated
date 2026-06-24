export interface CreateUserInterface {
  readonly _id?: any;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly phoneCode?: any;
  readonly mobile?: number;
  readonly email?: string;
  readonly password? : string;
  readonly gender?: string;
  readonly avatar?: string;
  readonly dateOfBirth?: any;
  readonly userType?: string;
  readonly address?: any;
  readonly active?: boolean;
}

export interface ViewUserInfoInterface {
  readonly _id?: any;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly phoneCode?: string;
  readonly mobile?: number;
  readonly email?: string;
  readonly gender?: string;
  readonly avatar?: string;
  readonly dateOfBirth?: any;
  readonly userType?: string;
  readonly address?: any;
  readonly active?: boolean;
}
export interface ActiveUserInterface {
  readonly userid?: any;
  readonly active?: string;
}

export const initialUserProfileData = {
  _id: '',
  firstName: "",
  lastName: "",
  phoneCode: "",
  mobile : 1,
  email: '',
  userType: '',
  gender:'',
  dateOfBirth : '',
  address: {
    postalCode : "",
    address : "",
    city : "",
    state : "",
    country : "India",
  },
  active: true,
}




