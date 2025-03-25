// Vue
import { ref } from 'vue';

// interfaces
import {
  ICashierOrderSummaryCalculation,
  ICashierOrderSummaryData,
  ICashierOrderSummaryModalAddEdit,
  ICashierOrderSummaryModalCancelOrder,
  ICashierOrderSummaryModalInvoiceDetail,
  ICashierOrderSummaryModalOrderType,
  ICashierOrderSummaryModalPaymentMethod,
  ICashierOrderSummaryModalPlaceOrder,
  ICashierOrderSummaryModalSelectTable,
  ICashierOrderSummaryModalVoucher,
  ICashierOrderSummaryProvided,
} from '../interfaces/cashier-order-summary';

import type { MenuPassThroughAttributes } from 'primevue';

import { MenuItem } from 'primevue/menuitem';

export const useCashierOrderSummaryService = (): ICashierOrderSummaryProvided => {
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
    selectedPaymentMethod: 0,
    data: [
      {
        code: 1,
        icon: 'cash',
        label: 'cash',
        available: true,
      },
      {
        code: 2,
        icon: 'debit',
        label: 'Debit',
        available: true,
      },
      {
        code: 3,
        icon: 'credit',
        label: 'Credit',
        available: false,
      },
      {
        code: 4,
        icon: 'qris',
        label: 'QRIS',
        available: false,
      },
    ],
  });

  const cashierOrderSummary_handlePaymentMethod = () => {};

  const cashierOrderSummary_modalPlaceOrderDetail = ref<ICashierOrderSummaryModalCancelOrder>({
    show: false,
  });

  const cashierOrderSummary_handlePlaceOrderDetail = () => {};

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

  const cashierOrderSummary_modalSelectTable = ref<ICashierOrderSummaryModalSelectTable>({
    show: false,
    selectedTable: [],
    activeFloor: 1,
    data: [
      {
        value: 1,
        label: 'Table 1',
        available: true,
        totalSeat: 4,
        floor: 1,
      },
    ],
  });

  const cashierOrderSummary_handleSelectTable = () => {};

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
    customerName: 'Rama Dwiyantara Perkasa',
    orderType: '',
    tableNumber: '',
    promoCode: '',
    paymentMethod: '',
  });

  const cashierOrderSummary_menuOrder = ref<MenuPassThroughAttributes>({} as MenuPassThroughAttributes);

  const cashierOrderSummary_menuOrderItem = ref<MenuItem[]>([
    {
      label: 'Cancel Order',
      class: 'text-text-action-error',
      command: () => {
        cashierOrderSummary_modalCancelOrder.value.show = true;
      },
    },
    {
      label: 'Add Invoice Detail',
      command: () => {
        cashierOrderSummary_modalInvoiceDetail.value.show = true;
      },
    },
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

  return {
    cashierOrderSummary_menuOrder,
    cashierOrderSummary_menuOrderItem,
    cashierOrderSummary_data,
    cashierOrderSummary_calculation,

    cashierOrderSummary_modalAddEditNotes,
    cashierOrderSummary_modalPaymentMethod,
    cashierOrderSummary_modalSelectTable,
    cashierOrderSummary_modalOrderType,
    cashierOrderSummary_modalVoucher,
    cashierOrderSummary_modalInvoiceDetail,
    cashierOrderSummary_modalPlaceOrderConfirmation,
    cashierOrderSummary_modalPlaceOrderDetail,
    cashierOrderSummary_modalCancelOrder,

    cashierOrderSummary_handleOrderType,
    cashierOrderSummary_handleInvoiceDetail,
    cashierOrderSummary_handleCancelOrder,
    cashierOrderSummary_handlePaymentMethod,
    cashierOrderSummary_handlePlaceOrderConfirmation,
    cashierOrderSummary_handlePlaceOrderDetail,
    cashierOrderSummary_handleSelectTable,
    cashierOrderSummary_handleVoucher,
  };
};
