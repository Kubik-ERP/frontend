// Composable
import { useParamsSerializer } from '@/app/composables/useHttp';
import { useFormatDateLocal, useSnakeCase } from '@/app/composables';

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

import { DataTableSortEvent } from 'primevue';

// Stores
import { useAuthenticationStore } from '@/modules/authentication/store'
import { useDailySalesStore } from '../store';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useDailySalesListService = (businessType?: string): IDailySalesListProvided => {
  /**
   * @description Injected variables
   */
  const authenticationStore = useAuthenticationStore();
  const store = useDailySalesStore(); // Instance of the store
  const { authentication_permissions } = storeToRefs(authenticationStore);
  const { dailySales_isLoading, dailySales_invoiceLists } = storeToRefs(store);
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
    staffId: null
  });

  /**
   * @description Filter columns based on business type
   */
  const filteredColumns = computed(() => {
    if (businessType === 'Retail') {
      // Hide 'Table Number' (tableCode) and 'Order Type' (orderType) for Retail
      return DAILY_SALES_LIST_COLUMNS.filter(
        column => column.value !== 'tableCode' && column.value !== 'orderType',
      );
    }
    return DAILY_SALES_LIST_COLUMNS;
  });

  /**
   * @description Handle fetch api daily sales. We call the dailySales_list function from the store to handle the request.
   */
  const dailySalesList_fetchListInvoices = async (): Promise<void> => {
    try {
      const { createdAtFrom, createdAtTo, ...otherFilter } = dailySalesList_queryParams;

      const filteredParams = {
        ...otherFilter,
        createdAtFrom: createdAtFrom ? useFormatDateLocal(createdAtFrom, true) : null,
        createdAtTo: createdAtTo ? useFormatDateLocal(createdAtTo, true) : null,
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

  /**
   * @description Handle bussiness logic to mapping order direction
   */
  const mapOrderDirection = (val: 0 | 1 | -1 | string | undefined | null): 'asc' | 'desc' | null => {
    if (val === 1) return 'asc';
    if (val === -1) return 'desc';
    return null;
  };

  /**
   * @description Handle business logic for checking if user has permission to manage_staff_member
   */
  const dailySalesList_isUserHasPermissionForManageStaff = computed(() => authentication_permissions.value?.some(
    permission => permission === 'manage_staff_member'
  ));

  /**
   * @description Handle business logic to render dynamic class of order status
   */
  const dailySalesList_getClassOfOrderStatus = (orderStatus: string): string => {
    if (!orderStatus) {
      return '';
    }

    switch (orderStatus.toUpperCase()) {
      case 'PLACED':
        return 'bg-success-background text-success';
      case 'IN_PROGRESS':
        return 'bg-primary-background text-primary';
      case 'WAITING':
        return 'bg-warning-background text-warning-main';
      case 'SERVED':
        return 'bg-secondary-background text-green-primary';
      case 'CANCELLED':
        return 'bg-error-background text-error-main';
      case 'REFUNDED':
        return 'bg-error-background text-error-main';
      case 'COMPLETED':
        return 'bg-complementary-background text-complementary-main';
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

  /**
   * @description Handle sorting changes
   */
  const dailySales_handleOnSortChange = (event: DataTableSortEvent) => {
    dailySalesList_queryParams.orderBy = event.sortField as string | null;
    dailySalesList_queryParams.orderDirection = event.sortOrder;
  };

  return {
    dailySalesList_columns: filteredColumns.value,
    dailySalesList_fetchListInvoices,
    dailySalesList_getClassOfOrderStatus,
    dailySalesList_getClassOfOrderType,
    dailySalesList_getClassOfPaymentStatus,
    dailySalesList_isLoading: dailySales_isLoading,
    dailySalesList_isUserHasPermissionForManageStaff,
    dailySalesList_onChangePage,
    dailySales_handleOnSortChange,
    dailySalesList_queryParams,
    dailySalesList_typesOfOrderType: DAILY_SALES_LIST_TYPES_OF_ORDER_TYPE,
    dailySalesList_typesOfPaymentStatus: DAILY_SALES_LIST_TYPES_OF_PAYMENT_STATUS,
    dailySalesList_typesOfOrderStatus: DAILY_SALES_LIST_TYPES_OF_ORDER_STATUS,
    dailySalesList_values: dailySales_invoiceLists?.value || [],
  };
};
