// Constants
import {
  CASHIER_PROVIDER,
  CASHIER_ORDER_TYPE,
  CASHIER_DUMMY_LIST_FLOOR,
  CASHIER_DUMMY_LIST_TABLE,
  CASHIER_DUMMY_VOUCHER,
  CASHIER_DUMMY_PARAMS_SIMULATE_PAYMENT,
} from '../constants';

// Helpers
import { debounce } from '@/app/helpers/debounce.helper';

// interfaces
import {
  ICashierCalulateEstimationData,
  ICashierOrderSummary,
  ICashierOrderSummaryData,
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
} from '../interfaces/cashier-order-summary';

import { ICashierResponseWebsocketMessage } from '../interfaces/cashier-response';

import type { MenuPassThroughAttributes } from 'primevue';

import { MenuItem } from 'primevue/menuitem';

// Router
import { useRouter, useRoute } from 'vue-router';

// Stores
import { useCashierStore } from '../store';

// Socket
import { useSocket } from '@/plugins/socket';

// Vue
import { ref } from 'vue';

export const useCashierOrderSummaryService = (): ICashierOrderSummaryProvided => {
  // Router
  const router = useRouter();
  const route = useRoute();

  /**
   * @description Injected variables
   */
  const store = useCashierStore();

  const { cashierProduct_selectedProduct } = storeToRefs(store);

  const cashierOrderSummary_modalOrderSummary = ref({
    show: false,
  });

  // Reactive data binding
  const cashierOrderSummary_modalOrderType = ref<ICashierOrderSummaryModalOrderType>({
    show: false,
    selectedOrderType: '',
    data: CASHIER_ORDER_TYPE,
  });

  /**
   * @description Handle order type selection
   * @returns void
   */
  const cashierOrderSummary_handleOrderType = () => {
    // TODO: handle order type on submit
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
  const cashierOrderSummary_handleCancelOrder = () => {};

  // Modal for payment method selection
  const cashierOrderSummary_modalPaymentMethod = ref<ICashierOrderSummaryModalPaymentMethod>({
    show: false,
    isLoading: false,
    selectedPaymentMethod: '',
    data: [],
    dataSelfOrder: [
      {
        sortNo: 1,
        id: '1',
        iconName: 'cash',
        name: 'Pay at Cashier',
        isAvailable: true,
      },
      {
        sortNo: 4,
        id: '4',
        iconName: 'qris',
        name: 'QRIS',
        isAvailable: false,
      },
    ],
  });

  /**
   * @description Handle order type selection
   * @returns void
   */
  const cashierOrderSummary_handleFetchPaymentMethod = async () => {
    cashierOrderSummary_modalPaymentMethod.value.isLoading = true;

    try {
      const response = await store.cashierProduct_fetchPaymentMethod({});

      cashierOrderSummary_modalPaymentMethod.value.data = response.data;
      cashierOrderSummary_modalPaymentMethod.value.show = true;
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
    data: CASHIER_DUMMY_LIST_TABLE,
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
      voucher_code: '',
    },
    search: '',
    data: CASHIER_DUMMY_VOUCHER,
  });

  /**
   * @description Handle voucher selection
   * @returns void
   */
  const cashierOrderSummary_data = ref<ICashierOrderSummaryData>({
    orderId: '1234',
    customerName: '5ae5fbfb-0002-40fb-9734-0e4d111fb5b2',
    orderType: '',
    tableNumber: '',
    promoCode: '',
    paymentMethod: '',
    isExpanded: true,
    isExpandedVisible: false,
  });

  /**
   * @description Debounce function to handle watch changes
   */
  const debouncedHandleWatchChanges = debounce(() => {
    if (
      cashierOrderSummary_data.value.customerName &&
      cashierOrderSummary_modalOrderType.value.selectedOrderType &&
      cashierOrderSummary_modalSelectTable.value.selectedTable.length > 0
    ) {
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
      cashierOrderSummary_data.value.customerName,
      cashierOrderSummary_modalOrderType.value.selectedOrderType,
      cashierOrderSummary_modalSelectTable.value.selectedTable,
    ],
    () => {
      debouncedHandleWatchChanges();
    },
    { immediate: true, deep: true },
  );

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
  const cashierOrderSummary_handleVoucher = () => {};

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
      orderType: cashierOrderSummary_modalOrderType.value.selectedOrderType,
      invoiceDetail: {
        receivedBy: cashierOrderSummary_modalInvoiceDetail.value.form.received_by,
        notes: cashierOrderSummary_modalInvoiceDetail.value.form.notes,
      },
      paymentMethod: cashierOrderSummary_data.value.paymentMethod,
      tableCode: cashierOrderSummary_modalSelectTable.value.selectedTable.toString(),
      selectedVoucher: cashierOrderSummary_modalVoucher.value.form.voucher_code,
      customerName: cashierOrderSummary_data.value.customerName,
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

  /**
   * @description Check if the "Place Order" button should be disabled
   * @returns boolean
   */
  const cashierOrderSummary_isButtonPlaceOrderDisabled = computed(() => {
    const isDisabled =
      cashierOrderSummary_modalOrderType.value.selectedOrderType === '' ||
      cashierOrderSummary_modalPaymentMethod.value.selectedPaymentMethod === '' ||
      cashierOrderSummary_modalSelectTable.value.selectedTable.length === 0 ||
      cashierProduct_selectedProduct.value.length === 0;

    return isDisabled;
  });

  const cashierOrderSummary_calculateEstimation = ref<ICashierCalulateEstimationData>({
    isLoading: false,
    data: {
      total: 0,
      discountTotal: 0,
      items: [],
    },
  });

  /**
   * @description Handle calculation of estimation
   * @returns void
   */
  const cashierOrderSummary_handleCalculateEstimation = async () => {
    cashierOrderSummary_calculateEstimation.value.isLoading = true;

    try {
      const response = await store.cashierProduct_calculateEstimation({
        products: cashierOrderSummary_summary.value.product,
      });

      cashierOrderSummary_calculateEstimation.value.data = response.data;
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
    () => cashierProduct_selectedProduct.value,
    async () => {
      if (cashierProduct_selectedProduct.value.length > 0) {
        debouncedCalculateEstimation();
      }
    },
    { immediate: true, deep: true },
  );

  /**
   * @description Handle placing order detail
   * @returns void
   */
  const cashierOrderSummary_handlePlaceOrderDetail = async () => {
    cashierOrderSummary_modalPlaceOrderDetail.value.show = false;
    cashierOrderSummary_modalPlaceOrderDetail.value.isLoading = true;

    try {
      const params = {
        products: cashierOrderSummary_summary.value.product,
        orderType: cashierOrderSummary_summary.value.orderType,
        invoiceDetail: {
          receivedBy: cashierOrderSummary_modalInvoiceDetail.value.form.received_by,
          notes: cashierOrderSummary_modalInvoiceDetail.value.form.notes,
        },
        provider: cashierOrderSummary_summary.value.provider,
        paymentMethodId: cashierOrderSummary_modalPaymentMethod.value.selectedPaymentMethod,
        vouchers: cashierOrderSummary_summary.value.selectedVoucher,
        customerId: cashierOrderSummary_data.value.customerName,
        tableCode: cashierOrderSummary_summary.value.tableCode,
      };

      const response = await store.cashierProduct_paymentInstant(params);

      cashierOrderSummary_modalPlaceOrderDetail.value.data = response.data;

      cashierOrderSummary_modalPlaceOrderDetail.value.showModalPayment = true;
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

      await store.cashierProduct_simulatePayment(params);
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
        invoiceDetail: {
          receivedBy: cashierOrderSummary_modalInvoiceDetail.value.form.received_by,
          notes: cashierOrderSummary_modalInvoiceDetail.value.form.notes,
        },
        paymentMethodId: cashierOrderSummary_modalPaymentMethod.value.selectedPaymentMethod,
        vouchers: cashierOrderSummary_summary.value.selectedVoucher,
        customerId: cashierOrderSummary_data.value.customerName,
        tableCode: cashierOrderSummary_summary.value.tableCode,
      };

      const response = await store.cashierProduct_paymentProcess(params);

      store.cashierProduct_selectedProduct = [];

      if (route.name === 'cashier') {
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
        });
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
    switch (cashierOrderSummary_modalPaymentMethod.value.selectedPaymentMethod) {
      case '0196cf1f-f2cc-7130-a67b-2c753dbcbd32': // Cash
        cashierOrderSummary_modalPlaceOrderDetail.value.show = true;
        break;
      case '0196cf1f-f2cc-7d1c-9500-dee362da4287': // QRIS
        await cashierOrderSummary_handlePlaceOrderDetail();

        cashierOrderSummary_modalPlaceOrderConfirmation.value.show = false;

        break;
      case '0196cf1f-f2cc-7e3f-951d-cf86eb228b0b': // Debit
        cashierOrderSummary_modalPlaceOrderDetail.value.show = true;
        break;
      case '0196cf1f-f2cc-7a21-bcd7-8e4d4d3505c2': // Credit
        cashierOrderSummary_modalPlaceOrderDetail.value.show = true;
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
      if (data.orderId === orderId) {
        router.replace({ name: 'invoice', params: { invoiceId: data.orderId } });
      }
    });

    socket.on('payment-failed', data => {
      if (data.orderId === orderId) {
        router.replace({ name: 'invoice', params: { invoiceId: data.orderId } });
      }
    });
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
    cashierOrderSummary_modalCancelOrder,

    cashierOrderSummary_getListActiveFloor,
    cashierOrderSummary_calculateEstimation,
    cashierOrderSummary_summary,

    cashierOrderSummary_isButtonPlaceOrderDisabled,

    cashierOrderSummary_isLoadingUnpaidOrder,

    cashierOrderSummary_handleIsExpandedToggle,

    cashierOrderSummary_handleSaveUnpaidOrder,

    cashierOrderSummary_handleOrderType,
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
  };
};
