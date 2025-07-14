import { QUEUE_LIST_COLUMNS, ORDER_STATUS_LIST, DAILY_SALES_LIST_REQUEST, ORDER_TYPE_LIST } from '../constants';

import eventBus from '@/plugins/mitt';

import { useQueueStore } from '../store';

import type { IDailySalesListRequestQuery } from '../interfaces';

import { DataTableSortEvent } from 'primevue';

export const useQueueService = () => {
  const store = useQueueStore();
  const { queue_isLoading, dailySales_invoiceLists } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const dailySalesList_queryParams = reactive<IDailySalesListRequestQuery>({
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
  /**
   * @description Handle bussiness logic to mapping order direction
   */
  const mapOrderDirection = (val: 0 | 1 | -1 | string | undefined | null): 'asc' | 'desc' | null => {
    if (val === 1) return 'asc';
    if (val === -1) return 'desc';
    return null;
  };

  /**
   * @description Handle fetch api daily sales. We call the dailySales_list function from the store to handle the request.
   */
  const dailySalesList_fetchListInvoices = async (): Promise<void> => {
    try {
      const { createdAtFrom, createdAtTo, ...otherFilter } = dailySalesList_queryParams;

      const filteredParams = {
        ...otherFilter,
        createdAtFrom: createdAtFrom ? useFormatDateLocal(createdAtFrom) : null,
        createdAtTo: createdAtTo ? useFormatDateLocal(createdAtTo) : null,
      };

      const filteredSorting = {
        orderBy: useSnakeCase(dailySalesList_queryParams.orderBy?.toString()) || null,
        orderDirection: mapOrderDirection(dailySalesList_queryParams.orderDirection),
      };

      await store.dailySales_list(
        {
          ...(filteredParams as Partial<IDailySalesListRequestQuery>),
          ...filteredSorting,
        } as IDailySalesListRequestQuery,
        {
          ...httpAbort_registerAbort(DAILY_SALES_LIST_REQUEST),
          paramsSerializer: useParamsSerializer,
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

  const dailySalesList_onChangePage = (page: number): void => {
    dailySalesList_queryParams.page = page;
  };

  /**
   * @description Watcher for query parameters changes
   */
  watch(
    () => dailySalesList_queryParams,
    debounce(async () => {
      await dailySalesList_fetchListInvoices();
    }, 500),
    { deep: true },
  );

  /**
   * @description Handle sorting changes
   */
  const dailySales_handleOnSortChange = (event: DataTableSortEvent) => {
    dailySalesList_queryParams.orderBy = event.sortField as string | null;
    dailySalesList_queryParams.orderDirection = event.sortOrder;
  };

  const changeOrderStatus = async (id: string, orderStatus: string) => {
    try {
      const response = await store.fetchQueue_updateOrderStatus(
        id,
        {
          orderStatus,
        },
        {
          ...httpAbort_registerAbort('QUEUE_UPDATE_ORDER_SALES'),
        },
      );

      console.log(response.data.message);

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: response.data.message,
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic to render dynamic class of order type
   */
  const orderTypeClass = (orderType: string): string => {
    switch (orderType.toUpperCase()) {
      case 'DINE_IN':
        return 'bg-primary-background text-primary';
      case 'TAKE_AWAY':
        return 'bg-secondary-background text-green-primary';
      case 'SELF_ORDER':
        return 'bg-complementary-background text-complementary-main';
      default:
        return '';
    }
  };

  const orderStatusClass = (orderStatus: string) => {
    switch (orderStatus) {
      case 'placed':
        return 'bg-complementary-background text-complementary-main';
      case 'in_progress':
        return 'bg-primary-background text-primary';
      case 'served':
        return 'bg-secondary-background text-green-primary';
      case 'completed':
        return 'bg-secondary-background text-secondary';
      case 'cancelled':
        return 'bg-error-background text-error-main';
      default:
        return '';
    }
  };

  const calculateDeltaHHMMSS = (createdAt: string, updatedAt: string): string => {
    // 1. Convert strings to Date objects
    const createdDate = new Date(createdAt);
    const updatedDate = new Date(updatedAt);

    // Check for invalid dates
    if (isNaN(createdDate.getTime()) || isNaN(updatedDate.getTime())) {
      return 'Invalid Dates';
    }

    // 2. Calculate the difference in milliseconds
    const deltaMilliseconds = Math.abs(updatedDate.getTime() - createdDate.getTime());

    // 3. Convert milliseconds to hours, minutes, and seconds
    const totalSeconds = Math.floor(deltaMilliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600); // Calculate hours
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Calculate remaining minutes
    const seconds = totalSeconds % 60; // Calculate remaining seconds

    // 4. Format hours, minutes, and seconds to always have two digits
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    // 5. Return the new HH:MM:SS format
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  return {
    queueColumns: QUEUE_LIST_COLUMNS,
    orderStatusList: ORDER_STATUS_LIST,
    orderTypeList: ORDER_TYPE_LIST,
    changeOrderStatus,
    orderStatusClass,
    orderTypeClass,
    calculateDeltaHHMMSS,

    dailySalesList_isLoading: queue_isLoading,
    dailySalesList_onChangePage,
    dailySales_handleOnSortChange,
    dailySalesList_queryParams,
    dailySalesList_values: dailySales_invoiceLists.value,

    dailySalesList_fetchListInvoices,
  };
};
