import { MenuContext } from 'primevue';

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
  cashierOrderSummary_menuOrder: Ref<MenuContext>;
  cashierOrderSummary_menuOrderItem: Ref<{ label: string }[]>;
  cashierOrderSummary_data: Ref<ICashierOrderSummaryData>;
  cashierOrderSummary_calculation: Ref<ICashierOrderSummaryCalculation>;
  cashierOrderSummary_modalAddEditNotes: Ref<ICashierOrderSummaryModalAddEdit>;
}
