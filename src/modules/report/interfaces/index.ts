export interface IReportQueryParams {
  startDate: Date;
  endDate: Date;
  type?: string | null;
}

export interface IReportProvided {
  financialReport_profitAndLost_columns: IColumnDataTable[];
  financialReport_cashInOut_columns: IColumnDataTable[];
  financialReport_paymentMethod_columns: IColumnDataTable[];
  financialReport_taxAndServiceCharge_columns: IColumnDataTable[];
  lossReport_columns: IColumnDataTable[];
  salesReport_salesByItem_columns: IColumnDataTable[];
  salesReport_salesByOrderType_columns: IColumnDataTable[];
  inventoryReport_stock_columns: IColumnDataTable[];
  inventoryReport_stockMovement_columns: IColumnDataTable[];
  marketingReport_columns: IColumnDataTable[];

  report_queryParams: IReportQueryParams;
}
