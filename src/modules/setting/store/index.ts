// Constants
import {
  SETTING_CHARGES_BASE_ENDPOINT,
  SETTING_CHARGES_UPSERT_ENDPOINT,
  SETTING_INVOICE_BASE_ENDPOINT,
  SETTING_PAYMENT_METHOD_ENDPOINT,
} from '../constants/setting-api.constant';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type {
  ISettingStateStore,
  ISettingInvoiceDetailResponse,
  ISettingTaxAndServiceResponse,
  ISettingTaxAndServiceFormData,
  ISettingPaymentMethodResponse,
  ISettingPaymentMethodFormData,
} from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';

export const useSettingStore = defineStore('pos-setting', {
  state: (): ISettingStateStore => ({
    setting_isLoading: false,
    setting_invoice: null,
    setting_paymentMethod: [],
    setting_service: null,
    setting_tax: null,
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {
    /**
     * @description Handle fetch api pos setting - create payment method
     * @url /payment/method
     * @method POST
     * @access private
     */
    async fetchSetting_createPaymentMethod(
      payload: ISettingPaymentMethodFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.setting_isLoading = true;

      try {
        const response = await httpClient.post<unknown>(SETTING_PAYMENT_METHOD_ENDPOINT, payload, {
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.setting_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api pos setting - detail invoice setting
     * @url /invoice/setting
     * @method PUT
     * @access private
     */
    async fetchSetting_detailInvoiceSetting(
      storeId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<ISettingInvoiceDetailResponse> {
      this.setting_isLoading = true;

      try {
        const response = await httpClient.get<ISettingInvoiceDetailResponse>(SETTING_INVOICE_BASE_ENDPOINT, {
          params: { storeId },
          ...requestConfigurations,
        });

        if (response.data.data.length > 0) {
          this.setting_invoice = response.data.data[0];
        }

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.setting_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api pos setting - list charges
     * @url /charges
     * @method GET
     * @access private
     */
    async fetchSetting_listCharges(
      storeId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<ISettingTaxAndServiceResponse> {
      this.setting_isLoading = true;

      try {
        const response = await httpClient.get<ISettingTaxAndServiceResponse>(SETTING_CHARGES_BASE_ENDPOINT, {
          params: { storeId },
          ...requestConfigurations,
        });

        if (response.data.data.length > 0) {
          this.setting_service = response.data.data.find(charge => charge.type === 'service') || null;
          this.setting_tax = response.data.data.find(charge => charge.type === 'tax') || null;
        }

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.setting_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api pos setting - list payment methods
     * @url /payment/method
     * @method GET
     * @access private
     */
    async fetchSetting_listPaymentMethods(
      requestConfigurations: AxiosRequestConfig,
    ): Promise<ISettingPaymentMethodResponse> {
      this.setting_isLoading = true;

      try {
        const response = await httpClient.get<ISettingPaymentMethodResponse>(SETTING_PAYMENT_METHOD_ENDPOINT, {
          ...requestConfigurations,
        });

        if (response.data.data.length > 0) {
          this.setting_paymentMethod = response.data.data;
        }

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.setting_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api pos setting - update charges
     * @url /charges/upsert
     * @method PUT
     * @access private
     */
    async fetchSetting_updateCharges(
      payload: ISettingTaxAndServiceFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.setting_isLoading = true;

      try {
        const response = await httpClient.post<unknown>(SETTING_CHARGES_UPSERT_ENDPOINT, payload, {
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.setting_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api pos setting - update invoice setting
     * @url /invoice/setting
     * @method PUT
     * @access private
     */
    async fetchSetting_updateInvoiceSetting(
      payload: FormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.setting_isLoading = true;

      try {
        const response = await httpClient.put<unknown>(SETTING_INVOICE_BASE_ENDPOINT, payload, {
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.setting_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api pos setting - update payment method
     * @url /payment/method
     * @method PUT
     * @access private
     */
    async fetchSetting_updatePaymentMethod(
      id: number,
      payload: ISettingPaymentMethodFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.setting_isLoading = true;

      try {
        const response = await httpClient.put<unknown>(SETTING_PAYMENT_METHOD_ENDPOINT, payload, {
          params: { id },
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.setting_isLoading = false;
      }
    },
  },
});
