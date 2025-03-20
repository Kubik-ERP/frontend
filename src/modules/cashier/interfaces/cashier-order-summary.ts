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

export interface ICashierOrderSummaryProvided {
  cashierOrderSummary_data: Ref<ICashierOrderSummaryData>;
  cashierOrderSummary_calculation: Ref<ICashierOrderSummaryCalculation>;
}
