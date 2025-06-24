import {ORDER_COMPLETE_VALUES,PREPRARING_ORDERS_VALUES} from '../constants'

export const useCustomerWaitingListService = () => {
  const getCustomerWaitingList = () => {
    return {
      preparingOrder : PREPRARING_ORDERS_VALUES,
      orderComplete : ORDER_COMPLETE_VALUES
    };
  };
  return {
    getCustomerWaitingList,
  };
};