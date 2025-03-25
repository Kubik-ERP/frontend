import { MenuPassThroughAttributes } from 'primevue';
import { MenuItem } from 'primevue/menuitem';

export interface ICashierOrderType {
  code: number;
  label: string;
  available: boolean;
}

export interface ICashierVoucher {
  code: number;
  label: string;
  available: boolean;
  discount: number;
  minPurchase: number;
  maxDiscount: number;
  validUntil: string;
  validFrom: string;
  type: 'percentage' | 'nominal';
  stock: number;
}

export interface ICashierOrderSummaryPaymentMethod {
  code: number;
  icon: string;
  label: string;
  available: boolean;
}

export interface ICashierOrderSummaryModalOrderType {
  show: boolean;
  selectedOrderType: number;
  data: ICashierOrderType[];
}

export interface ICashierOrderSummaryModalInvoiceDetail {
  show: boolean;
  value: number | null;
  form: {
    received_by: string;
    notes: string;
  };
}

export interface ICashierOrderSummaryModalCancelOrder {
  show: boolean;
}

export interface ICashierListTable {
  value: number;
  label: string;
  available: boolean;
  totalSeat: number;
  floor: number;
}

export interface ICashierOrderSummaryModalSelectTable {
  show: boolean;
  selectedTable: number[];
  activeFloor: number;
  data: ICashierListTable[];
}

export interface ICashierOrderSummaryModalPaymentMethod {
  show: boolean;
  selectedPaymentMethod: number;
  data: ICashierOrderSummaryPaymentMethod[];
}

export interface ICashierOrderSummaryModalPlaceOrder {
  show: boolean;
  form: {
    payment_method: string;
    amount: number;
    notes: string;
  };
}

export interface ICashierOrderSummaryModalVoucher {
  show: boolean;
  form: {
    voucher_code: number;
  };
  search: string;
  data: ICashierVoucher[];
}

export interface ICashierOrderSummaryData {
  orderId: string;
  customerName: string;
  orderType: string;
  tableNumber: string;
  promoCode: string;
  paymentMethod: string;
}

export interface ICashierOrderSummaryCalculation {
  subTotal: number;
  tax: number;
  discount: number;
  total: number;
}

export interface ICashierOrderSummaryModalAddEdit {
  show: boolean;
  item: number | null;
  tempValue: string;
}

export interface ICashierOrderSummaryProvided {
  cashierOrderSummary_menuOrder: Ref<MenuPassThroughAttributes>;
  cashierOrderSummary_menuOrderItem: Ref<MenuItem[]>;
  cashierOrderSummary_data: Ref<ICashierOrderSummaryData>;
  cashierOrderSummary_calculation: Ref<ICashierOrderSummaryCalculation>;

  cashierOrderSummary_modalAddEditNotes: Ref<ICashierOrderSummaryModalAddEdit>;
  cashierOrderSummary_modalOrderType: Ref<ICashierOrderSummaryModalOrderType>;
  cashierOrderSummary_modalInvoiceDetail: Ref<ICashierOrderSummaryModalInvoiceDetail>;
  cashierOrderSummary_modalCancelOrder: Ref<ICashierOrderSummaryModalCancelOrder>;
  cashierOrderSummary_modalPaymentMethod: Ref<ICashierOrderSummaryModalPaymentMethod>;
  cashierOrderSummary_modalVoucher: Ref<ICashierOrderSummaryModalVoucher>;
  cashierOrderSummary_modalSelectTable: Ref<ICashierOrderSummaryModalSelectTable>;
  cashierOrderSummary_modalPlaceOrderConfirmation: Ref<ICashierOrderSummaryModalCancelOrder>;
  cashierOrderSummary_modalPlaceOrderDetail: Ref<ICashierOrderSummaryModalCancelOrder>;

  cashierOrderSummary_handleOrderType: () => void;
  cashierOrderSummary_handleVoucher: () => void;
  cashierOrderSummary_handlePaymentMethod: () => void;
  cashierOrderSummary_handleInvoiceDetail: () => void;
  cashierOrderSummary_handleCancelOrder: () => void;
  cashierOrderSummary_handleSelectTable: () => void;
  cashierOrderSummary_handlePlaceOrderConfirmation: () => void;
  cashierOrderSummary_handlePlaceOrderDetail: () => void;
}
