import { CUSTOMER_WAITING_LIST_REQUEST } from '../constants';

import { useCustomerWaitingListStore } from '../store';

export const useCustomerWaitingListService = () => {
  const store = useCustomerWaitingListStore();

  const { customerWaitingList_isLoading } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  const getCustomerWaitingList = async (): Promise<unknown> => {
    try {
      const response = await store.customerWaitingList({
        ...httpAbort_registerAbort(CUSTOMER_WAITING_LIST_REQUEST),
      });

      return Promise.resolve({
        data: {
          completedOrders: response.data.completedOrders,
          preparingOrders: response.data.preparingOrders,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };
  return {
    getCustomerWaitingList,
    isLoading: customerWaitingList_isLoading,
  };
};
