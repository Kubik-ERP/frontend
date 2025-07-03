// Constants
import { LIST_TABS_SALES_ORDER } from '../constants/sales-order.constant';

// Interfaces
import type { ISalesOrderProvided } from '../interfaces/sales-order.interface';

// Services
import { useCashDrawerListService } from '@/modules/cash-drawer/services/cash-drawer-list.service';
import { useDailySalesListService } from '@/modules/daily-sales/services/daily-sales-list.service';
import { useStaffMemberListService } from '@/modules/staff-member/services/staff-member-list.service';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useSalesOrderService = (): ISalesOrderProvided => {
  /**
   * @description Destructure all the data and methods what we need
   */
  const { cashDrawerList_fetchListTransactions } = useCashDrawerListService();
  const { dailySalesList_fetchListInvoices } = useDailySalesListService();
  const { staffMemberList_fetchListMembers } = useStaffMemberListService();

  /**
   * @description Reactive data binding
   */
  const salesOrder_activeTab = ref<string>('daily-sales');

  /**
   * @description Watch active tab changes
   */
  watch(
    salesOrder_activeTab,
    async newTab => {
      switch (newTab.toUpperCase()) {
        case 'DAILY-SALES': {
          await dailySalesList_fetchListInvoices();
          break;
        }
        case 'SALES-ORDER': {
          // Handle logic for sales order tab
          break;
        }
        case 'CASH-DRAWER': {
          // Handle logic for cash drawer tab
          await Promise.all([staffMemberList_fetchListMembers(), cashDrawerList_fetchListTransactions()]);

          break;
        }
        default: {
          console.warn(`Unknown tab: ${newTab}`);
        }
      }
    },
    {
      immediate: true,
    },
  );

  return {
    salesOrder_activeTab,
    salesOrder_listTabs: LIST_TABS_SALES_ORDER,
  };
};
