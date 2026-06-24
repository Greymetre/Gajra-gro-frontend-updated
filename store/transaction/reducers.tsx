import {
    TRANSACTION_SAVE_REQUEST,
    TRANSACTION_SAVE_SUCCESS,
    TRANSACTION_SAVE_FAIL,
    TRANSACTION_DELETE_REQUEST,
    TRANSACTION_DELETE_SUCCESS,
    TRANSACTION_DELETE_FAIL,
    ITransactionState,
    TransactionActionsTypes
  } from "./index";
  
  const initialState: ITransactionState = {
    transactions: [],
    loading: false,
    error: false
  };
  
  export default function transactionsReducer(
    state: ITransactionState = initialState,
    action: TransactionActionsTypes
  ): ITransactionState {
    switch (action.type) {
      case TRANSACTION_SAVE_REQUEST:
        return { ...state, loading: true };
      case 'GET_TRANSACTIONS':
        return {...state, transactions : action.payload};

      case TRANSACTION_SAVE_SUCCESS:
        return { ...state, transactions: action.payload };
  
      case TRANSACTION_SAVE_FAIL:
        return { ...state, loading: false, error: true };
  
      case TRANSACTION_DELETE_REQUEST:
        return { ...state, loading: true };
      default:
        return { ...state };
    }
  }