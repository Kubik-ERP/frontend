// Constants
import {
  LIST_COLUMNS_OF_DAILY_SALES,
  LIST_TYPES_OF_ORDER_STATUS,
  LIST_TYPES_OF_ORDER_TYPE,
  LIST_TYPES_OF_PAYMENT_STATUS,
} from '../constants/sales-order.constant';

// Interfaces
import type { IDailySalesData, IDailySalesProvided } from '../interfaces/daily-sales.interface';

// Pinia
import { useSalesOrderStore } from '../store';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useDailySalesService = (): IDailySalesProvided => {
  /**
   * @description Reactive data binding
   */
  const store = useSalesOrderStore();

  /**
   * @description Reactive data binding for daily sales
   */
  const dailySales_data = ref<IDailySalesData>({
    isLoading: false,
    filter: {
      paymentStatus: null,
      createdAtFrom: null,
      id: null,
      orderType: null,
      orderStatus: null,
    },
    items: [],
    meta: {
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
    },
  });

  /**
   * @description Handle business logic to render dynamic class of order status
   */
  const dailySales_getClassOfOrderStatus = (orderStatus: string): string => {
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
  const dailySales_getClassOfOrderType = (orderType: string): string => {
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
  const dailySales_getClassOfPaymentStatus = (paymentStatus: string): string => {
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
   * @description Handle fetch api sales order daily sales
   */
  const dailySales_fetchDailySales = async (): Promise<void> => {
    dailySales_data.value.isLoading = true;

    try {
      const response = await store.salesOrder_fetchDailySales({
        params: {
          ...dailySales_data.value.filter,
          ...dailySales_data.value.meta,
        },
      });

      if (response.items) {
        dailySales_data.value.items = response.items;
        dailySales_data.value.meta = response.meta;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching daily sales:', error.message);
      } else {
        console.error('Error fetching daily sales:', String(error));
      }
    } finally {
      dailySales_data.value.isLoading = false;
    }
  };

  // Initial fetch of daily sales data
  dailySales_fetchDailySales();

  /**
   * @description Debounced function to fetch daily sales data
   */
  const dailySales_debouncedFetch = debounce(dailySales_fetchDailySales, 500);

  /**
   * @description Watch for changes in the filter and trigger debounced fetch
   */
  watch(
    () => dailySales_data.value.filter || dailySales_data.value.meta,
    () => {
      dailySales_debouncedFetch();
    },
    { deep: true },
  );

  return {
    dailySales_getClassOfOrderStatus,
    dailySales_getClassOfOrderType,
    dailySales_getClassOfPaymentStatus,
    dailySales_data,
    dailySales_listColumns: LIST_COLUMNS_OF_DAILY_SALES,
    dailySales_listTypesOfOrderStatus: LIST_TYPES_OF_ORDER_STATUS,
    dailySales_listTypesOfOrderType: LIST_TYPES_OF_ORDER_TYPE,
    dailySales_listTypesOfPaymentStatus: LIST_TYPES_OF_PAYMENT_STATUS,
  };
};
