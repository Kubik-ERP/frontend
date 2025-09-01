// constants
// import { REPORT_BASE_ENDPOINT } from '../constants';
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
} from '../interfaces';
export const useReportStore = defineStore('report', {
  state: (): IReportStore => ({
    report_isLoading: false,
    report_profitAndLost_values: {} as IFinancialReport_profitAndLost,
    report_cashInOut_values: [] as IFinancialReport_cashInOut[],
    report_paymentMethod_values: {} as IFinancialReport_paymentMethod,
    report_taxAndServiceCharge_values: {} as IFinancialReport_taxServiceCharge,
  }),
  actions: {
    async getFinancialReport_profitAndLost(params: IReportQueryParams, requestConfigurations: AxiosRequestConfig) {
      this.report_isLoading = true;
      try {
        const response = await httpClient.get(`dashboard/financial-report`, {
          params,
          ...requestConfigurations,
        });
        console.log('response', response.data);
        switch (params.type) {
          case 'profit-loss': {
            this.report_profitAndLost_values = response.data;
            break;
          }
          case 'cashin-out': {
            this.report_cashInOut_values = response.data.data;
            break;
          }
          case 'payment-method': {
            this.report_paymentMethod_values = response.data;
            break;
          }
          case 'tax-service': {
            this.report_taxAndServiceCharge_values = response.data;
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
  },
});
