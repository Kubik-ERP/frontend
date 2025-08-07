export interface IPurchaseOrderListProvided {
  purchaseOrderList_columns: IColumnDataTable[];
  purchaseOrderList_getClassOfStatus: (status: string) => string;
  purchaseOrderList_onShowButtonCancelPO: (status: string) => boolean;
  purchaseOrderList_onShowButtonDeliveryOrderDocument: (status: string) => boolean;
  purchaseOrderList_values: never[];
}
