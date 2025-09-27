// Constants
import {
  CASHIER_PROVIDER,
  CASHIER_ORDER_TYPE,
  CASHIER_DUMMY_LIST_FLOOR,
  CASHIER_DUMMY_LIST_TABLE,
  CASHIER_DUMMY_PARAMS_SIMULATE_PAYMENT,
} from '../constants';

// Helpers
import { debounce } from '@/app/helpers/debounce.helper';

// Interfaces
import {
  ICashierCalulateEstimationData,
  ICashierListTable,
  ICashierOrderSummary,
  ICashierOrderSummaryData,
  ICashierOrderSummaryModalAddCustomer,
  ICashierOrderSummaryModalAddEdit,
  ICashierOrderSummaryModalCancelOrder,
  ICashierOrderSummaryModalInvoiceDetail,
  ICashierOrderSummaryModalOrderType,
  ICashierOrderSummaryModalPaymentMethod,
  ICashierOrderSummaryModalPlaceOrder,
  ICashierOrderSummaryModalPlaceOrderConfirmation,
  ICashierOrderSummaryModalSelectTable,
  ICashierOrderSummaryModalVoucher,
  ICashierOrderSummaryProvided,
  ICashierResponseAddCustomer,
  ICashierVoucher,
} from '../interfaces/cashier-order-summary';

import { ICashierCustomer, ICashierResponseWebsocketMessage } from '../interfaces/cashier-response';

import type { MenuPassThroughAttributes } from 'primevue';

import type { VirtualScrollerLazyEvent } from 'primevue/virtualscroller';

import { MenuItem } from 'primevue/menuitem';

// Router
import { useRouter, useRoute } from 'vue-router';

// Stores
import { useCashierStore } from '../store';
import { useInvoiceStore } from '@/modules/invoice/store';
import { useOutletStore } from '@/modules/outlet/store';

// Socket
import { useSocket } from '@/plugins/socket';

// Vue
import { ref, computed } from 'vue';
import { ICashierCustomerState, ICashierSelected } from '../interfaces';

// Composables
import { useRbac } from '@/app/composables/useRbac';
import useVuelidate from '@vuelidate/core';
import { minValue, numeric, required } from '@vuelidate/validators';
import { useVoucherStore } from '@/modules/voucher/store';
import { IVoucher } from '@/modules/voucher/interfaces';
import eventBus from '@/plugins/mitt';

// Services
import { useCashDrawerCashRegisterService } from '@/modules/cash-drawer/services/cash-drawer-cash-register.service';
import { useDailySalesListService } from '@/modules/daily-sales/services/daily-sales-list.service';
import { useCashDrawerListService } from '@/modules/cash-drawer/services/cash-drawer-list.service';

