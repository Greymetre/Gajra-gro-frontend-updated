import {createAction} from "typesafe-actions";

export const getTransactionList = createAction('GET_TRANSACTIONS', resolve => {
    return (transactionList: object) => resolve(transactionList);
});