// Constants
import {
  DAILY_SALES_LIST_COLUMNS,
  DAILY_SALES_LIST_REQUEST,
  DAILY_SALES_LIST_TYPES_OF_ORDER_STATUS,
  DAILY_SALES_LIST_TYPES_OF_ORDER_TYPE,
  DAILY_SALES_LIST_TYPES_OF_PAYMENT_STATUS,
} from '../constants';

// Interfaces
import type {
  IDailySalesListProvided,
  IDailySalesListRequestQuery,
} from '../interfaces/daily-sales-list.interface';

// Stores
import { useDailySalesStore } from '../store';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useDailySalesListService = (): IDailySalesListProvided => {
  /**
   * @description Injected variables
   */
  const store = useDailySalesStore(); // Instance of the store
  const { dailySales_isLoading, dailySales_invoiceLists } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const dailySalesList_queryParams = reactive<IDailySalesListRequestQuery>({
    createdAtFrom: null,
    id: null,
    orderStatus: null,
    orderType: null,
    page: 1,
    pageSize: 10,
    paymentStatus: null,
  });

  /**
   * @description Handle fetch api daily sales. We call the dailySales_list function from the store to handle the request.
   */
  const dailySalesList_fetchListInvoices = async (): Promise<void> => {
    try {
      await store.dailySales_list(dailySalesList_queryParams, {
        ...httpAbort_registerAbort(DAILY_SALES_LIST_REQUEST),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic to render dynamic class of order status
   */
  const dailySalesList_getClassOfOrderStatus = (orderStatus: string): string => {
    if (!orderStatus) {
      return '';
    }

    switch (orderStatus.toUpperCase()) {
      case 'IN_PROGRESS':
        return 'bg-primary-background text-primary';
      case 'WAITING':
        return 'bg-warning-background text-warning-main';
      case 'SERVED':
        return 'bg-secondary-background text-green-primary';
      case 'CANCELLED':
        return 'bg-error-background text-error-main';
      default:
        return '';
    }
  };

  /**
   * @description Handle business logic to render dynamic class of order type
   */
  const dailySalesList_getClassOfOrderType = (orderType: string): string => {
    if (!orderType) {
      return '';
    }

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

  /**
   * @description Handle business logic to render dynamic class of payment status
   */
  const dailySalesList_getClassOfPaymentStatus = (paymentStatus: string): string => {
    if (!paymentStatus) {
      return '';
    }

    switch (paymentStatus.toUpperCase()) {
      case 'PAID':
        return 'bg-primary-background text-primary';
      case 'UNPAID':
        return 'bg-warning-background text-warning-main';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-error-background text-error-main';
      default:
        return '';
    }
  };

  /**
   * @description Handle business logic for changing page size
   */
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

  return {
    dailySalesList_columns: DAILY_SALES_LIST_COLUMNS,
    dailySalesList_fetchListInvoices,
    dailySalesList_getClassOfOrderStatus,
    dailySalesList_getClassOfOrderType,
    dailySalesList_getClassOfPaymentStatus,
    dailySalesList_isLoading: dailySales_isLoading,
    dailySalesList_onChangePage,
    dailySalesList_queryParams,
    dailySalesList_typesOfOrderType: DAILY_SALES_LIST_TYPES_OF_ORDER_TYPE,
    dailySalesList_typesOfPaymentStatus: DAILY_SALES_LIST_TYPES_OF_PAYMENT_STATUS,
    dailySalesList_typesOfOrderStatus: DAILY_SALES_LIST_TYPES_OF_ORDER_STATUS,
    dailySalesList_values: dailySales_invoiceLists.value,
  };
};
