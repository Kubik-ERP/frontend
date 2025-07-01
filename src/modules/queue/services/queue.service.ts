import { QUEUE_LIST_COLUMNS, QUEUE_LIST_REQUEST, ORDER_STATUS_LIST, ORDER_TYPE_LIST } from '../constants';
import { useFormatDateLocal, useSnakeCase } from '@/app/composables';
import { useQueueStore } from '../store';

import { DataTableSortEvent } from 'primevue';

import type { IQueueListRequestQuery } from '../interfaces';

export const useQueueService = () => {

  const store = useQueueStore();
  const { queue_isLoading, queue_invoiceLists } = storeToRefs(store);
  const {httpAbort_registerAbort} = useHttpAbort();

  

  const queueList_queryParams = reactive<IQueueListRequestQuery>({
    createdAtFrom: null,
    createdAtTo: null,
    invoiceNumber: null,
    orderStatus: null,
    orderType: null,
    page: 1,
    pageSize: 10,
    paymentStatus: null,
    orderBy: null,
    orderDirection: null,
  });

  const queueList_fetchListInvoices = async (): Promise<void> => {
    try {
      const { createdAtFrom, createdAtTo, ...otherFilter } = queueList_queryParams;

      const filteredParams = {
        ...otherFilter,
        createdAtFrom: createdAtFrom ? useFormatDateLocal(createdAtFrom) : null,
        createdAtTo: createdAtTo ? useFormatDateLocal(createdAtTo) : null,
      };

      const filteredSorting = {
        orderBy: useSnakeCase(queueList_queryParams.orderBy?.toString()) || null,
        orderDirection: mapOrderDirection(queueList_queryParams.orderDirection),
      };

      await store.dailySales_list(
        {
          ...(filteredParams as Partial<IQueueListRequestQuery>),
          ...filteredSorting,
        } as IQueueListRequestQuery,
        {
          ...httpAbort_registerAbort(QUEUE_LIST_REQUEST),
          paramsSerializer: useParamsSerializer,
        },
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  };

   const mapOrderDirection = (val: 0 | 1 | -1 | string | undefined | null): 'asc' | 'desc' | null => {
    if (val === 1) return 'asc';
    if (val === -1) return 'desc';
    return null;
  };

   /**
   * @description Handle business logic for changing page size
   */
  const queueList_onChangePage = (page: number): void => {
    queueList_queryParams.page = page;
  };

  /**
   * @description Watcher for query parameters changes
   */
  watch(
    () => queueList_queryParams,
    debounce(async () => {
      await queueList_fetchListInvoices();
    }, 500),
    { deep: true },
  );

  /**
   * @description Handle sorting changes
   */
  const queue_handleOnSortChange = (event: DataTableSortEvent) => {
    queueList_queryParams.orderBy = event.sortField as string | null;
    queueList_queryParams.orderDirection = event.sortOrder;
  };
  

  return {
    queueColumns: QUEUE_LIST_COLUMNS,
    queueValues: queueList_fetchListInvoices,
    OrderStatusList: ORDER_STATUS_LIST,
    OrderTypeList: ORDER_TYPE_LIST,
    queue_isLoading,
    queue_invoiceLists,
    queueList_queryParams,
    queueList_onChangePage,
    queue_handleOnSortChange,
  };
};
