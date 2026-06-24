import { AxiosResponse } from "axios";
export interface IPermissionState {
    permission: any
}

// Define user type
export interface Permission {
  image:string;
}

// Define Different action type
 interface PermissionAction {
    type: string;
    payload: Permission;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

export interface PermissionState {
    permission: any;
    loading: boolean;
    error: boolean;
}
export type PermissionActionsTypes = PermissionAction ;


