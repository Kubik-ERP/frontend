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

import type { MenuPassThroughAttributes } from 'primevue';

import { MenuItem } from 'primevue/menuitem';

// Router
import { useRouter, useRoute } from 'vue-router';

// Stores
import { useCashierStore } from '../store';

// Vue
import { ref } from 'vue';
import { CASHIER_PROVIDER, CASHIER_ORDER_TYPE } from '../constants';
import { useSocket } from '@/plugins/socket';
import { ICashierResponseWebsocketMessage } from '../interfaces/cashier-response';

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
    listFloor: [
      {
        value: '1',
        label: 'Floor 1',
        available: true,
      },
      {
        value: '2',
        label: 'Floor 2',
        available: false,
      },
      {
        value: '3',
        label: 'Floor 3',
        available: true,
      },
      {
        value: '4',
        label: 'Floor 4',
        available: false,
      },
    ],
    data: [
      {
        value: '1',
        label: 'Table 1',
        available: true,
        totalSeat: 4,
        floor: 1,
      },
      {
        value: '2',
        label: 'Table 2',
        available: false,
        totalSeat: 8,
        floor: 1,
      },
      {
        value: '3',
        label: 'Table 3',
        available: true,
        totalSeat: 12,
        floor: 1,
      },
      {
        value: '4',
        label: 'Table 4',
        available: false,
        totalSeat: 6,
        floor: 1,
      },
      {
        value: '5',
        label: 'Table 5',
        available: false,
        totalSeat: 6,
        floor: 1,
      },
      {
        value: '6',
        label: 'Table 6',
        available: false,
        totalSeat: 6,
        floor: 2,
      },
      {
        value: '7',
        label: 'Table 7',
        available: false,
        totalSeat: 6,
        floor: 2,
      },
      {
        value: '8',
        label: 'Table 8',
        available: false,
        totalSeat: 6,
        floor: 2,
      },
      {
        value: '9',
        label: 'Table 9',
        available: false,
        totalSeat: 6,
        floor: 2,
      },
      {
        value: '10',
        label: 'Table 10',
        available: false,
        totalSeat: 12,
        floor: 2,
      },
      {
        value: '11',
        label: 'Table 11',
        available: false,
        totalSeat: 2,
        floor: 2,
      },
      {
        value: '12',
        label: 'Table 12',
        available: false,
        totalSeat: 2,
        floor: 2,
      },
      {
        value: '13',
        label: 'Table 13',
        available: false,
        totalSeat: 2,
        floor: 2,
      },
      {
        value: '14',
        label: 'Table 14',
        available: false,
        totalSeat: 2,
        floor: 2,
      },
      {
        value: '15',
        label: 'Table 15',
        available: false,
        totalSeat: 2,
        floor: 2,
      },
      {
        value: '16',
        label: 'Table 16',
        available: false,
        totalSeat: 2,
        floor: 2,
      },
    ],
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
      voucher_code: '3',
    },
    search: '',
    data: [
      {
        code: '1',
        label: 'Voucher A',
        available: true,
        minPurchase: 50000,
        maxDiscount: 10000,
        discount: 10000,
        validFrom: '31 July 2024',
        validUntil: '31 July 2025',
        type: 'percentage',
        stock: 10,
      },
      {
        code: '2',
        label: 'Voucher B',
        available: false,
        minPurchase: 50000,
        maxDiscount: 10000,
        discount: 10000,
        validFrom: '31 July 2024',
        validUntil: '31 July 2025',
        type: 'nominal',
        stock: 10,
      },
      {
        code: '3',
        label: 'Voucher C',
        available: true,
        minPurchase: 50000,
        maxDiscount: 10000,
        discount: 10000,
        validFrom: '31 July 2024',
        validUntil: '31 July 2025',
        type: 'percentage',
        stock: 10,
      },
    ],
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
  });

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
    // {
    //   label: 'Add Invoice Detail',
    //   command: () => {
    //     cashierOrderSummary_modalInvoiceDetail.value.show = true;
    //   },
    // },
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
  const cashierOrderSUmmary_handleCalculateEstimation = async () => {
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
  const debouncedCalculateEstimation = debounce(() => cashierOrderSUmmary_handleCalculateEstimation(), 500);

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
        acquirer: 'gopay',
        currency: 'IDR',
        expiry_time: '2025-05-15 13:43:44',
        fraud_status: 'accept',
        gross_amount: '50000',
        issuer: 'gopay',
        merchant_id: 'G670501757',
        order_id: invoiceId,
        payment_type: 'qris',
        settlement_time: '2025-05-15 13:43:44',
        signature_key: 'asf4a68svca6v3zv6av',
        status_code: '200',
        status_message: 'midtrans payment notification',
        transaction_id: '318db42f-c746-4adb-8337-3b505db445fe',
        transaction_status: 'settlement',
        transaction_time: '2025-05-15 13:43:44',
        transaction_type: 'on-US',
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
