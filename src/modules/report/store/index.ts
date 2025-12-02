// constants
import {
  REPORT_SALES_ENDPOINT,
  REPORT_FINANCIAL_ENDPOINT,
  REPORT_VOUCHER_ENDPOINT,
  REPORT_CUSTOMER_ENDPOINT,
  REPORT_LOYALTY_POINT_ENDPOINT,
  REPORT_INVENTORY_ENDPOINT,
  STAFF_MEMBER_BASE_ENDPOINT,
  REPORT_STAFF_ENDPOINT,
  REPORT_DOWNLOAD_PDF_ENDPOINT,
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
  // loyalty point
  ILoyaltyPointReport_spendBased,
  ILoyaltyPointReport_benefitUtilization,
  ILoyaltyPointReport_expiryWarning,
  ILoyaltyPointReport_productBased,
  ILoyaltyPointReport_typeAccumulation,
  // staff
  IStaffReport_Commission,
  IStaffReport_Individual,
  IStaffReport_CommissionByItem,
  IStaffReport_CommissionByVoucher,
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
    // loyalty point
    loyaltyPointReport_spendBased_values: {} as ILoyaltyPointReport_spendBased,
    loyaltyPointReport_benefitUtilization_values: {} as ILoyaltyPointReport_benefitUtilization,
    loyaltyPointReport_expiryWarning_values: {} as ILoyaltyPointReport_expiryWarning,
    loyaltyPointReport_productBased_values: {} as ILoyaltyPointReport_productBased,
    loyaltyPointReport_typeAccumulation_values: {} as ILoyaltyPointReport_typeAccumulation,
    // staff
    staffReport_Commission_values: {} as IStaffReport_Commission,
    staffReport_Individual_values: {} as IStaffReport_Individual,
    staffReport_CommissionByItem_values: {} as IStaffReport_CommissionByItem,
    staffReport_CommissionByVoucher_values: {} as IStaffReport_CommissionByVoucher,
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

    async getStaffReport(params: IReportQueryParams, requestConfigurations: AxiosRequestConfig) {
      this.report_isLoading = true;
      try {
        const response = await httpClient.get(`${REPORT_STAFF_ENDPOINT}`, {
          params,
          ...requestConfigurations,
        });
        switch (params.type) {
          case 'commission-report': {
            this.staffReport_Commission_values = response.data.data;
            break;
          }
          case 'individual-report': {
            this.staffReport_Individual_values = response.data.data;
            break;
          }
          case 'commission-by-items': {
            this.staffReport_CommissionByItem_values = response.data.data;
            break;
          }
          case 'commission-by-voucher': {
            this.staffReport_CommissionByVoucher_values = response.data.data;
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

    async report_downloadPDF(path: string, params: IReportQueryParams, requestConfigurations: AxiosRequestConfig) {
      try {
        const response = await httpClient.get(`${REPORT_DOWNLOAD_PDF_ENDPOINT}/${path}`, {
          params,
          ...requestConfigurations,
          responseType: 'blob',
        });

        // --- FIX IS HERE ---
        // 1. Get the content-type from the response header
        const contentType = response.headers['content-type'] || 'application/pdf';

        // 2. Create the blob with the *correct* type
        const blob = new Blob([response.data], { type: contentType });
        // --- END FIX ---

        const url = window.URL.createObjectURL(blob);
        console.log('Blob URL:', url);

        // --- (Optional but Recommended) Get filename from header ---
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'financial-report.pdf'; // Default fallback
        if (contentDisposition) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
          }
        }
        // --- End Recommended ---

        // Buat link untuk trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = filename; // Use the dynamic filename
        document.body.appendChild(a);
        a.click();

        // Bersihkan
        a.remove();
        window.URL.revokeObjectURL(url);

        // You've already handled the download, so just resolve
        return Promise.resolve();
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
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

    async getLoyaltyPointReport(params: IReportQueryParams, requestConfigurations: AxiosRequestConfig) {
      this.report_isLoading = true;
      try {
        const response = await httpClient.get(`${REPORT_LOYALTY_POINT_ENDPOINT}`, {
          params,
          ...requestConfigurations,
        });
        switch (params.type) {
          case 'spend-based': {
            this.loyaltyPointReport_spendBased_values = response.data.data;
            break;
          }

          case 'product-based': {
            this.loyaltyPointReport_productBased_values = response.data.data;
            break;
          }

          case 'benefit-utilization': {
            this.loyaltyPointReport_benefitUtilization_values = response.data.data;
            break;
          }

          case 'expiry-warning': {
            this.loyaltyPointReport_expiryWarning_values = response.data.data;
            break;
          }

          case 'type-accumulation': {
            this.loyaltyPointReport_typeAccumulation_values = response.data.data;
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
