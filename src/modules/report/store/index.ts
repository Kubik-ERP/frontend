// constants
import {
  REPORT_SALES_ENDPOINT,
  REPORT_FINANCIAL_ENDPOINT,
  REPORT_VOUCHER_ENDPOINT,
  REPORT_CUSTOMER_ENDPOINT,
  REPORT_INVENTORY_ENDPOINT,
  STAFF_MEMBER_BASE_ENDPOINT,
} from '../constants';
import { OUTLET_BASE_ENDPOINT } from '@/modules/outlet/constants';
// Plugins
import httpClient from '@/plugins/axios';
// type
import type { AxiosRequestConfig } from 'axios';
import type {
  IReportStore,
  IReportQueryParams,
  IFinancialReport_discount,
  IFinancialReport_paymentMethod,
  IFinancialReport_FinancialSummary,
  IFinancialReport_taxServiceCharge,
  // IInventoryReport_stock,
  // IInventoryReport_stockMovement,
  IInventoryReport_movementLedger,
  IInventoryReport_currentStockOverview,
  IInventoryReport_poReceivingVariance,
  IInventoryReport_slowDeadStock,
  IInventoryReport_itemPerformance,
  IInventoryReport_itemPerformanceByCategory,
  IInventoryReport_itemPerformanceByBrand,
  IVoucherReport,
  ISalesReport,
  ICustomerReport,
  IOutlet,
  IStaffMember,
} from '../interfaces';

