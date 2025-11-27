// Constants
import { CASH_DRAWER_DETAILS_REQUEST } from '@/modules/cash-drawer/constants';

// Interfaces
import {
  ICashierOrderSummaryModalAddCustomer,
  ICashierOrderSummaryModalVoucher,
  ICashierResponseAddCustomer,
  ICashierVoucher,
  ICashierCalulateEstimationData,
} from '../interfaces/cashier-order-summary';
import { ICashierCustomerState, ICashierSelected } from '../interfaces';
import type { ICashierCustomerProvided } from '../interfaces/cashier-customer.interface';

import type { VirtualScrollerLazyEvent } from 'primevue/virtualscroller';
import { MenuItem } from 'primevue/menuitem';

// Router
import { useRoute } from 'vue-router';

// Stores
import { useCashierStore } from '../store';
import { useVoucherStore } from '@/modules/voucher/store';

// Vue
import { computed, ref, watch } from 'vue';

// Composables
import { useRbac } from '@/app/composables/useRbac';
import { useHttpAbort } from '@/app/composables/useHttpAbort';
import { IVoucher } from '@/modules/voucher/interfaces';
import eventBus from '@/plugins/mitt';

// Services
import { useCashDrawerCashRegisterService } from '@/modules/cash-drawer/services/cash-drawer-cash-register.service';
import { useDailySalesListService } from '@/modules/daily-sales/services/daily-sales-list.service';
import { useCashDrawerListService } from '@/modules/cash-drawer/services/cash-drawer-list.service';

