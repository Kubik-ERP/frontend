import type {
  IFinancialReport_cashInOut,
  IFinancialReport_paymentMethod,
  IFinancialReport_profitAndLost,
  IFinancialReport_taxServiceCharge,
} from './financial-report';
export * from './financial-report';

export interface IReportQueryParams {
  startDate: Date;
  endDate: Date;
  type?: string | null;
}

export interface IReportStore {
  report_isLoading: boolean;
  report_profitAndLost_values: IFinancialReport_profitAndLost;
  report_cashInOut_values: IFinancialReport_cashInOut[];
  report_paymentMethod_values: IFinancialReport_paymentMethod;
  report_taxAndServiceCharge_values: IFinancialReport_taxServiceCharge;
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
  // methods
  report_getFinancialReport: (type: string) => Promise<void>;
  // params
  report_queryParams: IReportQueryParams;
  // store
  report_isLoading: globalThis.Ref<boolean>;
  report_profitAndLost_values: globalThis.Ref<IFinancialReport_profitAndLost>;
  report_cashInOut_values: globalThis.Ref<IFinancialReport_cashInOut[]>;
  report_paymentMethod_values: globalThis.Ref<IFinancialReport_paymentMethod>;
  report_taxAndServiceCharge_values: globalThis.Ref<IFinancialReport_taxServiceCharge>;
}
