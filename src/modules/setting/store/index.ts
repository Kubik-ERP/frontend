// Constants
import { SETTING_INVOICE_BASE_ENDPOINT } from "../constants/setting-api.constant";

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type { ISettingStateStore, ISettingInvoiceDetailResponse } from "../interfaces";

// Plugins
import httpClient from '@/plugins/axios';

export const useSettingStore = defineStore('pos-setting', {
  state: (): ISettingStateStore => ({
    setting_isLoading: false,
    setting_invoice: null,
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {
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
    }
  }
});