// Helpers
import { debounce } from '@/app/helpers/debounce.helper';

// interfaces
import {
  ICashierCalulateEstimationData,
  ICashierOrderSummary,
  ICashierOrderSummaryCalculation,
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
// import { useRouter, useRoute } from 'vue-router';

// Stores
import { useCashierStore } from '../store';

// Vue
import { ref } from 'vue';

export const useCashierOrderSummaryService = (): ICashierOrderSummaryProvided => {
  // Router
  // const router = useRouter();
  // const route = useRoute();

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
    selectedOrderType: 0,
    data: [
      {
        code: 1,
        label: 'Dine In',
        available: true,
      },
      {
        code: 2,
        label: 'Takeaway',
        available: false,
      },
    ],
  });

  const cashierOrderSummary_handleOrderType = () => {
    // TODO: handle order type on submit
  };

  const cashierOrderSummary_modalInvoiceDetail = ref<ICashierOrderSummaryModalInvoiceDetail>({
    show: false,
    value: null,
    form: {
      received_by: '',
      notes: '',
    },
  });

  const cashierOrderSummary_handleInvoiceDetail = () => {};

  const cashierOrderSummary_modalCancelOrder = ref<ICashierOrderSummaryModalCancelOrder>({
    show: false,
  });

  const cashierOrderSummary_handleCancelOrder = () => {};

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

  const cashierOrderSummary_handlePaymentMethod = async () => {};

  watch(
    () => cashierOrderSummary_modalPaymentMethod.value.show,
    value => {
      if (value) {
        cashierOrderSummary_handleFetchPaymentMethod();
      }
    },
  );

  const cashierOrderSummary_modalSelectTable = ref<ICashierOrderSummaryModalSelectTable>({
    show: false,
    selectedTable: [],
    activeFloor: 1,
    listFloor: [
      {
        value: 1,
        label: 'Floor 1',
        available: true,
      },
      {
        value: 2,
        label: 'Floor 2',
        available: false,
      },
      {
        value: 3,
        label: 'Floor 3',
        available: true,
      },
      {
        value: 4,
        label: 'Floor 4',
        available: false,
      },
    ],
    data: [
      {
        value: 1,
        label: 'Table 1',
        available: true,
        totalSeat: 4,
        floor: 1,
      },
      {
        value: 2,
        label: 'Table 2',
        available: false,
        totalSeat: 8,
        floor: 1,
      },
      {
        value: 3,
        label: 'Table 3',
        available: true,
        totalSeat: 12,
        floor: 1,
      },
      {
        value: 4,
        label: 'Table 4',
        available: false,
        totalSeat: 6,
        floor: 1,
      },
      {
        value: 5,
        label: 'Table 5',
        available: false,
        totalSeat: 6,
        floor: 1,
      },
      {
        value: 6,
        label: 'Table 6',
        available: false,
        totalSeat: 6,
        floor: 2,
      },
      {
        value: 7,
        label: 'Table 7',
        available: false,
        totalSeat: 6,
        floor: 2,
      },
      {
        value: 8,
        label: 'Table 8',
        available: false,
        totalSeat: 6,
        floor: 2,
      },
      {
        value: 9,
        label: 'Table 9',
        available: false,
        totalSeat: 6,
        floor: 2,
      },
      {
        value: 10,
        label: 'Table 10',
        available: false,
        totalSeat: 12,
        floor: 2,
      },
      {
        value: 11,
        label: 'Table 11',
        available: false,
        totalSeat: 2,
        floor: 2,
      },
      {
        value: 12,
        label: 'Table 12',
        available: false,
        totalSeat: 2,
        floor: 2,
      },
      {
        value: 13,
        label: 'Table 13',
        available: false,
        totalSeat: 2,
        floor: 2,
      },
      {
        value: 14,
        label: 'Table 14',
        available: false,
        totalSeat: 2,
        floor: 2,
      },
      {
        value: 15,
        label: 'Table 15',
        available: false,
        totalSeat: 2,
        floor: 2,
      },
      {
        value: 16,
        label: 'Table 16',
        available: false,
        totalSeat: 2,
        floor: 2,
      },
    ],
  });

  const cashierOrderSummary_handleToggleSelectTable = (table: number) => {
    const index = cashierOrderSummary_modalSelectTable.value.selectedTable.indexOf(table);

    if (index === -1) {
      cashierOrderSummary_modalSelectTable.value.selectedTable.push(table);
    } else {
      cashierOrderSummary_modalSelectTable.value.selectedTable.splice(index, 1);
    }
  };

  const cashierOrderSummary_handleSelectTable = () => {};

  const cashierOrderSummary_getListActiveFloor = computed(() => {
    const activeFloor = cashierOrderSummary_modalSelectTable.value.data.filter(
      data => data.floor === cashierOrderSummary_modalSelectTable.value.activeFloor,
    );

    return activeFloor;
  });

  const cashierOrderSummary_modalVoucher = ref<ICashierOrderSummaryModalVoucher>({
    show: false,
    form: {
      voucher_code: 3,
    },
    search: '',
    data: [
      {
        code: 1,
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
        code: 2,
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
        code: 3,
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

  const cashierOrderSummary_handleVoucher = () => {};

  const cashierOrderSummary_calculation = ref<ICashierOrderSummaryCalculation>({
    subTotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
  });

  const cashierOrderSummary_modalAddEditNotes = ref<ICashierOrderSummaryModalAddEdit>({
    show: false,
    item: null,
    tempValue: '',
  });

  watch(
    () => cashierOrderSummary_modalAddEditNotes.value.show,
    value => {
      if (!value) {
        cashierOrderSummary_modalAddEditNotes.value.item = null;
      }
    },
  );

  const cashierOrderSummary_summary = computed(() => {
    const summary: ICashierOrderSummary = {
      provider: 'midtrans',
      orderType: cashierOrderSummary_data.value.orderType,
      invoiceDetail: {
        receivedBy: cashierOrderSummary_modalInvoiceDetail.value.form.received_by,
        notes: cashierOrderSummary_modalInvoiceDetail.value.form.notes,
      },
      paymentMethod: cashierOrderSummary_data.value.paymentMethod,
      tableCode: cashierOrderSummary_modalSelectTable.value.selectedTable,
      selectedVoucher: cashierOrderSummary_modalVoucher.value.form.voucher_code,
      customerName: cashierOrderSummary_data.value.customerName,
      product: cashierProduct_selectedProduct.value,
    };

    return summary;
  });

  const cashierOrderSummary_modalPlaceOrderDetail = ref<ICashierOrderSummaryModalPlaceOrderConfirmation>({
    show: false,
    isLoading: false,
    data: {},
  });

  const cashierOrderSummary_isButtonPlaceOrderDisabled = computed(() => {
    const isDisabled =
      cashierOrderSummary_modalOrderType.value.selectedOrderType === 0 ||
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

  const cashierOrderSUmmary_handleCalculateEstimation = async () => {
    cashierOrderSummary_calculateEstimation.value.isLoading = true;

    try {
      const response = await store.cashierProduct_calculateEstimation({
        products: cashierOrderSummary_summary.value.product,
      });

      cashierOrderSummary_calculateEstimation.value.data = response;
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

  const cashierOrderSummary_handlePlaceOrderDetail = async () => {
    cashierOrderSummary_modalPlaceOrderDetail.value.show = false;
    cashierOrderSummary_modalPlaceOrderDetail.value.isLoading = true;

    try {
      const response = await store.cashierProduct_paymentProcess({
        products: cashierOrderSummary_summary.value.product,
        provider: 'midtrans',
        orderType: cashierOrderSummary_summary.value.orderType,
        invoiceDetail: {
          receivedBy: cashierOrderSummary_modalInvoiceDetail.value.form.received_by,
          notes: cashierOrderSummary_modalInvoiceDetail.value.form.notes,
        },
        paymentMethodId: cashierOrderSummary_modalPaymentMethod.value.selectedPaymentMethod,
        vouchers: cashierOrderSummary_modalVoucher.value.form.voucher_code,
        customerId: cashierOrderSummary_data.value.customerName,
        tableCode: cashierOrderSummary_modalSelectTable.value.selectedTable,
      });

      cashierOrderSummary_modalPlaceOrderDetail.value.data = response;

      // if (route.name === 'cashier') {
      //   router.push({
      //     name: 'invoice',
      //   });
      // } else {
      //   router.push({
      //     name: 'self-order-invoice',
      //   });
      // }
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

  const cashierOrderSummary_modalPlaceOrderConfirmation = ref<ICashierOrderSummaryModalPlaceOrder>({
    show: false,
    form: {
      payment_method: '',
      amount: 0,
      notes: '',
    },
  });

  const cashierOrderSummary_handlePlaceOrderConfirmation = () => {
    cashierOrderSummary_modalPlaceOrderConfirmation.value.show = false;
    cashierOrderSummary_modalPlaceOrderDetail.value.show = true;
  };

  return {
    cashierOrderSummary_menuOrder,
    cashierOrderSummary_menuOrderItem,
    cashierOrderSummary_data,
    cashierOrderSummary_calculation,

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
    cashierOrderSummary_summary,

    cashierOrderSummary_isButtonPlaceOrderDisabled,

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
  };
};
