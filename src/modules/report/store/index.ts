// constants
import { REPORT_SALES_ENDPOINT } from '../constants';
// Plugins
import httpClient from '@/plugins/axios';
// type
import type { AxiosRequestConfig } from 'axios';
import type {
  IReportStore,
  IReportQueryParams,
  IFinancialReport_cashInOut,
  IFinancialReport_paymentMethod,
  IFinancialReport_profitAndLost,
  IFinancialReport_taxServiceCharge,
  IInventoryReport_stock,
  IInventoryReport_stockMovement,
  IVoucherReport,

  ISalesReport
} from '../interfaces';
export const useReportStore = defineStore('report', {
  state: (): IReportStore => ({
    report_isLoading: false,
    report_profitAndLost_values: {} as IFinancialReport_profitAndLost,
    report_cashInOut_values: [] as IFinancialReport_cashInOut[],
    report_paymentMethod_values: {
      reportData: [] as IFinancialReport_paymentMethod['reportData'],
      totals: {} as IFinancialReport_paymentMethod['totals'],
    } as IFinancialReport_paymentMethod,
    report_taxAndServiceCharge_values: [] as IFinancialReport_taxServiceCharge[],
    salesReport_salesByItem_values: {} as ISalesReport,
    salesReport_salesByOrderType_values: {} as ISalesReport,
    inventoryReport_stock_values: [] as IInventoryReport_stock[],
    inventoryReport_stockMovement_values: [] as IInventoryReport_stockMovement[],
    voucherReport_values: [] as IVoucherReport[],
  }),
  actions: {
    async getFinancialReport_profitAndLost(params: IReportQueryParams, requestConfigurations: AxiosRequestConfig) {
      this.report_isLoading = true;
      try {
        const response = await httpClient.get(`dashboard/financial-report`, {
          params,
          ...requestConfigurations,
        });
        // console.log('response', response.data);
        switch (params.type) {
          case 'profit-loss': {
            this.report_profitAndLost_values = response.data.data;
            break;
          }
          case 'cashin-out': {
            this.report_cashInOut_values = response.data.data;
            break;
          }
          case 'payment-method': {
            this.report_paymentMethod_values = response.data.data;
            break;
          }
          case 'tax-service': {
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
            console.log('this.salesReport_salesByItem_values', this.salesReport_salesByItem_values);
            break;
          }
          case 'order': {
            this.salesReport_salesByOrderType_values = response.data;
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
        const response = await httpClient.get(`dashboard/stock-report`, {
          params,
          ...requestConfigurations,
        });
        // console.log('response', response.data);
        switch (params.type) {
          case 'stock': {
            this.inventoryReport_stock_values = response.data.data;
            break;
          }
          case 'movement': {
            this.inventoryReport_stockMovement_values = response.data.data;
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
        const response = await httpClient.get(`dashboard/voucher-report`, {
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
  },
});
