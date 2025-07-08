import { CUSTOMER_WAITING_LIST_REQUEST } from '../constants';

import { useCustomerWaitingListStore } from '../store';
import { useOutletStore } from '@/modules/outlet/store';

export const useCustomerWaitingListService = () => {
  const store = useCustomerWaitingListStore();

  const outletStore = useOutletStore();

  const { customerWaitingList_isLoading } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  const getCustomerWaitingList = async (page: number, pageSize: number): Promise<unknown> => {
    try {
      const storeID = outletStore.outlet_currentOutlet?.id as string;

      const params = {
        'X-STORE-ID': storeID,
        page,
        pageSize,
      };

      return await store.customerWaitingList(
        {
          ...params,
        },
        {
          ...httpAbort_registerAbort(CUSTOMER_WAITING_LIST_REQUEST),
        },
      );
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