export const useReportStore = defineStore('report', {
  state: (): IReportStore => ({
    report_isLoading: false,
    // populate select
    outlet_lists_values: [] as IOutlet[],
    staff_lists_values: [] as IStaffMember[],
    // financial
    report_profitAndLost_values: {} as IFinancialReport_FinancialSummary,
    report_discount_values: {} as IFinancialReport_discount,
    report_paymentMethod_values: {} as IFinancialReport_paymentMethod,
    report_taxAndServiceCharge_values: [] as IFinancialReport_taxServiceCharge[],
    // sales
    salesReport_salesByItem_values: {} as ISalesReport,
    salesReport_salesByCategory_values: {} as ISalesReport,
    salesReport_salesByCustomer_values: {} as ISalesReport,
    salesReport_salesByStaff_values: {} as ISalesReport,
    salesReport_salesByDay_values: {} as ISalesReport,
    salesReport_salesByMonth_values: {} as ISalesReport,
    salesReport_salesByQuarter_values: {} as ISalesReport,
    salesReport_salesByYear_values: {} as ISalesReport,
    // inventory
    inventoryReport_movementLedger_values: [] as IInventoryReport_movementLedger[],
    inventoryReport_currentStockOverview_values: {} as IInventoryReport_currentStockOverview,
    inventoryReport_poReceivingVariance_values: [] as IInventoryReport_poReceivingVariance[],
    inventoryReport_slowDeadStock_values: [] as IInventoryReport_slowDeadStock[],
    inventoryReport_itemPerformance_values: [] as IInventoryReport_itemPerformance[],
    inventoryReport_itemPerformanceByCategory_values: [] as IInventoryReport_itemPerformanceByCategory[],
    inventoryReport_itemPerformanceByBrand_values: [] as IInventoryReport_itemPerformanceByBrand[],
    // voucher
    voucherReport_values: [] as IVoucherReport[],
    // customer
    customerReport_values: [] as ICustomerReport[],
  }),
  actions: {
    /**
     * @description Handle fetch api outlet get list outlet
     * @url /store
     * @method GET
     * @access private
     */
    async fetchOutlet_lists(requestConfigurations: AxiosRequestConfig) {
      this.report_isLoading = true;
      try {
        const response = await httpClient.get(OUTLET_BASE_ENDPOINT, {
          params: {
            page: 1,
            limit: 100,
          },
          ...requestConfigurations,
        });

        this.outlet_lists_values = response.data.data.items;

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.report_isLoading = false;
      }
    },

    async fetchStaffMember_lists(store_ids: string | null | undefined, requestConfigurations: AxiosRequestConfig) {
      this.report_isLoading = true;
      try {
        const response = await httpClient.get(`${STAFF_MEMBER_BASE_ENDPOINT}`, {
          params: {
            store_ids,
            page: 1,
            limit: 100,
          },
          ...requestConfigurations,
        });

        this.staff_lists_values = response.data.data.map((staffMember: IStaffMember) => ({
          ...staffMember,
          name: staffMember.fullname,
        }));

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.report_isLoading = false;
      }
    },

    async getFinancialReport_profitAndLost(params: IReportQueryParams, requestConfigurations: AxiosRequestConfig) {
      this.report_isLoading = true;
      try {
        const response = await httpClient.get(`${REPORT_FINANCIAL_ENDPOINT}`, {
          params,
          ...requestConfigurations,
        });
        // console.log('response', response.data);
        switch (params.type) {
          case 'financial-summary': {
            this.report_profitAndLost_values = response.data.data;
            break;
          }
          case 'discount-summary': {
            this.report_discount_values = response.data.data;
            break;
          }
          case 'payment-summary': {
            this.report_paymentMethod_values = response.data.data;
            break;
          }
          case 'tax-and-service-summary': {
            this.report_taxAndServiceCharge_values = response.data.data;
            break;
          }
          default: {
            console.warn(`Unknown type: ${params.type}`);
          }
        }
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.report_isLoading = false;
      }
    },

    async getSalesReport(params: IReportQueryParams, requestConfigurations: AxiosRequestConfig) {
      this.report_isLoading = true;
      try {
        const response = await httpClient.get(`${REPORT_SALES_ENDPOINT}`, {
          params,
          ...requestConfigurations,
        });
        // console.log('response', response.data);
        switch (params.type) {
          case 'item': {
            this.salesReport_salesByItem_values = response.data.data;
            break;
          }
          case 'category': {
            this.salesReport_salesByCategory_values = response.data.data;
            break;
          }
          case 'customer': {
            this.salesReport_salesByCustomer_values = response.data.data;
            break;
          }
          case 'staff': {
            this.salesReport_salesByStaff_values = response.data.data;
            break;
          }
          case 'day': {
            this.salesReport_salesByDay_values = response.data.data;
            break;
          }
          case 'month': {
            this.salesReport_salesByMonth_values = response.data.data;
            break;
          }
          case 'quarter': {
            this.salesReport_salesByQuarter_values = response.data.data;
            break;
          }
          case 'year': {
            this.salesReport_salesByYear_values = response.data.data;
            break;
          }
          default: {
            console.warn(`Unknown type: ${params.type}`);
          }
        }
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.report_isLoading = false;
      }
    },

    async getInventoryReport(params: IReportQueryParams, requestConfigurations: AxiosRequestConfig) {
      this.report_isLoading = true;
      try {
        const response = await httpClient.get(`${REPORT_INVENTORY_ENDPOINT}`, {
          params,
          ...requestConfigurations,
        });
        // console.log('response', response.data);
        switch (params.type) {
          case 'movement-ledger': {
            this.inventoryReport_movementLedger_values = response.data.data;
            break;
          }
          case 'current-stock-overview': {
            this.inventoryReport_currentStockOverview_values = response.data.data;
            break;
          }
          case 'po-receiving-variance': {
            this.inventoryReport_poReceivingVariance_values = response.data.data;
            break;
          }
          case 'slow-dead-stock': {
            this.inventoryReport_slowDeadStock_values = response.data.data;
            break;
          }
          case 'item-performance': {
            this.inventoryReport_itemPerformance_values = response.data.data;
            break;
          }
          case 'item-performance-by-category': {
            this.inventoryReport_itemPerformanceByCategory_values = response.data.data;
            break;
          }
          case 'item-performance-by-brand': {
            this.inventoryReport_itemPerformanceByBrand_values = response.data.data;
            break;
          }
          default: {
            console.warn(`Unknown type: ${params.type}`);
          }
        }
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.report_isLoading = false;
      }
    },

    async getVoucherReport(params: IReportQueryParams, requestConfigurations: AxiosRequestConfig) {
      this.report_isLoading = true;
      try {
        const response = await httpClient.get(`${REPORT_VOUCHER_ENDPOINT}`, {
          params,
          ...requestConfigurations,
        });
        // console.log('response', response.data);
        this.voucherReport_values = response.data.data;
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.report_isLoading = false;
      }
    },

    async getCustomerReport(params: IReportQueryParams, requestConfigurations: AxiosRequestConfig) {
      this.report_isLoading = true;
      try {
        const response = await httpClient.get(`${REPORT_CUSTOMER_ENDPOINT}`, {
          params,
          ...requestConfigurations,
        });
        // console.log('response', response.data);
        this.customerReport_values = response.data.data;
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.report_isLoading = false;
      }
    },
  },
});
