// Constants
import { OUTLET_BASE_ENDPOINT } from '../constants/outlet-api.constant';

// Interfaces
import type { AxiosRequestConfig } from 'axios';

// Plugins
import httpClient from '@/plugins/axios';
import { IOutletCreateEditFormData } from '../interfaces/outlet-create-edit.interface';

export const useOutletStore = defineStore('outlet', {
  state: () => ({
    outlet_detail: null,
    outlet_isLoading: false,
    outlet_lists: [],
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
      payload: IOutletCreateEditFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.outlet_isLoading = true;

      try {
        const response = await httpClient.post<unknown>(OUTLET_BASE_ENDPOINT, payload, {
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
    async fetchOutlet_deleteOutlet(outletId: string, requestConfigurations: AxiosRequestConfig): Promise<unknown> {
      this.outlet_isLoading = true;
      try {
        const response = await httpClient.delete<unknown>(`${OUTLET_BASE_ENDPOINT}/${outletId}`, {
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
    async fetchOutlet_detail(outletId: string, requestConfigurations: AxiosRequestConfig): Promise<unknown> {
      this.outlet_isLoading = true;

      try {
        const response = await httpClient.get<unknown>(`${OUTLET_BASE_ENDPOINT}/${outletId}`, {
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
     * @description Handle fetch api outlet get list outlet
     * @url /outlet
     * @method GET
     * @access private
     */
    async fetchOutlet_lists(requestConfigurations: AxiosRequestConfig): Promise<unknown> {
      this.outlet_isLoading = true;
      try {
        const response = await httpClient.get<unknown>(OUTLET_BASE_ENDPOINT, {
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
     * @description Handle fetch api outlet update outlet
     * @url /outlet/${outletId}
     * @method PUT
     * @access private
     */
    async fetchOutlet_updateOutlet(
      outletId: string,
      payload: IOutletCreateEditFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.outlet_isLoading = true;

      try {
        const response = await httpClient.put<unknown>(`${OUTLET_BASE_ENDPOINT}/${outletId}`, payload, {
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
});
