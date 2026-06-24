import {createAction} from "typesafe-actions";
import { backendPostAddNewSurveyQuestion} from "../../helpers/backend_helper"
import { Dispatch } from "redux";
import { SurveyQuestion, SurveyQuestionActionsTypes, SURVEYQUESTION_SAVE_REQUEST, SURVEYQUESTION_SAVE_SUCCESS, SURVEYQUESTION_SAVE_FAIL } from "./index";

export const getSurveyQuestionList = createAction('GET_SURVEYQUESTIONS', resolve => {
    return (surveyquestionList: object) => resolve(surveyquestionList);
});

export const saveSurveyQuestionAction = (surveyquestion: SurveyQuestion): SurveyQuestionActionsTypes => ({
    type: SURVEYQUESTION_SAVE_REQUEST,
    payload: surveyquestion,
    subtypes: [SURVEYQUESTION_SAVE_REQUEST, SURVEYQUESTION_SAVE_SUCCESS, SURVEYQUESTION_SAVE_FAIL],
    promise: backendPostAddNewSurveyQuestion(surveyquestion)
});

// = (surveyquestion:any) => async (dispatch:any, getState:any) => {
//     try {
//       dispatch({ type: SURVEYQUESTION_SAVE_REQUEST, payload: surveyquestion });
//         await backendPostAddNewSurveyQuestion(surveyquestion).then(async (response) => {
//             if (!response.isError)
//             {
//                 dispatch({ type: SURVEYQUESTION_SAVE_SUCCESS, payload: response.data });
//             }
//             else{
//                 dispatch({ type: SURVEYQUESTION_SAVE_FAIL, payload: response.message });
//             } 
//         },
//         error => {
//             dispatch({ type: SURVEYQUESTION_SAVE_FAIL, payload: error });
//         });
//     } catch (error) {
//         dispatch({ type: SURVEYQUESTION_SAVE_FAIL, payload: error });
//     }
//   };