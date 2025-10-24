// Constants
import { WASTE_LOG_BASE_ENDPOINT } from '../constants';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type { IWasteLogListQueryParams, IWasteLogStateStore, IWasteLog } from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';

export const useWasteLogStore = defineStore('waste-log', {
  state: (): IWasteLogStateStore => ({
    wasteLog_selectedData: null,
    wasteLog_isLoading: false,
    wasteLog_lists: {
      meta: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
      },
      items: [],
    },
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {
    /**
     * @description Handle fetch api waste logs - create
     * @url /waste-logs
     * @method POST
     * @access private
     */
    async wasteLog_create(payload: FormData, requestConfigurations: AxiosRequestConfig): Promise<unknown> {
      this.wasteLog_isLoading = true;

      try {
        const response = await httpClient.post<unknown>(WASTE_LOG_BASE_ENDPOINT, payload, {
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.wasteLog_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api waste logs - delete
     * @url /waste-logs/:id
     * @method DELETE
     * @access private
     */
    async wasteLog_delete(id: string, requestConfigurations: AxiosRequestConfig): Promise<unknown> {
      this.wasteLog_isLoading = true;

      try {
        const response = await httpClient.delete<unknown>(`${WASTE_LOG_BASE_ENDPOINT}/${id}`, {
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.wasteLog_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api waste logs - detail
     * @url /waste-logs/:id
     * @method GET
     * @access private
     */
    async wasteLog_detail(id: string, requestConfigurations: AxiosRequestConfig): Promise<IWasteLog> {
      this.wasteLog_isLoading = true;

      try {
        const response = await httpClient.get<{
          data: IWasteLog;
        }>(`${WASTE_LOG_BASE_ENDPOINT}/${id}`, {
          ...requestConfigurations,
        });

        this.wasteLog_selectedData = response.data.data;

        return Promise.resolve(response.data.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.wasteLog_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api waste logs - list
     * @url /waste-logs
     * @method GET
     * @access private
     */
    async wasteLog_list(
      params: IWasteLogListQueryParams,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.wasteLog_isLoading = true;

      try {
        const response = await httpClient.get<{
          data: {
            meta: IPageMeta;
            items: IWasteLog[];
          };
        }>(WASTE_LOG_BASE_ENDPOINT, {
          params,
          ...requestConfigurations,
        });

        // Update store state dengan response yang diterima
        if (response.data && response.data.data) {
          this.wasteLog_lists = response.data.data;
        }

        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.wasteLog_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api waste logs - update
     * @url /waste-logs/:id
     * @method PUT
     * @access private
     */
    async wasteLog_update(
      id: string,
      payload: FormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.wasteLog_isLoading = true;

      try {
        const response = await httpClient.put<unknown>(`${WASTE_LOG_BASE_ENDPOINT}/${id}`, payload, {
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.wasteLog_isLoading = false;
      }
    },
  },
});
