// constants
import {
  REPORT_SALES_ENDPOINT,
  REPORT_FINANCIAL_ENDPOINT,
  REPORT_VOUCHER_ENDPOINT,
  REPORT_CUSTOMER_ENDPOINT,
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
  IFinancialReport_profitAndLost,
  IFinancialReport_taxServiceCharge,
  IInventoryReport_stock,
  IInventoryReport_stockMovement,
  IVoucherReport,
  ISalesReport,
  ICustomerReport,
} from '../interfaces';
import { IOutlet } from '@/modules/outlet/interfaces';
export const useReportStore = defineStore('report', {
  state: (): IReportStore => ({
    report_isLoading: false,
    outlet_lists_values: [] as IOutlet[],
    // financial
    report_profitAndLost_values: {} as IFinancialReport_profitAndLost,
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
    inventoryReport_stock_values: [] as IInventoryReport_stock[],
    inventoryReport_stockMovement_values: [] as IInventoryReport_stockMovement[],
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
