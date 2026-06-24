import { AxiosResponse } from "axios";
export interface ISurveyQuestionState {
    surveyquestions: any
}
// Define user type
export interface AddressInterface {
    postalCode: string;
    address: string;
    city : string ;
    state : string;
    country : string;
}

// Define user type
export interface SurveyQuestion {
    firmName: string;
    contactPerson: string;
    phonecode : string ;
    mobile : number;
    email : string;
    surveyquestionType : string;
    address : AddressInterface;
}

// Define Different action type
 interface AddSurveyQuestionAction {
    type: string;
    payload: SurveyQuestion;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

interface DeleteSurveyQuestionAction {
    type: string;
    payload: SurveyQuestion;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

export interface SurveyQuestionState {
    surveyquestions: any;
    loading: boolean;
    error: boolean;
}
export type SurveyQuestionActionsTypes = AddSurveyQuestionAction | DeleteSurveyQuestionAction;
export const SURVEYQUESTION_LIST_REQUEST = "SURVEYQUESTION_LIST_REQUEST"
export const SURVEYQUESTION_LIST_SUCCESS = "SURVEYQUESTION_LIST_SUCCESS"
export const SURVEYQUESTION_LIST_FAIL = "SURVEYQUESTION_LIST_FAIL"
export const SURVEYQUESTION_DETAIL_REQUEST = "SURVEYQUESTION_DETAIL_REQUEST"
export const SURVEYQUESTION_DETAIL_SUCCESS = "SURVEYQUESTION_DETAIL_SUCCESS"
export const SURVEYQUESTION_DETAIL_FAIL = "SURVEYQUESTION_DETAIL_FAIL"
export const SURVEYQUESTION_SAVE_REQUEST = "SURVEYQUESTION_SAVE_REQUEST"
export const SURVEYQUESTION_SAVE_SUCCESS = "SURVEYQUESTION_SAVE_SUCCESS"
export const SURVEYQUESTION_SAVE_FAIL = "SURVEYQUESTION_SAVE_FAIL"
export const SURVEYQUESTION_UPDATE_REQUEST = "SURVEYQUESTION_UPDATE_REQUEST"
export const SURVEYQUESTION_UPDATE_SUCCESS = "SURVEYQUESTION_UPDATE_SUCCESS"
export const SURVEYQUESTION_UPDATE_FAIL = "SURVEYQUESTION_UPDATE_FAIL"
export const SURVEYQUESTION_DELETE_REQUEST = "SURVEYQUESTION_DELETE_REQUEST"
export const SURVEYQUESTION_DELETE_SUCCESS = "SURVEYQUESTION_DELETE_SUCCESS"
export const SURVEYQUESTION_DELETE_FAIL = "SURVEYQUESTION_DELETE_FAIL"

