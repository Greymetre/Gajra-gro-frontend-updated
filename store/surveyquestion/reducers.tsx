import {
    SURVEYQUESTION_SAVE_REQUEST,
    SURVEYQUESTION_SAVE_SUCCESS,
    SURVEYQUESTION_SAVE_FAIL,
    SURVEYQUESTION_DELETE_REQUEST,
    SURVEYQUESTION_DELETE_SUCCESS,
    SURVEYQUESTION_DELETE_FAIL,
    SurveyQuestionState,
    SurveyQuestionActionsTypes
  } from "./index";
  
  const initialState: SurveyQuestionState = {
    surveyquestions: [],
    loading: false,
    error: false
  };
  
  export default function surveyQuestionsReducer(
    state: SurveyQuestionState = initialState,
    action: SurveyQuestionActionsTypes
  ): SurveyQuestionState {
    switch (action.type) {
      case SURVEYQUESTION_SAVE_REQUEST:
        return { ...state, loading: true };
  
      case 'GET_SURVEYQUESTIONS':
        return {...state, surveyquestions : action.payload};

      case SURVEYQUESTION_SAVE_SUCCESS:
        return { ...state, surveyquestions: action.payload };
  
      case SURVEYQUESTION_SAVE_FAIL:
        return { ...state, loading: false, error: true };
  
      case SURVEYQUESTION_DELETE_REQUEST:
        return { ...state, loading: true };
  
    //   case SURVEYQUESTION_DELETE_SUCCESS:
    //     let newState = [...state.surveyquestions];
    //     newState = newState.filter(user => user.id !== action.payload.id);
    //     return { ...state, surveyquestions: [...newState] };
    //   case SURVEYQUESTION_DELETE_FAIL:
    //     return { ...state, loading: false, error: true };
      default:
        return { ...state };
    }
  }

// import {AnyAction} from "redux";
// import {HYDRATE} from "next-redux-wrapper";
// import { SURVEYQUESTION_SAVE_REQUEST, SURVEYQUESTION_SAVE_SUCCESS, SURVEYQUESTION_SAVE_FAIL } from "../actionTypes"
// import ISurveyQuestionState from "./index";
// const initialState: ISurveyQuestionState = {
//     surveyquestionList: []
// };

// export function surveyquestionsReducer(state: ISurveyQuestionState = initialState, action: AnyAction): ISurveyQuestionState {
//     switch (action.type) {
//         case HYDRATE:
//             // Attention! This will overwrite client state! Real apps should use proper reconciliation.
//             return {...state};
//         case 'GET_SURVEYQUESTIONS':
//             return {...state, surveyquestionList : action.payload};
//         default:
//             return state;
//     }
// }

// export const surveyquestionSaveReducer = (state = { surveyquestion: {} }, action:any) => {
//     switch (action.type) {
//       case SURVEYQUESTION_SAVE_REQUEST:
//         return { loading: true };
//       case SURVEYQUESTION_SAVE_SUCCESS:
//         return { loading: false, success: true, surveyquestion: action.payload };
//       case SURVEYQUESTION_SAVE_FAIL:
//         return { loading: false, error: action.payload };
//       default:
//         return state;
//     }
// }