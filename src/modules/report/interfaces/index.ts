import type {
  IFinancialReport_cashInOut,
  IFinancialReport_paymentMethod,
  IFinancialReport_profitAndLost,
  IFinancialReport_taxServiceCharge,
} from './financial-report';
export * from './financial-report';

import type { ISalesReport } from './sales-report';
export * from './sales-report';

import type { IInventoryReport_stock, IInventoryReport_stockMovement } from './inventory-report';
export * from './inventory-report';

// customer
import type { ICustomerReport } from './customer-report';
export * from './customer-report';
export interface IReportQueryParams {
  startDate: Date;
  endDate: Date;
  type?: string | null;
}

import type { IVoucherReport } from './voucher-report';
export * from './voucher-report';

export interface IReportStore {
  report_isLoading: boolean;
  // financial report
  report_profitAndLost_values: IFinancialReport_profitAndLost;
  report_cashInOut_values: IFinancialReport_cashInOut[];
  report_paymentMethod_values: IFinancialReport_paymentMethod;
  report_taxAndServiceCharge_values: IFinancialReport_taxServiceCharge[];
  // sales report
  salesReport_salesByItem_values: ISalesReport;
  salesReport_salesByCategory_values: ISalesReport;
  salesReport_salesByCustomer_values: ISalesReport;
  salesReport_salesByStaff_values: ISalesReport;
  salesReport_salesByDay_values: ISalesReport;
  salesReport_salesByMonth_values: ISalesReport;
  salesReport_salesByQuarter_values: ISalesReport;
  salesReport_salesByYear_values: ISalesReport;
  // inventory report
  inventoryReport_stock_values: IInventoryReport_stock[];
  inventoryReport_stockMovement_values: IInventoryReport_stockMovement[];
  // voucher report
  voucherReport_values: IVoucherReport[];
  // customer report
  customerReport_values: ICustomerReport[];
}

export interface IReportProvided {
  financialReport_profitAndLost_columns: IColumnDataTable[];
  financialReport_cashInOut_columns: IColumnDataTable[];
  financialReport_paymentMethod_columns: IColumnDataTable[];
  financialReport_taxAndServiceCharge_columns: IColumnDataTable[];
  lossReport_columns: IColumnDataTable[];
  salesReport_columns: IColumnDataTable[];
  salesReport_salesByItem_columns: IColumnDataTable[];
  salesReport_salesByOrderType_columns: IColumnDataTable[];
  inventoryReport_stock_columns: IColumnDataTable[];
  inventoryReport_stockMovement_columns: IColumnDataTable[];
  voucherReport_columns: IColumnDataTable[];
  customerReport_columns: IColumnDataTable[];
  // methods
  report_getFinancialReport: (type: string) => Promise<void>;
  report_getSalesReport: (type: string) => Promise<void>;
  report_getInventoryReport: (type: string) => Promise<void>;
  report_getVoucherReport: () => Promise<void>;
  report_getCustomerReport: () => Promise<void>;
  // params
  report_queryParams: IReportQueryParams;
  // store
  report_isLoading: globalThis.Ref<boolean>;
  // financial
  report_profitAndLost_values: globalThis.Ref<IFinancialReport_profitAndLost>;
  report_cashInOut_values: globalThis.Ref<IFinancialReport_cashInOut[]>;
  report_paymentMethod_values: globalThis.Ref<IFinancialReport_paymentMethod>;
  report_taxAndServiceCharge_values: globalThis.Ref<IFinancialReport_taxServiceCharge[]>;
  // sales report
  salesReport_salesByItem_values: globalThis.Ref<ISalesReport>;
  salesReport_salesByCategory_values: globalThis.Ref<ISalesReport>;
  salesReport_salesByCustomer_values: globalThis.Ref<ISalesReport>;
  salesReport_salesByStaff_values: globalThis.Ref<ISalesReport>;
  salesReport_salesByDay_values: globalThis.Ref<ISalesReport>;
  salesReport_salesByMonth_values: globalThis.Ref<ISalesReport>;
  salesReport_salesByQuarter_values: globalThis.Ref<ISalesReport>;
  salesReport_salesByYear_values: globalThis.Ref<ISalesReport>;
  // inventory report
  inventoryReport_stock_values: globalThis.Ref<IInventoryReport_stock[]>;
  inventoryReport_stockMovement_values: globalThis.Ref<IInventoryReport_stockMovement[]>;
  // voucher report
  voucherReport_values: globalThis.Ref<IVoucherReport[]>;
  // customer report
  customerReport_values: globalThis.Ref<ICustomerReport[]>;
}
