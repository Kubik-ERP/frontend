import type {
  IFinancialReport_discount,
  IFinancialReport_paymentMethod,
  IFinancialReport_FinancialSummary,
  IFinancialReport_taxServiceCharge,
} from './financial-report';
export * from './financial-report';

import type {
  ILoyaltyPointReport_spendBased,
  ILoyaltyPointReport_benefitUtilization,
  ILoyaltyPointReport_expiryWarning,
  ILoyaltyPointReport_productBased,
  ILoyaltyPointReport_typeAccumulation,
} from './loyalty-point-report';
export * from './loyalty-point-report';

import type { ISalesReport } from './sales-report';
export * from './sales-report';

import type {
  // IInventoryReport_stock,
  // IInventoryReport_stockMovement,
  IInventoryReport_movementLedger,
  IInventoryReport_currentStockOverview,
  IInventoryReport_poReceivingVariance,
  IInventoryReport_slowDeadStock,
  IInventoryReport_itemPerformance,
  IInventoryReport_itemPerformanceByCategory,
  IInventoryReport_itemPerformanceByBrand,
} from './inventory-report';
export * from './inventory-report';

// customer
import type { ICustomerReport } from './customer-report';
export * from './customer-report';
export interface IReportQueryParams {
  startDate: Date;
  endDate: Date;
  type?: string | null;
  store_ids?: string | null;
  staff_ids?: string | null;
  gmt?: number | null;
}

import type { IVoucherReport } from './voucher-report';
export * from './voucher-report';

import { IOutlet } from '@/modules/outlet/interfaces';
export type { IOutlet };

export interface IStaffMember {
  id: string;
  fullname: string;
  name?: string;
}

interface IOutletListOptions {
  value: string;
  label: string;
}

interface IStaffMemberListOptions {
  value: string;
  label: string;
}

export interface IReportStore {
  report_isLoading: boolean;
  // populate select
  outlet_lists_values: IOutlet[];
  staff_lists_values: IStaffMember[];
  // financial report
  report_profitAndLost_values: IFinancialReport_FinancialSummary;
  report_discount_values: IFinancialReport_discount;
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
  // inventoryReport_stock_values: IInventoryReport_stock[];
  // inventoryReport_stockMovement_values: IInventoryReport_stockMovement[];
  inventoryReport_movementLedger_values: IInventoryReport_movementLedger[];
  inventoryReport_currentStockOverview_values: IInventoryReport_currentStockOverview;
  inventoryReport_poReceivingVariance_values: IInventoryReport_poReceivingVariance[];
  inventoryReport_slowDeadStock_values: IInventoryReport_slowDeadStock[];
  inventoryReport_itemPerformance_values: IInventoryReport_itemPerformance[];
  inventoryReport_itemPerformanceByCategory_values: IInventoryReport_itemPerformanceByCategory[];
  inventoryReport_itemPerformanceByBrand_values: IInventoryReport_itemPerformanceByBrand[];
  // voucher report
  voucherReport_values: IVoucherReport[];
  // customer report
  customerReport_values: ICustomerReport[];
  // loyalty point report
  loyaltyPointReport_spendBased_values: ILoyaltyPointReport_spendBased;
  loyaltyPointReport_benefitUtilization_values: ILoyaltyPointReport_benefitUtilization;
  loyaltyPointReport_expiryWarning_values: ILoyaltyPointReport_expiryWarning;
  loyaltyPointReport_productBased_values: ILoyaltyPointReport_productBased;
  loyaltyPointReport_typeAccumulation_values: ILoyaltyPointReport_typeAccumulation;
}

