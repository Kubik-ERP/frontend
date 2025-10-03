// store
import { useReportStore } from '../store';
import { useOutletStore } from '@/modules/outlet/store';
// constant
import {
  FINANCIALREPORT_DISCOUNT_COLUMNS,
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
    report_discount_values,
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
    // outlet
    outlet_lists_values,
    // staff
    staff_lists_values,
  } = storeToRefs(store);

  const outletStore = useOutletStore();
  const { outlet_currentOutlet } = storeToRefs(outletStore);
  const outlet_lists_options = computed(() => {
    return [
      {
        label: 'All Store',
        value: outlet_lists_values.value.map(item => item.id).join(','),
      },
      ...outlet_lists_values.value.map(item => {
        return {
          label: item.name,
          value: item.id,
        };
      }),
    ];
  });

  const { httpAbort_registerAbort } = useHttpAbort();

  const report_queryParams = reactive<IReportQueryParams>({
    startDate: new Date(Date.now() + 0 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 0 * 60 * 60 * 1000),
    store_ids: outlet_currentOutlet.value?.id,
    staff_ids: 'all',
  });

  const formatQueryParamsDate = (params: IReportQueryParams, type?: string): IReportQueryParams => {
    Object.assign(report_queryParams, {
      startDate: params.startDate,
      endDate: params.endDate,
      store_ids: params.store_ids,
      staff_ids: params.staff_ids,
    });
    const newParams = {
      startDate: useFormatDateLocal(
        new Date(params.startDate).toISOString().split('T')[0] + 'T00:00:00.000Z',
      ) as unknown as Date,
      endDate: useFormatDateLocal(
        new Date(params.endDate).toISOString().split('T')[0] + 'T23:59:59.999Z',
      ) as unknown as Date,
      type: type,
      store_ids: params.store_ids,
      staff_ids: params.staff_ids,
    };
    return {
      ...newParams,
    };
  };

  const fetchOutlet_lists = async () => {
    try {
      await store.fetchOutlet_lists({
        ...httpAbort_registerAbort('OUTLET_LIST_REQUEST'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error(new Error(String(error)));
      }
    }
  };

  const fetchStaff_lists = async () => {
    try {
      await store.fetchStaffMember_lists(report_queryParams.store_ids, {
        ...httpAbort_registerAbort('STAFF_LIST_REQUEST'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error(new Error(String(error)));
      }
    }
  };

  const staff_lists_options = computed(() => {
    return [
      {
        label: 'All Staff',
        value: 'all',
      },
      ...staff_lists_values.value.map(item => {
        return {
          label: item.name,
          value: item.id,
        };
      }),
    ];
  });

  const report_getFinancialReport = async (type?: string) => {
    try {
      Promise.all([
        fetchOutlet_lists(),
        fetchStaff_lists(),
        await store.getFinancialReport_profitAndLost(formatQueryParamsDate(report_queryParams, type), {
          ...httpAbort_registerAbort('FINANCIALREPORT_REQUEST'),
        }),
      ]);
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
      Promise.all([
        fetchOutlet_lists(),
        fetchStaff_lists(),
        await store.getSalesReport(formatQueryParamsDate(report_queryParams, type), {
          ...httpAbort_registerAbort('SALESREPORT_REQUEST'),
        }),
      ]);
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

  const findOutletDetail = (id: string) => {
    return outlet_lists_values.value.find(item => item.id === id);
  };

  const findStaffDetail = (id: string) => {
    return staff_lists_values.value.find(item => item.id === id);
  };

  return {
    // constants
    financialReport_profitAndLost_columns: FINANCIALREPORT_PROFITANDLOST_COLUMNS,
    financialReport_discount_columns: FINANCIALREPORT_DISCOUNT_COLUMNS,
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
    fetchStaff_lists,
    fetchOutlet_lists,
    report_getFinancialReport,
    report_getSalesReport,
    report_getInventoryReport,
    report_getVoucherReport,
    report_getCustomerReport,
    // store
    report_isLoading,
    // financial
    report_profitAndLost_values,
    report_discount_values,
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
    // outlet
    outlet_lists_options,
    findOutletDetail,
    // staff
    staff_lists_options,
    findStaffDetail,
  };
};
