import { MenuPassThroughAttributes, VirtualScrollerLazyEvent } from 'primevue';
import { MenuItem } from 'primevue/menuitem';
import { ICashierCustomerState, ICashierSelected } from '.';
import { ICashierResponseCalulateEstimationItem, ICashierResponseMidtransQrisPayment } from './cashier-response';

export interface ICashierOrderType {
  code: string;
  label: string;
  available: boolean;
}

export interface ICashierVoucher {
  code: string;
  label: string;
  available: boolean;
  discount: number;
  minPurchase: number;
  maxDiscount: number;
  validUntil: string;
  validFrom: string;
  type: string;
  stock: number;
}

export interface ICashierOrderSummaryPaymentMethod {
  id: string;
  name: string;
  iconName: string;
  sortNo: number;
  isAvailable: boolean;
}

export interface ICashierOrderSummaryPaymentMethodResponse {
  data: ICashierOrderSummaryPaymentMethod[];
}

export interface ICashierOrderSummaryModalOrderType {
  show: boolean;
  selectedOrderType: string;
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
export interface ICashierOrderSummaryModalPlaceOrderConfirmation {
  show: boolean;
  showModalPayment: boolean;
  isLoading: boolean;
  data: Partial<ICashierResponseMidtransQrisPayment['data']>;
}

export interface ICashierListTable {
  value: string;
  label: string;
  available: boolean;
  totalSeat: number;
  floor: number;
}

export interface ICashierOrderSummarylistFloor {
  value: string;
  label: string;
  available: boolean;
}

export interface ICashierOrderSummaryModalSelectTable {
  show: boolean;
  selectedTable: string[];
  activeFloor: number;
  listFloor: ICashierOrderSummarylistFloor[];
  data: ICashierListTable[];
}

export interface ICashierOrderSummaryModalPaymentMethod {
  show: boolean;
  isLoading: boolean;
  selectedPaymentMethod: string;
  data: ICashierOrderSummaryPaymentMethod[];
  dataSelfOrder: ICashierOrderSummaryPaymentMethod[];
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
    voucher_code: string;
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
  isExpanded: boolean;
  isExpandedVisible: boolean;
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

export interface ICashierOrderSummary {
  provider: string;
  orderType: string;
  invoiceDetail: {
    receivedBy: string;
    notes: string;
  };
  paymentMethod: string;
  tableCode: string;
  selectedVoucher: string;
  customerName: string;
  product: ICashierSelected[];
}

export interface ICashierCalulateEstimationData {
  isLoading: boolean;
  data: ICashierResponseCalulateEstimationItem;
}

export interface ICashierOrderSummaryProvided {
  cashierOrderSummary_menuOrder: Ref<MenuPassThroughAttributes>;
  cashierOrderSummary_menuOrderItem: Ref<MenuItem[]>;
  cashierOrderSummary_data: Ref<ICashierOrderSummaryData>;

  cashierOrderSummary_modalMenuOrderItem: Ref<{ show: boolean }>;
  cashierOrderSummary_modalOrderSummary: Ref<{ show: boolean }>;
  cashierOrderSummary_modalAddEditNotes: Ref<ICashierOrderSummaryModalAddEdit>;
  cashierOrderSummary_modalOrderType: Ref<ICashierOrderSummaryModalOrderType>;
  cashierOrderSummary_modalInvoiceDetail: Ref<ICashierOrderSummaryModalInvoiceDetail>;
  cashierOrderSummary_modalCancelOrder: Ref<ICashierOrderSummaryModalCancelOrder>;
  cashierOrderSummary_modalPaymentMethod: Ref<ICashierOrderSummaryModalPaymentMethod>;
  cashierOrderSummary_modalVoucher: Ref<ICashierOrderSummaryModalVoucher>;
  cashierOrderSummary_modalSelectTable: Ref<ICashierOrderSummaryModalSelectTable>;
  cashierOrderSummary_modalPlaceOrderConfirmation: Ref<ICashierOrderSummaryModalPlaceOrder>;
  cashierOrderSummary_modalPlaceOrderDetail: Ref<ICashierOrderSummaryModalPlaceOrderConfirmation>;

  cashierOrderSummary_calculateEstimation: Ref<ICashierCalulateEstimationData>;
  cashierOrderSummary_summary: Ref<ICashierOrderSummary>;
  cashierOrderSummary_getListActiveFloor: ComputedRef<ICashierListTable[]>;
  cashierOrderSummary_isButtonPlaceOrderDisabled: ComputedRef<boolean>;

  cashierProduct_customerState: Ref<ICashierCustomerState>;

  cashierOrderSummary_handleIsExpandedToggle: () => void;

  cashierOrderSummary_isLoadingUnpaidOrder: Ref<boolean>;
  cashierOrderSummary_handleSaveUnpaidOrder: () => void;

  cashierOrderSummary_handleOrderType: () => void;
  cashierOrderSummary_handleVoucher: () => void;
  cashierOrderSummary_handleFetchPaymentMethod: () => void;
  cashierOrderSummary_handlePaymentMethod: () => void;
  cashierOrderSummary_handleInvoiceDetail: () => void;
  cashierOrderSummary_handleCancelOrder: () => void;
  cashierOrderSummary_handleSelectTable: () => void;
  cashierOrderSummary_handlePlaceOrderConfirmation: () => void;
  cashierOrderSummary_handlePlaceOrderDetail: () => void;

  cashierOrderSummary_handleToggleSelectTable: (table: string) => void;

  cashierOrderSummary_handleSimulatePayment: (invoiceId: string) => void;

  cashierProduct_onSearchCustomer: (search: string) => void;
  cashierProduct_onScrollFetchMoreCustomers: (event: VirtualScrollerLazyEvent) => void;
}
