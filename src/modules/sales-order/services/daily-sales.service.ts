// Constants
import { useParamsSerializer } from '@/app/composables/useHttp';
import {
  LIST_COLUMNS_OF_DAILY_SALES,
  LIST_TYPES_OF_ORDER_STATUS,
  LIST_TYPES_OF_ORDER_TYPE,
  LIST_TYPES_OF_PAYMENT_STATUS,
} from '../constants/sales-order.constant';

// Interfaces
import type { IDailySalesData, IDailySalesProvided } from '../interfaces/daily-sales.interface';
import { DataTableSortEvent } from 'primevue';

// Pinia
import { useSalesOrderStore } from '../store';
import { useFormatDateLocal, useSnakeCase } from '@/app/composables';

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
      createdAtTo: null,
      invoiceNumber: null,
      orderType: null,
      orderStatus: null,
    },
    sorting: {
      orderBy: null,
      orderDirection: null,
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


  const mapOrderDirection = (val: 0 | 1 | -1 | undefined | null): 'asc' | 'desc' | null => {
    if (val === 1) return 'asc';
    if (val === -1) return 'desc';
    return null;
  }

  /**
   * @description Handle fetch api sales order daily sales
   */
  const dailySales_fetchDailySales = async (): Promise<void> => {
    dailySales_data.value.isLoading = true;

    try {
      const { createdAtFrom, createdAtTo, ...otherFilter } = dailySales_data.value.filter;

      const filteredParams = {
        ...otherFilter,
        createdAtFrom: createdAtFrom ? useFormatDateLocal(createdAtFrom) : null,
        createdAtTo: createdAtTo ? useFormatDateLocal(createdAtTo) : null,
      };
      
      const filteredSorting = {
        orderBy: useSnakeCase(dailySales_data.value.sorting.orderBy?.toString()) || null,
        orderDirection: mapOrderDirection(dailySales_data.value.sorting.orderDirection),
      }

      const response = await store.salesOrder_fetchDailySales({
        params: {
          ...filteredParams,
          ...filteredSorting,
          ...dailySales_data.value.meta,
        },
        paramsSerializer: useParamsSerializer,
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

  watch(
    () => dailySales_data.value.sorting,
     () => {
      dailySales_debouncedFetch();
    },
    { deep: true },
  )

  const dailySales_handleOnPageChange = (page: number): void => {
    dailySales_data.value.meta.page = page;

    dailySales_debouncedFetch();
  };

  const dailySales_handleOnSortChange = (event: DataTableSortEvent) => {
    dailySales_data.value.sorting.orderBy = event.sortField as string | null;
    dailySales_data.value.sorting.orderDirection = event.sortOrder;
  }

  return {
    dailySales_getClassOfOrderStatus,
    dailySales_getClassOfOrderType,
    dailySales_getClassOfPaymentStatus,
    dailySales_handleOnPageChange,
    dailySales_handleOnSortChange,
    dailySales_data,
    dailySales_listColumns: LIST_COLUMNS_OF_DAILY_SALES,
    dailySales_listTypesOfOrderStatus: LIST_TYPES_OF_ORDER_STATUS,
    dailySales_listTypesOfOrderType: LIST_TYPES_OF_ORDER_TYPE,
    dailySales_listTypesOfPaymentStatus: LIST_TYPES_OF_PAYMENT_STATUS,
  };
};
