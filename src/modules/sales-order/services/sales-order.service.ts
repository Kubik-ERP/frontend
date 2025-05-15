// Constants
import { LIST_TABS_SALES_ORDER } from '../constants/sales-order.constant';

// Interfaces
import type { ISalesOrderProvided } from '../interfaces/sales-order.interface';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useSalesOrderService = (): ISalesOrderProvided => {
  /**
   * @description Reactive data binding
   */
  const salesOrder_activeTab = ref<string>('daily-sales');

  return {
    salesOrder_activeTab,
    salesOrder_listTabs: LIST_TABS_SALES_ORDER,
  };
};
