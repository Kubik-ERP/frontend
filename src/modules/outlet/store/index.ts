// Constants
import { OUTLET_BASE_ENDPOINT } from '../constants/outlet-api.constant';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type { IOutletDetailResponse, IOutletListResponse, IOutletStateStore } from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';

export const useOutletStore = defineStore('outlet', {
  state: (): IOutletStateStore => ({
    outlet_detail: null,
    outlet_isLoading: false,
    outlet_lists: [],
    outlet_currentOutlet: null,
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {
    /**
     * @description Handle fetch api outlet create new outlet
     * @url /outlet
     * @method POST
     * @access private
     */
    async fetchOutlet_createNewOutlet(
      pin: string,
      payload: FormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.outlet_isLoading = true;

      try {
        const response = await httpClient.post<unknown>(OUTLET_BASE_ENDPOINT, payload, {
          headers: {
            pin: pin,
          },
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
        this.outlet_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api outlet delete outlet
     * @url /outlet/${outletId}
     * @method DELETE
     * @access private
     */
    async fetchOutlet_deleteOutlet(
      pin: string,
      outletId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.outlet_isLoading = true;
      try {
        const response = await httpClient.delete<unknown>(`${OUTLET_BASE_ENDPOINT}/${outletId}`, {
          headers: {
            pin: pin,
          },
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
        this.outlet_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api outlet detail
     * @url /outlet/${outletId}
     * @method GET
     * @access private
     */
    async fetchOutlet_detail(
      outletId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IOutletDetailResponse> {
      this.outlet_isLoading = true;

      try {
        const response = await httpClient.get<IOutletDetailResponse>(`${OUTLET_BASE_ENDPOINT}/${outletId}`, {
          ...requestConfigurations,
        });

        this.outlet_detail = response.data.data;

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.outlet_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api outlet get list outlet
     * @url /outlet
     * @method GET
     * @access private
     */
    async fetchOutlet_lists(requestConfigurations: AxiosRequestConfig): Promise<IOutletListResponse> {
      this.outlet_isLoading = true;
      try {
        const response = await httpClient.get<IOutletListResponse>(OUTLET_BASE_ENDPOINT, {
          ...requestConfigurations,
        });

        this.outlet_lists = response.data.data;

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.outlet_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api outlet update outlet
     * @url /outlet/${outletId}
     * @method PUT
     * @access private
     */
    async fetchOutlet_updateOutlet(
      pin: string,
      outletId: string,
      payload: FormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.outlet_isLoading = true;

      try {
        const response = await httpClient.put<unknown>(`${OUTLET_BASE_ENDPOINT}/${outletId}`, payload, {
          headers: {
            pin: pin,
          },
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
        this.outlet_isLoading = false;
      }
    },
  },
  persist: {
    key: 'outlet',
    pick: ['outlet_currentOutlet'],
    storage: localStorage,
  },
});
