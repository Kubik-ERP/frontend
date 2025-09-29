// store
import { useReportStore } from '../store';
// constant
import {
  FINANCIALREPORT_CASHINOUT_COLUMNS,
  FINANCIALREPORT_PAYMENTMETHOD_COLUMNS,
  FINANCIALREPORT_PROFITANDLOST_COLUMNS,
  FINANCIALREPORT_TAXANDSERVICECHARGE_COLUMNS,
  INVENTORYREPORT_STOCKMOVEMENT_COLUMNS,
  INVENTORYREPORT_STOCK_COLUMNS,
  LOSSREPORT_COLUMNS,
  MARKETINGREPORT_COLUMNS,
  SALESREPORT_SALESBYITEM_COLUMNS,
  SALESREPORT_SALESBYORDERTYPE_COLUMNS,
  SALESREPORT_COLUMNS,
  CUSTOMERREPORT_COLUMNS,
} from '../constants';
// type
import { IReportProvided, IReportQueryParams } from '../interfaces';

export const useReportService = (): IReportProvided => {
  const store = useReportStore();
  const {
    report_isLoading,
    // financial
    report_profitAndLost_values,
    report_cashInOut_values,
    report_paymentMethod_values,
    report_taxAndServiceCharge_values,
    // sales
    salesReport_salesByItem_values,
    salesReport_salesByCategory_values,
    salesReport_salesByCustomer_values,
    salesReport_salesByStaff_values,
    salesReport_salesByDay_values,
    salesReport_salesByMonth_values,
    salesReport_salesByQuarter_values,
    salesReport_salesByYear_values,
    // inventory
    inventoryReport_stock_values,
    inventoryReport_stockMovement_values,
    // voucher
    voucherReport_values,
    // customer
    customerReport_values,
  } = storeToRefs(store);

  const { httpAbort_registerAbort } = useHttpAbort();

  const report_queryParams = reactive<IReportQueryParams>({
    startDate: new Date(Date.now() + 7 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 7 * 60 * 60 * 1000),
  });

  const formatQueryParamsDate = (params: IReportQueryParams, type?: string): IReportQueryParams => {
    // console.log('before: ', JSON.stringify(params, null, 2));
    Object.assign(report_queryParams, {
      startDate: params.startDate,
      endDate: params.endDate,
    });
    const newParams = {
      startDate: (new Date(params.startDate).toISOString().split('T')[0] + 'T00:00:00.000Z') as unknown as Date,
      endDate: (new Date(params.endDate).toISOString().split('T')[0] + 'T23:59:59.999Z') as unknown as Date,
      type: type,
    };
    // console.log('after: ', JSON.stringify(newParams, null, 2));

    return {
      ...newParams,
    };
  };

  const report_getFinancialReport = async (type?: string) => {
    try {
      await store.getFinancialReport_profitAndLost(formatQueryParamsDate(report_queryParams, type), {
        ...httpAbort_registerAbort('FINANCIALREPORT_REQUEST'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error(new Error(String(error)));
      }
    }
  };

  const report_getSalesReport = async (type?: string) => {
    try {
      await store.getSalesReport(formatQueryParamsDate(report_queryParams, type), {
        ...httpAbort_registerAbort('SALESREPORT_REQUEST'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error(new Error(String(error)));
      }
    }
  };

  const report_getInventoryReport = async (type?: string) => {
    try {
      await store.getInventoryReport(formatQueryParamsDate(report_queryParams, type), {
        ...httpAbort_registerAbort('INVENTORYREPORT_REQUEST'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error(new Error(String(error)));
      }
    }
  };

  const report_getVoucherReport = async () => {
    try {
      await store.getVoucherReport(formatQueryParamsDate(report_queryParams), {
        ...httpAbort_registerAbort('VOUCHERREPORT_REQUEST'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error(new Error(String(error)));
      }
    }
  };

  const report_getCustomerReport = async () => {
    try {
      await store.getCustomerReport(formatQueryParamsDate(report_queryParams), {
        ...httpAbort_registerAbort('CUSTOMERREPORT_REQUEST'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error(new Error(String(error)));
      }
    }
  };

  return {
    // constants
    financialReport_profitAndLost_columns: FINANCIALREPORT_PROFITANDLOST_COLUMNS,
    financialReport_cashInOut_columns: FINANCIALREPORT_CASHINOUT_COLUMNS,
    financialReport_paymentMethod_columns: FINANCIALREPORT_PAYMENTMETHOD_COLUMNS,
    financialReport_taxAndServiceCharge_columns: FINANCIALREPORT_TAXANDSERVICECHARGE_COLUMNS,
    lossReport_columns: LOSSREPORT_COLUMNS,
    salesReport_salesByItem_columns: SALESREPORT_SALESBYITEM_COLUMNS,
    salesReport_salesByOrderType_columns: SALESREPORT_SALESBYORDERTYPE_COLUMNS,
    salesReport_columns: SALESREPORT_COLUMNS,
    inventoryReport_stock_columns: INVENTORYREPORT_STOCK_COLUMNS,
    inventoryReport_stockMovement_columns: INVENTORYREPORT_STOCKMOVEMENT_COLUMNS,
    voucherReport_columns: MARKETINGREPORT_COLUMNS,
    customerReport_columns: CUSTOMERREPORT_COLUMNS,
    // params
    report_queryParams,
    // methods
    report_getFinancialReport,
    report_getSalesReport,
    report_getInventoryReport,
    report_getVoucherReport,
    report_getCustomerReport,
    // store
    report_isLoading,
    // financial
    report_profitAndLost_values,
    report_cashInOut_values,
    report_paymentMethod_values,
    report_taxAndServiceCharge_values,
    // sales
    salesReport_salesByItem_values,
    salesReport_salesByCategory_values,
    salesReport_salesByCustomer_values,
    salesReport_salesByStaff_values,
    salesReport_salesByDay_values,
    salesReport_salesByMonth_values,
    salesReport_salesByQuarter_values,
    salesReport_salesByYear_values,
    // inventory
    inventoryReport_stock_values,
    inventoryReport_stockMovement_values,
    // voucher
    voucherReport_values,
    // customer
    customerReport_values,
  };
};