export const useCashierOrderSummaryService = (): ICashierOrderSummaryProvided => {
  /**
   * @description Destructure all the data and methods what we need
   */
  const { cashDrawerCashRegister_fetchCashDrawerDetails, cashDrawerCashRegister_fetchTrasanctions } =
    useCashDrawerCashRegisterService();
  const { cashDrawerList_todayStatus } = useCashDrawerListService();
  const { dailySalesList_fetchListInvoices, dailySalesList_queryParams } = useDailySalesListService();

  // Router
  const router = useRouter();
  const route = useRoute();

  // RBAC
  const { hasPermission } = useRbac();

  /**
   * @description Check if user has customer management permission
   */
  const hasCustomerManagementPermission = computed(() => hasPermission('customer_management'));

  /**
   * @description Check if the current outlet business type is retail
   */
  const cashierOrderSummary_isRetailBusinessType = computed(
    () => storeOutlet.outlet_currentOutlet?.businessType === 'Retail',
  );

  /**
   * @description Injected variables
   */
  const store = useCashierStore();
  const storeOutlet = useOutletStore();
  const storeInvoice = useInvoiceStore();
  const storeVoucher = useVoucherStore();
  const voucherData = ref<ICashierVoucher[]>([]);
  const { cashierProduct_selectedProduct } = storeToRefs(store);

  /**
   * @description Reactive data binding
   */
  const cashierOrderSummary_isShowQuickOverview = ref<boolean>(false);

  const cashierOrderSummary_modalOrderSummary = ref({
    show: false,
  });

  // Reactive data binding
  const cashierOrderSummary_modalOrderType = ref<ICashierOrderSummaryModalOrderType>({
    show: false,
    selectedOrderType: 'dine_in',
    data: CASHIER_ORDER_TYPE.filter(item => (route.name === 'self-order' ? true : item.code !== 'self_order')),
  });

  const cashierProduct_customerState = ref<ICashierCustomerState>({
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
  const cashierProduct_fetchCustomerList = async (page: number, search: string = '') => {
    cashierProduct_customerState.value.isLoading = true;
    try {
      const response = await store.cashierProduct_fetchCustomers({
        params: {
          page,
          limit: cashierProduct_customerState.value.limit,
          search: search || '',
        },
      });

      if (page === 1) {
        cashierProduct_customerState.value.customerList = response.data.data;
      } else {
        cashierProduct_customerState.value.customerList.push(...response.data.data);
      }

      cashierProduct_customerState.value.page = response.data.page;
      cashierProduct_customerState.value.total = response.data.total;
    } catch (error) {
      console.error(error);
    } finally {
      cashierProduct_customerState.value.isLoading = false;
    }
  };

  /**
   * @description handle onSearchCustomer
   * @param {string} search
   */
  const cashierProduct_onSearchCustomer = (search: string) => {
    cashierProduct_customerState.value.page = 1;
    cashierProduct_fetchCustomerList(1, search);
  };

  /**
   * @description on scroll fetch more customers
   * @returns {Promise<void>}
   */
  const cashierProduct_onScrollFetchMoreCustomers = (event: VirtualScrollerLazyEvent) => {
    const { last } = event;

    const customerListLength = cashierProduct_customerState.value.customerList.length;
    const totalCustomers = cashierProduct_customerState.value.total;
    const isLoading = cashierProduct_customerState.value.isLoading;

    if (!isLoading && last >= customerListLength - 1 && customerListLength < totalCustomers) {
      cashierProduct_customerState.value.page += 1;
      cashierProduct_fetchCustomerList(cashierProduct_customerState.value.page);
    }
  };

  // Modal for invoice detail
  const cashierOrderSummary_modalInvoiceDetail = ref<ICashierOrderSummaryModalInvoiceDetail>({
    show: false,
    value: null,
    form: {
      received_by: '',
      notes: '',
    },
  });

  /**
   * @description Handle invoice detail submission
   * @returns void
   */
  const cashierOrderSummary_handleInvoiceDetail = () => {};

  // Modal for cancel order
  const cashierOrderSummary_modalCancelOrder = ref<ICashierOrderSummaryModalCancelOrder>({
    show: false,
  });

  /**
   * @description Handle cancel order action
   * @returns void
   */
  const cashierOrderSummary_handleCancelOrder = () => {
    cashierOrderSummary_summary.value.product = [];
    cashierOrderSummary_summary.value.orderType = 'dine_in';
    cashierOrderSummary_modalPaymentMethod.value.selectedPaymentMethod = '';
    cashierProduct_customerState.value.selectedCustomer = {} as ICashierCustomer;
    cashierOrderSummary_modalSelectTable.value.selectedTable = [];
    cashierOrderSummary_modalVoucher.value.form = { voucherId: '', voucher_code: '' };
    cashierProduct_selectedProduct.value = [];
    cashierOrderSummary_modalCancelOrder.value.show = false;
  };

  // Modal for payment method selection
  const cashierOrderSummary_modalPaymentMethod = ref<ICashierOrderSummaryModalPaymentMethod>({
    show: false,
    isLoading: false,
    selectedPaymentMethod: '',
    data: [],
  });

  const cashierOrderSummary_calculateEstimation = ref<ICashierCalulateEstimationData>({
    isLoading: false,
    data: {
      total: 0,
      subTotal: 0,
      discountTotal: 0,
      grandTotal: 0,
      serviceCharge: 0,
      roundingAdjustment: 0,
      serviceChargeInclude: false,
      tax: 0,
      taxInclude: false,
      items: [],
      totalProductDiscount: 0,
      voucherAmount: 0,
    },
  });

  /**
   * @description Handle order type selection
   * @returns void
   */
  const cashierOrderSummary_handleFetchPaymentMethod = async () => {
    cashierOrderSummary_modalPaymentMethod.value.isLoading = true;

    try {
      const response = await store.cashierProduct_fetchPaymentMethod(route.name === 'self-order', route, {});

      cashierOrderSummary_modalPaymentMethod.value.data = response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      cashierOrderSummary_modalPaymentMethod.value.isLoading = false;
    }
  };

  /**
   * @description Handle payment method selection
   * @returns void
   */
  const cashierOrderSummary_handlePaymentMethod = async () => {};

  // Watch for changes in payment method modal visibility
  watch(
    () => cashierOrderSummary_modalPaymentMethod.value.show,
    value => {
      if (value) {
        cashierOrderSummary_handleFetchPaymentMethod();
      }
    },
  );

  // Modal for selecting table
  const cashierOrderSummary_modalSelectTable = ref<ICashierOrderSummaryModalSelectTable>({
    show: false,
    selectedTable: [],
    activeFloor: 1,
    listFloor: CASHIER_DUMMY_LIST_FLOOR,
    data: CASHIER_DUMMY_LIST_TABLE as ICashierListTable[],
  });

  /**
   * @description Handle table selection toggle
   * @param {string} table - The table to toggle selection for
   * @returns void
   */
  const cashierOrderSummary_handleToggleSelectTable = (table: string) => {
    const index = cashierOrderSummary_modalSelectTable.value.selectedTable.indexOf(table);

    if (index === -1) {
      cashierOrderSummary_modalSelectTable.value.selectedTable.push(table);
    } else {
      cashierOrderSummary_modalSelectTable.value.selectedTable.splice(index, 1);
    }
  };

  /**
   * @description Handle table selection
   * @returns void
   */
  const cashierOrderSummary_handleSelectTable = () => {};

  // Computed property to get active floor tables
  const cashierOrderSummary_getListActiveFloor = computed(() => {
    const activeFloor = cashierOrderSummary_modalSelectTable.value.data.filter(
      data => data.floor === cashierOrderSummary_modalSelectTable.value.activeFloor,
    );

    return activeFloor;
  });

  // Modal for voucher selection
  const cashierOrderSummary_modalVoucher = ref<ICashierOrderSummaryModalVoucher>({
    show: false,
    form: {
      voucherId: '',
      voucher_code: '',
    },
    search: '',
    get data() {
      return voucherData.value;
    },
  });

  watch(
    () => cashierProduct_selectedProduct.value,
    () => {
      localStorage.setItem('shoppingCart', JSON.stringify(cashierProduct_selectedProduct.value));
    },
    { deep: true },
  );
  watch(
    () => [
      cashierProduct_selectedProduct.value,
      cashierOrderSummary_modalVoucher.value.show,
      cashierOrderSummary_modalVoucher.value.search,
    ],
    async () => {
      if (cashierOrderSummary_modalVoucher.value.show && cashierProduct_selectedProduct.value.length > 0) {
        debouncedCalculateEstimation();
        await getVoucherActive(
          cashierOrderSummary_modalVoucher.value.search,
          cashierProduct_selectedProduct.value.map(p => p.productId),
        );
      }

      if (cashierOrderSummary_modalVoucher.value.form.voucherId) {
        debouncedCalculateEstimation();
      }
    },
  );

  /**
   * @description Handle voucher selection
   * @returns void
   */
  const cashierOrderSummary_data = ref<ICashierOrderSummaryData>({
    customerName: '',
    orderId: '1234',
    orderType: '',
    tableNumber: '',
    voucherId: '',
    paymentMethod: '',
    isExpanded: true,
    isExpandedVisible: false,
  });

  /**
   * @description Debounce function to handle watch changes
   */
  const debouncedHandleWatchChanges = debounce(() => {
    // If user doesn't have customer management permission, only check order type
    // For retail business type, skip customer validation as it's not required
    const customerCheck =
      hasCustomerManagementPermission.value && !cashierOrderSummary_isRetailBusinessType.value
        ? cashierProduct_customerState.value.selectedCustomer?.id
        : true; // Skip customer validation if no permission or retail business type

    const tableCheck = hasCustomerManagementPermission.value
      ? cashierOrderSummary_modalSelectTable.value.selectedTable.length > 0
      : true; // Skip table validation if no permission

    if (customerCheck && cashierOrderSummary_modalOrderType.value.selectedOrderType && tableCheck) {
      cashierOrderSummary_data.value.isExpanded = false;
      cashierOrderSummary_data.value.isExpandedVisible = true;
    } else {
      cashierOrderSummary_data.value.isExpanded = true;
      cashierOrderSummary_data.value.isExpandedVisible = false;
    }
  }, 500);

  // watch for changes if customerName, orderType, and tableNumber are filled change isExpanded to false
  watch(
    () => [
      cashierProduct_customerState.value.selectedCustomer?.id,
      cashierOrderSummary_modalOrderType.value.selectedOrderType,
      cashierOrderSummary_modalSelectTable.value.selectedTable,
    ],
    () => {
      debouncedHandleWatchChanges();
    },
    { immediate: true, deep: true },
  );

  const cashierOrderSummary_modalAddCustomer = ref<ICashierOrderSummaryModalAddCustomer>({
    show: false,
  });

  const cashierOrderSummary_handleModalAddCustomer = (response: ICashierResponseAddCustomer | null) => {
    cashierOrderSummary_modalAddCustomer.value.show = !cashierOrderSummary_modalAddCustomer.value.show;

    if (response) {
      cashierProduct_customerState.value.selectedCustomer = response.data;
    }
  };

  /**
   * @description Handle isExpanded toggle
   */
  const cashierOrderSummary_handleIsExpandedToggle = () => {
    cashierOrderSummary_data.value.isExpanded = !cashierOrderSummary_data.value.isExpanded;
  };

  const cashierOrderSummary_menuOrder = ref<MenuPassThroughAttributes>({} as MenuPassThroughAttributes);

  const cashierOrderSummary_modalMenuOrderItem = ref({
    show: false,
  });

  const cashierOrderSummary_menuOrderItem = ref<MenuItem[]>([
    {
      label: 'Cancel Order',
      class: 'text-text-action-error',
      command: () => {
        cashierOrderSummary_modalCancelOrder.value.show = true;
      },
    },
  ]);

  /**
   * @description Handle voucher selection
   * @returns void
   */
  const getVoucherActive = async (search: string, productIds?: string[]) => {
    try {
      const response = await storeVoucher.voucherList_getActiveVoucher(search, productIds ?? []);
      const data = response.data;

      voucherData.value = data.map((voucher: IVoucher) => {
        const total = cashierOrderSummary_calculateEstimation.value.data.grandTotal;
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

  const cashierOrderSummary_handleVoucher = (id: string) => {
    cashierOrderSummary_modalVoucher.value.show = false;
    cashierOrderSummary_modalVoucher.value.form.voucherId = id;
    debouncedCalculateEstimation();
  };

  const cashierOrderSummary_modalAddEditNotes = ref<ICashierOrderSummaryModalAddEdit>({
    show: false,
    item: null,
    tempValue: '',
  });

  /**
   * @description Handle add/edit notes action
   * @returns void
   */
  watch(
    () => cashierOrderSummary_modalAddEditNotes.value.show,
    value => {
      if (!value) {
        cashierOrderSummary_modalAddEditNotes.value.item = null;
      }
    },
  );

  // Computed property to summarize order details
  const cashierOrderSummary_summary = computed(() => {
    const summary: ICashierOrderSummary = {
      provider: CASHIER_PROVIDER,
      orderType: cashierOrderSummary_isRetailBusinessType.value
        ? 'take_away' // Default order type for retail business
        : cashierOrderSummary_modalOrderType.value.selectedOrderType,
      invoiceDetail: {
        receivedBy: cashierOrderSummary_modalInvoiceDetail.value.form.received_by,
        notes: cashierOrderSummary_modalInvoiceDetail.value.form.notes,
      },
      paymentMethod: cashierOrderSummary_data.value.paymentMethod,
      tableCode: cashierOrderSummary_isRetailBusinessType.value
        ? '' // No table code needed for retail business
        : cashierOrderSummary_modalSelectTable.value.selectedTable.toString(),
      selectedVoucher: cashierOrderSummary_modalVoucher.value.form.voucherId,
      customerName: cashierProduct_customerState.value.selectedCustomer?.id || '',
      product: cashierProduct_selectedProduct.value,
    };

    return summary;
  });

  const cashierOrderSummary_modalPlaceOrderDetail = ref<ICashierOrderSummaryModalPlaceOrderConfirmation>({
    show: false,
    isLoading: false,
    showModalPayment: false,
    data: {},
  });

  const cashierOrderSummary_paymentForm = reactive({
    paymentAmount: 0,
  });

  const cashierOrderSummary_formRules = {
    paymentAmount: {
      required,
      numeric,
      minValue: minValue(computed(() => cashierOrderSummary_calculateEstimation.value.data.grandTotal)),
    },
  };

  const cashierOrderSummary_paymentAmountFormValidation = useVuelidate(
    cashierOrderSummary_formRules,
    cashierOrderSummary_paymentForm,
    {
      $autoDirty: true,
    },
  );

  // const cashierOrderSummary_storeId = ref('');

  /**
   * @description Initialize self-order setup (deprecated - moved to SelfOrderUI)
   * @deprecated This function is no longer used as self-order now has its own component
   */
  const cashierOrderSummary_initializeSelfOrder = async () => {
    // This function is deprecated - self-order logic moved to SelfOrderUI.vue
    console.warn('cashierOrderSummary_initializeSelfOrder is deprecated. Use SelfOrderUI.vue instead.');
  };

  /**
   * @description Check if the "Place Order" button should be disabled
   * @returns boolean
   */
  const cashierOrderSummary_isButtonPlaceOrderDisabled = computed(() => {
    // If user doesn't have customer management permission or business type is retail, skip customer validation
    const customerValidation =
      hasCustomerManagementPermission.value && !cashierOrderSummary_isRetailBusinessType.value
        ? cashierProduct_customerState.value.selectedCustomer?.id === '' ||
          cashierProduct_customerState.value.selectedCustomer?.id === null ||
          cashierProduct_customerState.value.selectedCustomer?.id === undefined
        : false;

    // For retail business type, skip order type and table validations
    if (cashierOrderSummary_isRetailBusinessType.value) {
      const isDisabled = customerValidation || cashierProduct_selectedProduct.value.length === 0;
      return isDisabled;
    }

    // If user doesn't have customer management permission, skip table validation for dine_in
    let tableValidation = false;
    if (hasCustomerManagementPermission.value) {
      if (cashierOrderSummary_modalOrderType.value.selectedOrderType === 'take_away') {
        tableValidation = false;
      } else {
        tableValidation = cashierOrderSummary_modalSelectTable.value.selectedTable.length === 0;
      }
    }

    const isDisabled =
      customerValidation ||
      cashierOrderSummary_modalOrderType.value.selectedOrderType === '' ||
      tableValidation ||
      cashierProduct_selectedProduct.value.length === 0;

    return isDisabled;
  });

  /**
   * @description Handle calculation of estimation
   * @returns void
   */
  const cashierOrderSummary_handleCalculateEstimation = async (recalculating = false) => {
    cashierOrderSummary_calculateEstimation.value.isLoading = true;

    try {
      const response = await store.cashierProduct_calculateEstimation(
        {
          voucherId: cashierOrderSummary_modalVoucher.value.form.voucherId,
          products: cashierOrderSummary_summary.value.product,
          orderType: cashierOrderSummary_summary.value.orderType,
        },
        route,
      );

      cashierOrderSummary_calculateEstimation.value.data = response.data;

      if (!recalculating) {
        await getVoucherActive(
          cashierOrderSummary_modalVoucher.value.search,
          cashierProduct_selectedProduct.value.map(p => p.productId),
        );

        const availableVouchers = voucherData.value.filter(v => v.available);

        if (availableVouchers.length > 0) {
          availableVouchers.sort((a, b) => {
            // Sort by stock (quota) ascending
            if (a.stock !== b.stock) {
              return a.stock - b.stock;
            }

            // Then sort by discount amount descending
            const subTotal = cashierOrderSummary_calculateEstimation.value.data.subTotal;

            const discountA =
              a.type === 'percentage' ? Math.min((subTotal * a.discount) / 100, a.maxDiscount) : a.discount;

            const discountB =
              b.type === 'percentage' ? Math.min((subTotal * b.discount) / 100, b.maxDiscount) : b.discount;

            return discountB - discountA;
          });

          const bestVoucher = availableVouchers[0];

          if (bestVoucher && !cashierOrderSummary_modalVoucher.value.form.voucherId) {
            cashierOrderSummary_modalVoucher.value.form.voucherId = bestVoucher.id;
            cashierOrderSummary_modalVoucher.value.form.voucher_code = bestVoucher.code;
            await cashierOrderSummary_handleCalculateEstimation(true);
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      cashierOrderSummary_calculateEstimation.value.isLoading = false;
    }
  };

  /**
   * @description debounce function to handle calculate estimation
   */
  const debouncedCalculateEstimation = debounce(() => cashierOrderSummary_handleCalculateEstimation(), 500);

  /**
   * @description watch calculate estimation changes
   */
  watch(
    () => [cashierProduct_selectedProduct.value, cashierOrderSummary_modalOrderType.value.selectedOrderType],
    async () => {
      if (
        cashierOrderSummary_modalOrderType.value.selectedOrderType &&
        cashierProduct_selectedProduct.value.length > 0
      ) {
        cashierOrderSummary_modalVoucher.value.form.voucherId = '';
        cashierOrderSummary_modalVoucher.value.form.voucher_code = '';
        debouncedCalculateEstimation();
      } else {
        cashierOrderSummary_calculateEstimation.value.data = {
          total: 0,
          subTotal: 0,
          discountTotal: 0,
          grandTotal: 0,
          serviceCharge: 0,
          roundingAdjustment: 0,
          serviceChargeInclude: false,
          tax: 0,
          taxInclude: false,
          items: [],
          totalProductDiscount: 0,
          voucherAmount: 0,
        };
      }
    },
    { deep: true },
  );

  /**
   * @description Handle placing order detail
   * @returns void
   */
  const cashierOrderSummary_handlePlaceOrderDetail = async () => {
    const getSelectedPaymentMethod = cashierOrderSummary_modalPaymentMethod.value.data.find(
      f => f.id === cashierOrderSummary_modalPaymentMethod.value.selectedPaymentMethod,
    )?.name;

    cashierOrderSummary_modalPlaceOrderDetail.value.show = false;
    cashierOrderSummary_modalPlaceOrderDetail.value.isLoading = true;

    const provider =
      getSelectedPaymentMethod?.toUpperCase() === 'CASH' ? 'cash' : cashierOrderSummary_summary.value.provider;

    try {
      const params = {
        products: cashierOrderSummary_summary.value.product,
        orderType: cashierOrderSummary_summary.value.orderType,
        provider: provider,
        paymentMethodId: cashierOrderSummary_modalPaymentMethod.value.selectedPaymentMethod,
        customerId: cashierProduct_customerState.value.selectedCustomer?.id || '',
        tableCode: cashierOrderSummary_isRetailBusinessType.value
          ? ''
          : cashierOrderSummary_summary.value.tableCode,
        storeId: storeOutlet.outlet_currentOutlet?.id || '',
        paymentAmount: cashierOrderSummary_paymentForm.paymentAmount || null,
        voucherId: cashierOrderSummary_modalVoucher.value.form.voucherId || null,
        rounding_amount: cashierOrderSummary_calculateEstimation.value.data.roundingAdjustment || 0,
      };

      const response = await store.cashierProduct_paymentInstant(params, route);

      cashierOrderSummary_modalPlaceOrderDetail.value.data = response.data;

      if (getSelectedPaymentMethod?.toUpperCase() === 'CASH') {
        router.push({
          name: route.name === 'cashier' || route.name === 'cashier-order-edit' ? 'invoice' : 'self-order-invoice',
          params: {
            invoiceId: response.data.invoiceId,
          },
          query: {
            ...route.query,
          },
        });

        localStorage.removeItem('shoppingCart');
      } else {
        cashierOrderSummary_modalPlaceOrderDetail.value.showModalPayment = true;
      }
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      cashierOrderSummary_modalPlaceOrderDetail.value.isLoading = false;
    }
  };

  /**
   * @description Handle simulating payment
   * @param {string} invoiceId - The invoice ID to simulate payment for
   * @returns void
   */
  const cashierOrderSummary_handleSimulatePayment = async (invoiceId: string) => {
    try {
      const params = {
        ...CASHIER_DUMMY_PARAMS_SIMULATE_PAYMENT,
        order_id: invoiceId,
      };

      await store.cashierProduct_simulatePayment(params, route);
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      cashierOrderSummary_modalPlaceOrderDetail.value.isLoading = false;
    }
  };

  const cashierOrderSummary_isLoadingUnpaidOrder = ref(false);

  /**
   * @description Handle saving unpaid order
   * @returns void
   */
  const cashierOrderSummary_handleSaveUnpaidOrder = async () => {
    cashierOrderSummary_isLoadingUnpaidOrder.value = true;

    try {
      const params = {
        products: cashierOrderSummary_summary.value.product,
        orderType: cashierOrderSummary_summary.value.orderType,
        paymentMethodId: cashierOrderSummary_modalPaymentMethod.value.selectedPaymentMethod,
        voucherId: cashierOrderSummary_summary.value.selectedVoucher,
        customerId: cashierProduct_customerState.value.selectedCustomer?.id || '',
        tableCode: cashierOrderSummary_isRetailBusinessType.value
          ? ''
          : cashierOrderSummary_summary.value.tableCode,
        storeId: storeOutlet.outlet_currentOutlet?.id || '',
        rounding_amount: cashierOrderSummary_calculateEstimation.value.data.roundingAdjustment || 0,
      };

      const response = await store.cashierProduct_paymentProcess(params, route);

      store.cashierProduct_selectedProduct = [];

      if (route.name === 'cashier' || route.name === 'cashier-order-edit') {
        router.push({
          name: 'invoice',
          params: {
            invoiceId: response.data.orderId,
          },
        });
      } else {
        router.push({
          name: 'self-order-invoice',
          params: {
            invoiceId: response.data.orderId,
          },
          query: {
            ...route.query,
          },
        });

        localStorage.removeItem('shoppingCart');
      }
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      cashierOrderSummary_isLoadingUnpaidOrder.value = false;
    }
  };

  const cashierOrderSummary_modalPlaceOrderConfirmation = ref<ICashierOrderSummaryModalPlaceOrder>({
    show: false,
    form: {
      payment_method: '',
      amount: 0,
      notes: '',
    },
  });

  /**
   * @description Handle place order confirmation
   * @returns void
   */
  const cashierOrderSummary_handlePlaceOrderConfirmation = async () => {
    const getSelectedPaymentMethod = cashierOrderSummary_modalPaymentMethod.value.data.find(
      f => f.id === cashierOrderSummary_modalPaymentMethod.value.selectedPaymentMethod,
    )?.name;

    switch (getSelectedPaymentMethod?.toUpperCase()) {
      case 'CASH':
        cashierOrderSummary_modalPlaceOrderDetail.value.show = true;
        break;
      case 'QRIS':
        await cashierOrderSummary_handlePlaceOrderDetail();
        cashierOrderSummary_modalPlaceOrderConfirmation.value.show = false;
        break;
      case 'DEBIT':
        cashierOrderSummary_modalPlaceOrderDetail.value.show = true;
        break;
      case 'CREDIT':
        cashierOrderSummary_modalPlaceOrderDetail.value.show = true;
        break;
      case 'PAY AT CASHIER':
        cashierOrderSummary_handleSaveUnpaidOrder();
        break;
      default:
        console.error('Invalid payment method selected');
        break;
    }
  };

  // Socket connection for real-time updates
  const socket = useSocket();

  /**
   * @description Subscribe to payment events
   * @returns void
   */
  const subscribe = () => {
    const orderId = cashierOrderSummary_modalPlaceOrderDetail.value.data?.orderId;
    if (!orderId) return;

    socket.emit('subscribe-invoice', orderId);

    socket.on('payment-success', (data: ICashierResponseWebsocketMessage) => {
      localStorage.removeItem('shoppingCart');

      if (data.orderId === orderId) {
        if (route.name === 'cashier' || route.name === 'cashier-order-edit') {
          router.replace({ name: 'invoice', params: { invoiceId: data.orderId } });
        } else {
          router.replace({
            name: 'self-order-invoice',
            params: { invoiceId: data.orderId },
            query: { ...route.query },
          });
        }
      }
    });

    socket.on('payment-failed', data => {
      localStorage.removeItem('shoppingCart');

      if (route.name === 'self-order') {
        router.push({ name: 'self-order' });
      }
      if (route.name === 'cashier' || route.name === 'cashier-order-edit') {
        if (data.orderId === orderId) {
          router.replace({ name: 'invoice', params: { invoiceId: data.orderId } });
        }
      }
    });
  };

  const cashierOrderSummary_handleEditOrder = async () => {
    try {
      const invoiceId = route.params.invoiceId as string;
      if (!invoiceId) {
        throw new Error('No invoice ID provided in route parameters');
      }

      await store.cashierProduct_handleEditOrder({
        invoiceId: invoiceId,
        products: cashierProduct_selectedProduct.value,
      });

      router.push({
        name: 'invoice',
        params: {
          invoiceId: invoiceId,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const cashierOrderSummary_fetchInvoiceDetail = async (invoiceId: string) => {
    try {
      const response = await storeInvoice.invoice_fetchInvoiceById(invoiceId, route);

      if (response.data) {
        cashierProduct_customerState.value.selectedCustomer = {
          id: response.data.customerId,
          name: response.data.customer.name,
          code: null,
          number: null,
          email: null,
          address: null,
          dob: null,
          username: null,
          customersHasTag: null,
        };

        cashierOrderSummary_modalOrderType.value.selectedOrderType = response.data.orderType;

        cashierOrderSummary_modalSelectTable.value.selectedTable = response.data.tableCode.split(',');

        cashierOrderSummary_modalPaymentMethod.value.selectedPaymentMethod = response.data.paymentMethodsId || '';

        cashierProduct_selectedProduct.value = response.data.invoiceDetails.map((item): ICashierSelected => {
          return {
            product: reactive({
              id: item.productId,
              name: item.products.name,
              price: item.products.price,
              discountPrice: item.products.discountPrice,
              pictureUrl: item.products.pictureUrl ?? '',
              isPercent: item.products.isPercent,
              quantity: null,
              variantHasProducts: null,
              categoriesHasProducts: null,
              variant: item.variant
                ? [
                    {
                      id: item.variant.id,
                      name: item.variant.name,
                      price: item.variant.price,
                      productsId: item.productId,
                    },
                  ]
                : [],
            }),
            variant: item.variant
              ? reactive({
                  id: item.variant.id,
                  name: item.variant.name,
                  price: item.variant.price,
                })
              : reactive({
                  id: '',
                  name: '',
                  price: 0,
                }),
            productId: item.productId,
            variantId: item.variant?.id || '',
            quantity: item.qty,
            notes: item.notes,
          };
        });
      } else {
        console.error('No invoice data found');
      }
    } catch (error) {
      router.push({
        name: 'cashier',
      });

      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for closing dialog cash drawer overview
   */
  const cashierOrderSummary_onCloseDialogCashDrawerOverview = () => {
    eventBus.emit('AppBaseDialog', {
      id: 'cashier-cash-drawer-overview-dialog',
      isOpen: false,
    });
  };

  /**
   * @description Handle business logic for closing dialog queue overview
   */
  const cashierOrderSummary_onCloseDialogQueueOverview = () => {
    eventBus.emit('AppBaseDialog', {
      id: 'cashier-queue-overview-dialog',
      isOpen: false,
    });
  };

  /**
   * @description Handle business logic for closing dialog table overview
   */
  const cashierOrderSummary_onCloseDialogTableOverview = () => {
    eventBus.emit('AppBaseDialog', {
      id: 'cashier-table-overview-dialog',
      isOpen: false,
    });
  };

  /**
   * @description Handle business logic for showing dialog cash drawer overview
   */
  const cashierOrderSummary_onOpenDialogCashDrawerOverview = async () => {
    await Promise.all([
      cashDrawerCashRegister_fetchCashDrawerDetails(cashDrawerList_todayStatus.value?.id),
      cashDrawerCashRegister_fetchTrasanctions(cashDrawerList_todayStatus.value?.id),
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
  const cashierOrderSummary_onOpenDialogQueueOverview = async () => {
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
  const cashierOrderSummary_onOpenDialogTableOverview = () => {
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
  const cashierOrderSummary_onOpenDialogStockOverview = async () => {
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
  const cashierOrderSummary_onCloseDialogStockOverview = () => {
    const argsEventEmitter: IPropsDialog = {
      id: 'cashier-stock-overview-dialog',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: 'w-[1200px]',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Initialize route-based setup
   */
  const cashierOrderSummary_initializeRoute = () => {
    if (route.name === 'cashier-order-edit') {
      const invoiceId = route.params.invoiceId as string;
      if (invoiceId) {
        cashierOrderSummary_fetchInvoiceDetail(invoiceId);

        cashierOrderSummary_handleFetchPaymentMethod();
      } else {
        console.error('No invoice ID provided in route parameters');
      }
    } else if (route.name !== 'self-order') {
      cashierProduct_selectedProduct.value = [];
      cashierOrderSummary_modalOrderType.value.selectedOrderType = 'dine_in';
      cashierOrderSummary_modalSelectTable.value.selectedTable = [];
      cashierOrderSummary_modalPaymentMethod.value.selectedPaymentMethod = '';
      cashierProduct_customerState.value.selectedCustomer = null;
    }
  };

  /**
   * @description Unsubscribe from payment events
   * @returns void
   */
  const unsubscribe = () => {
    const orderId = cashierOrderSummary_modalPlaceOrderDetail.value.data?.orderId;
    if (!orderId) return;

    socket.emit('unsubscribe-invoice', orderId);

    socket.off('payment-success');
    socket.off('payment-failed');
  };

  // Watch for visibility of payment modal to manage subscription
  watch(
    () => cashierOrderSummary_modalPlaceOrderDetail.value.showModalPayment,
    isVisible => {
      if (isVisible) {
        subscribe();
      } else {
        unsubscribe();
      }
    },
  );

  // Cleanup on component unmount
  onUnmounted(() => {
    unsubscribe();
  });

  return {
    cashierOrderSummary_menuOrder,
    cashierOrderSummary_menuOrderItem,
    cashierOrderSummary_data,

    cashierOrderSummary_modalAddCustomer,
    cashierOrderSummary_modalMenuOrderItem,
    cashierOrderSummary_modalOrderSummary,
    cashierOrderSummary_modalAddEditNotes,
    cashierOrderSummary_modalPaymentMethod,
    cashierOrderSummary_modalSelectTable,
    cashierOrderSummary_modalOrderType,
    cashierOrderSummary_modalVoucher,
    cashierOrderSummary_modalInvoiceDetail,
    cashierOrderSummary_modalPlaceOrderConfirmation,
    cashierOrderSummary_modalPlaceOrderDetail,
    cashierOrderSummary_paymentForm,
    cashierOrderSummary_modalCancelOrder,
    cashierOrderSummary_paymentAmountFormValidation,

    cashierOrderSummary_getListActiveFloor,
    cashierOrderSummary_calculateEstimation,
    cashierOrderSummary_summary,

    cashierOrderSummary_isButtonPlaceOrderDisabled,

    cashierOrderSummary_isLoadingUnpaidOrder,

    cashierProduct_customerState,

    hasCustomerManagementPermission,
    cashierOrderSummary_isRetailBusinessType,

    cashierOrderSummary_handleModalAddCustomer,

    cashierOrderSummary_handleIsExpandedToggle,

    cashierOrderSummary_handleSaveUnpaidOrder,

    cashierOrderSummary_handleInvoiceDetail,
    cashierOrderSummary_handleCancelOrder,
    cashierOrderSummary_handleFetchPaymentMethod,
    cashierOrderSummary_handlePaymentMethod,
    cashierOrderSummary_handlePlaceOrderConfirmation,
    cashierOrderSummary_handlePlaceOrderDetail,
    cashierOrderSummary_handleSelectTable,
    cashierOrderSummary_handleVoucher,
    cashierOrderSummary_handleToggleSelectTable,

    cashierOrderSummary_handleSimulatePayment,
    cashierProduct_onSearchCustomer,
    cashierProduct_onScrollFetchMoreCustomers,

    cashierOrderSummary_handleEditOrder,

    cashierOrderSummary_isShowQuickOverview,
    cashierOrderSummary_onCloseDialogCashDrawerOverview,
    cashierOrderSummary_onCloseDialogQueueOverview,
    cashierOrderSummary_onCloseDialogTableOverview,
    cashierOrderSummary_onOpenDialogCashDrawerOverview,
    cashierOrderSummary_onOpenDialogQueueOverview,
    cashierOrderSummary_onOpenDialogTableOverview,
    cashierOrderSummary_onOpenDialogStockOverview,
    cashierOrderSummary_onCloseDialogStockOverview,

    // Initialize functions
    cashierOrderSummary_initializeSelfOrder,
    cashierOrderSummary_initializeRoute,
  };
};