export const useCashierCustomerService = (
  cashierProduct_selectedProduct: Ref<ICashierSelected[]>,
  cashierOrder_calculateEstimation: Ref<ICashierCalulateEstimationData>,
  debouncedCalculateEstimation: () => void,
): ICashierCustomerProvided => {
  /**
   * @description Destructure all the data and methods what we need
   */
  const { cashDrawerCashRegister_fetchTrasanctions } = useCashDrawerCashRegisterService();
  const { cashDrawerList_todayStatus } = useCashDrawerListService();
  const { dailySalesList_fetchListInvoices, dailySalesList_queryParams } = useDailySalesListService();
  const { httpAbort_registerAbort } = useHttpAbort();

  // Router
  const route = useRoute();

  // RBAC
  const { hasPermission } = useRbac();

  /**
   * @description Check if user has customer management permission
   */
  const cashierCustomer_hasCustomerManagementPermission = computed(() => hasPermission('customer_management'));

  /**
   * @description Injected variables
   */
  const store = useCashierStore();
  const storeVoucher = useVoucherStore();
  const cashierCustomer_voucherData = ref<ICashierVoucher[]>([]);

  const cashierCustomer_customerState = ref<ICashierCustomerState>({
    isLoading: false,
    customerList: [],
    page: 1,
    limit: 20,
    total: 0,
    selectedCustomer: null,
  });

  /**
   * @description Fetches the customer list from the store.
   * @returns {Promise<void>}
   */
  const cashierCustomer_fetchCustomerList = async (page: number, search: string = '') => {
    cashierCustomer_customerState.value.isLoading = true;
    try {
      const response = await store.cashierProduct_fetchCustomers({
        params: {
          page,
          limit: cashierCustomer_customerState.value.limit,
          search: search || '',
        },
      });

      if (page === 1) {
        cashierCustomer_customerState.value.customerList = response.data.data;
      } else {
        cashierCustomer_customerState.value.customerList.push(...response.data.data);
      }

      cashierCustomer_customerState.value.page = response.data.page;
      cashierCustomer_customerState.value.total = response.data.total;
    } catch (error) {
      console.error(error);
    } finally {
      cashierCustomer_customerState.value.isLoading = false;
    }
  };

  /**
   * @description handle onSearchCustomer
   * @param {string} search
   */
  const cashierCustomer_onSearchCustomer = (search: string) => {
    cashierCustomer_customerState.value.page = 1;
    cashierCustomer_fetchCustomerList(1, search);
  };

  /**
   * @description on scroll fetch more customers
   * @returns {Promise<void>}
   */
  const cashierCustomer_onScrollFetchMoreCustomers = (event: VirtualScrollerLazyEvent) => {
    const { last } = event;

    const customerListLength = cashierCustomer_customerState.value.customerList.length;
    const totalCustomers = cashierCustomer_customerState.value.total;
    const isLoading = cashierCustomer_customerState.value.isLoading;

    if (!isLoading && last >= customerListLength - 1 && customerListLength < totalCustomers) {
      cashierCustomer_customerState.value.page += 1;
      cashierCustomer_fetchCustomerList(cashierCustomer_customerState.value.page);
    }
  };

  const cashierCustomer_modalAddCustomer = ref<ICashierOrderSummaryModalAddCustomer>({
    show: false,
  });

  const cashierCustomer_handleModalAddCustomer = (response: ICashierResponseAddCustomer | null) => {
    cashierCustomer_modalAddCustomer.value.show = !cashierCustomer_modalAddCustomer.value.show;

    if (response) {
      cashierCustomer_customerState.value.selectedCustomer = response.data;
    }
  };

  const cashierCustomer_modalMenuOrderItem = ref({
    show: false,
  });

  const cashierCustomer_menuOrderItem = ref<MenuItem[]>([
    {
      label: 'Cancel Order',
      class: 'text-text-action-error',
      command: () => {
        // This will be handled by the cancel order modal from cashierOrder service
      },
    },
  ]);

  // Modal for voucher selection
  const cashierCustomer_modalVoucher = ref<ICashierOrderSummaryModalVoucher>({
    show: false,
    form: {
      voucherId: '',
      voucher_code: '',
    },
    search: '',
    get data() {
      return cashierCustomer_voucherData.value;
    },
  });

  watch(
    () => [
      cashierProduct_selectedProduct.value,
      cashierCustomer_modalVoucher.value.show,
      cashierCustomer_modalVoucher.value.search,
    ],
    async () => {
      if (cashierCustomer_modalVoucher.value.show && cashierProduct_selectedProduct.value.length > 0) {
        debouncedCalculateEstimation();
        await cashierCustomer_getVoucherActive(
          cashierCustomer_modalVoucher.value.search,
          cashierProduct_selectedProduct.value.map((p: ICashierSelected) => p.productId ?? p.bundlingId ?? ''),
        );
      }

      if (cashierCustomer_modalVoucher.value.form.voucherId) {
        debouncedCalculateEstimation();
      }
    },
  );

  /**
   * @description Handle voucher selection
   * @returns void
   */
  const cashierCustomer_getVoucherActive = async (search: string, productIds?: string[]) => {
    try {
      const response = await storeVoucher.voucherList_getActiveVoucher(search, productIds ?? [], {}, route);
      const data = response.data;

      cashierCustomer_voucherData.value = data.map((voucher: IVoucher) => {
        const total = cashierOrder_calculateEstimation.value.data.grandTotal;
        const isAmountMatch = total >= voucher.minPrice;

        const isAvailable = isAmountMatch;

        return {
          id: voucher.id,
          code: voucher.promoCode,
          label: voucher.promoCode,
          available: isAvailable,
          discount: voucher.amount,
          minPurchase: voucher.minPrice,
          maxDiscount: voucher.maxPrice,
          validFrom: new Date(voucher.startPeriod).toISOString().split('T')[0],
          validUntil: new Date(voucher.endPeriod).toISOString().split('T')[0],
          type: voucher.isPercent ? 'percentage' : 'nominal',
          stock: voucher.quota || 0,
        };
      });
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const cashierCustomer_handleVoucher = (id: string) => {
    cashierCustomer_modalVoucher.value.show = false;
    cashierCustomer_modalVoucher.value.form.voucherId = id;
    debouncedCalculateEstimation();
  };

  /**
   * @description Handle business logic for closing dialog cash drawer overview
   */
  const cashierCustomer_onCloseDialogCashDrawerOverview = () => {
    eventBus.emit('AppBaseDialog', {
      id: 'cashier-cash-drawer-overview-dialog',
      isOpen: false,
    });
  };

  /**
   * @description Handle business logic for closing dialog queue overview
   */
  const cashierCustomer_onCloseDialogQueueOverview = () => {
    eventBus.emit('AppBaseDialog', {
      id: 'cashier-queue-overview-dialog',
      isOpen: false,
    });
  };

  /**
   * @description Handle business logic for closing dialog table overview
   */
  const cashierCustomer_onCloseDialogTableOverview = () => {
    eventBus.emit('AppBaseDialog', {
      id: 'cashier-table-overview-dialog',
      isOpen: false,
    });
  };

  /**
   * @description Fetch cash drawer details specifically for cashier overview
   * This is a wrapper function that allows passing the cash drawer ID
   * @param {string} cashDrawerId - The ID of the cash drawer to fetch details for
   */
  const cashierCustomer_fetchCashDrawerDetailsForOverview = async (cashDrawerId?: string): Promise<void> => {
    try {
      const { useCashDrawerStore } = await import('@/modules/cash-drawer/store');
      const cashDrawerStore = useCashDrawerStore();

      if (!cashDrawerId) {
        throw new Error('Cash drawer ID is required');
      }

      await cashDrawerStore.cashDrawer_details(cashDrawerId, {
        ...httpAbort_registerAbort(CASH_DRAWER_DETAILS_REQUEST),
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
   * @description Handle business logic for showing dialog cash drawer overview
   */
  const cashierCustomer_onOpenDialogCashDrawerOverview = async () => {
    const cashDrawerId = cashDrawerList_todayStatus.value?.id;

    if (!cashDrawerId) {
      console.error('No active cash drawer found');
      return;
    }

    await Promise.all([
      cashierCustomer_fetchCashDrawerDetailsForOverview(cashDrawerId),
      cashDrawerCashRegister_fetchTrasanctions(cashDrawerId),
    ]);

    const argsEventEmitter: IPropsDialog = {
      id: 'cashier-cash-drawer-overview-dialog',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: 'w-fit',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for showing dialog quota overview
   */
  const cashierCustomer_onOpenDialogQueueOverview = async () => {
    dailySalesList_queryParams.createdAtFrom = new Date();
    dailySalesList_queryParams.createdAtTo = new Date();
    await dailySalesList_fetchListInvoices();

    const argsEventEmitter: IPropsDialog = {
      id: 'cashier-queue-overview-dialog',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: 'w-fit',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for showing dialog table overview
   */
  const cashierCustomer_onOpenDialogTableOverview = () => {
    const argsEventEmitter: IPropsDialog = {
      id: 'cashier-table-overview-dialog',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: 'w-[1200px]',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for showing dialog stock overview
   */
  const cashierCustomer_onOpenDialogStockOverview = async () => {
    // Lazy import inventory service only when needed
    const { useInventoryItemsListService } = await import('@/modules/items/services/items-list.service');
    const { inventoryItems_fetchData } = useInventoryItemsListService();

    // Fetch latest inventory data before showing dialog
    await inventoryItems_fetchData();

    const argsEventEmitter: IPropsDialog = {
      id: 'cashier-stock-overview-dialog',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: 'w-[1200px]',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for closing dialog stock overview
   */
  const cashierCustomer_onCloseDialogStockOverview = () => {
    const argsEventEmitter: IPropsDialog = {
      id: 'cashier-stock-overview-dialog',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: 'w-[1200px]',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  return {
    cashierCustomer_customerState,
    cashierCustomer_fetchCustomerList,
    cashierCustomer_getVoucherActive,
    cashierCustomer_handleModalAddCustomer,
    cashierCustomer_handleVoucher,
    cashierCustomer_hasCustomerManagementPermission,
    cashierCustomer_menuOrderItem,
    cashierCustomer_modalAddCustomer,
    cashierCustomer_modalMenuOrderItem,
    cashierCustomer_modalVoucher,
    cashierCustomer_onCloseDialogCashDrawerOverview,
    cashierCustomer_onCloseDialogQueueOverview,
    cashierCustomer_onCloseDialogStockOverview,
    cashierCustomer_onCloseDialogTableOverview,
    cashierCustomer_onOpenDialogCashDrawerOverview,
    cashierCustomer_onOpenDialogQueueOverview,
    cashierCustomer_onOpenDialogStockOverview,
    cashierCustomer_onOpenDialogTableOverview,
    cashierCustomer_onSearchCustomer,
    cashierCustomer_onScrollFetchMoreCustomers,
    cashierCustomer_voucherData,
  } as unknown as ICashierCustomerProvided;
};