export interface IReportProvided {
  hasAccessAllStorePermission: boolean;
  hasStoreManagementPermission: boolean;
  hasManageStaffMemberPermission: boolean;
  // columns
  financialReport_profitAndLost_columns: IColumnDataTable[];
  financialReport_discount_columns: IColumnDataTable[];
  financialReport_paymentMethod_columns: IColumnDataTable[];
  financialReport_taxAndServiceCharge_columns: IColumnDataTable[];
  lossReport_columns: IColumnDataTable[];
  salesReport_columns: IColumnDataTable[];
  salesReport_salesByItem_columns: IColumnDataTable[];
  salesReport_salesByOrderType_columns: IColumnDataTable[];
  inventoryReport_movementLedger_columns: IColumnDataTable[];
  inventoryReport_currentStockOverview_columns: IColumnDataTable[];
  inventoryReport_poReceivingVariance_columns: IColumnDataTable[];
  inventoryReport_slowDeadStock_columns: IColumnDataTable[];
  inventoryReport_itemPerformance_columns: IColumnDataTable[];
  inventoryReport_itemPerformanceByCategory_columns: IColumnDataTable[];
  inventoryReport_itemPerformanceByBrand_columns: IColumnDataTable[];
  voucherReport_columns: IColumnDataTable[];
  customerReport_columns: IColumnDataTable[];
  loyaltyPointReport_spendBased_columns: IColumnDataTable[];
  loyaltyPointReport_benefitUtilization_columns: IColumnDataTable[];
  loyaltyPointReport_expiryWarning_columns: IColumnDataTable[];
  loyaltyPointReport_productBased_columns: IColumnDataTable[];
  loyaltyPointReport_typeAccumulation_columns: IColumnDataTable[];
  // methods
  fetchStaff_lists: () => Promise<void>;
  fetchOutlet_lists: () => Promise<void>;
  report_getFinancialReport: (type: string) => Promise<void>;
  report_getSalesReport: (type: string) => Promise<void>;
  report_getInventoryReport: (type: string) => Promise<void>;
  report_getVoucherReport: () => Promise<void>;
  report_getCustomerReport: () => Promise<void>;
  report_getLoyaltyPointReport: (type: string) => Promise<void>;
  // params
  report_queryParams: IReportQueryParams;
  // store
  report_isLoading: globalThis.Ref<boolean>;
  // financial
  report_profitAndLost_values: globalThis.Ref<IFinancialReport_FinancialSummary>;
  report_discount_values: globalThis.Ref<IFinancialReport_discount>;
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
  inventoryReport_movementLedger_values: globalThis.Ref<IInventoryReport_movementLedger[]>;
  inventoryReport_currentStockOverview_values: globalThis.Ref<IInventoryReport_currentStockOverview>;
  inventoryReport_poReceivingVariance_values: globalThis.Ref<IInventoryReport_poReceivingVariance[]>;
  inventoryReport_slowDeadStock_values: globalThis.Ref<IInventoryReport_slowDeadStock[]>;
  inventoryReport_itemPerformance_values: globalThis.Ref<IInventoryReport_itemPerformance[]>;
  inventoryReport_itemPerformanceByCategory_values: globalThis.Ref<IInventoryReport_itemPerformanceByCategory[]>;
  inventoryReport_itemPerformanceByBrand_values: globalThis.Ref<IInventoryReport_itemPerformanceByBrand[]>;
  // voucher report
  voucherReport_values: globalThis.Ref<IVoucherReport[]>;
  // customer report
  customerReport_values: globalThis.Ref<ICustomerReport[]>;
  // loyalty point report
  loyaltyPointReport_spendBased_values: globalThis.Ref<ILoyaltyPointReport_spendBased>;
  loyaltyPointReport_benefitUtilization_values: globalThis.Ref<ILoyaltyPointReport_benefitUtilization>;
  loyaltyPointReport_expiryWarning_values: globalThis.Ref<ILoyaltyPointReport_expiryWarning>;
  loyaltyPointReport_productBased_values: globalThis.Ref<ILoyaltyPointReport_productBased>;
  loyaltyPointReport_typeAccumulation_values: globalThis.Ref<ILoyaltyPointReport_typeAccumulation>;
  // outlet_list
  outlet_lists_options: globalThis.Ref<IOutletListOptions[]>;
  findOutletDetail: (id: string) => IOutlet | null | undefined;
  // staff_list
  staff_lists_options: globalThis.Ref<IStaffMemberListOptions[]>;
  findStaffDetail: (id: string) => IStaffMember | null | undefined;
  // misc
  outlet_currentOutlet: globalThis.Ref<IOutlet | null>;
  // download dialog
  isDialogVisible: globalThis.Ref<boolean>;
  downloadStatus: globalThis.Ref<'downloading' | 'success' | 'error'>;
  dialogDownload_onClose: () => void;
  // export pdf
  isDownloading: globalThis.Ref<boolean>;
  report_downloadPDF: (
    path:
      | 'financial-report'
      | 'advanced-sales-report'
      | 'inventory-report'
      | 'voucher-report'
      | 'staff-report'
      | 'loyalty-report'
      | 'customer-report',
    type: string,
  ) => Promise<void>;
}
