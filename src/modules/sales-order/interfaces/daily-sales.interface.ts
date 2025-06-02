export interface IDailySalesProvided {
  dailySales_getClassOfOrderStatus: (orderStatus: string) => string;
  dailySales_getClassOfOrderType: (orderType: string) => string;
  dailySales_getClassOfPaymentStatus: (paymentStatus: string) => string;
  dailySales_listColumns: IColumnDataTable[];
  dailySales_listTypesOfOrderStatus: IDropdownItem[];
  dailySales_listTypesOfOrderType: IDropdownItem[];
  dailySales_listTypesOfPaymentStatus: IDropdownItem[];
  dailySales_listValues: never[];
}
