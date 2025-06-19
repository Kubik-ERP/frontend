// Constants
import {
  CASH_DRAWER_ADD_TRANSACTION_ENDPOINT,
  CASH_DRAWER_CLOSE_ENDPOINT,
  CASH_DRAWER_EDIT_ENDPOINT,
  CASH_DRAWER_LIST_ENDPOINT,
  CASH_DRAWER_OPEN_ENDPOINT,
  CASH_DRAWER_STATUS_ENDPOINT,
  CASH_DRAWER_TRANSACTION_ENDPOINT,
} from '../constants';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type { ICashDrawerOpenFormData, ICashDrawerRequestQuery } from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';

export const useCashDrawerStore = defineStore('cash-drawer', {
  state: () => ({
    cashDrawer_isLoading: false,
    cashDrawer_transactionLists: [],
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {
    /**
     * @description Handle fetch api cash drawer - add transaction
     * @url /cash-drawer/transaction/add
     * @method POST
     * @access private
     */
    async cashDrawer_addTransaction(
      cashDrawerId: string,
      type: 'in' | 'out',
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.cashDrawer_isLoading = true;

      try {
        const response = await httpClient.post(
          `${CASH_DRAWER_ADD_TRANSACTION_ENDPOINT}/${type}/${cashDrawerId}`,
          {},
          {
            ...requestConfigurations,
          },
        );

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.cashDrawer_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api cash drawer - close
     * @url /cash-drawer/close
     * @method POST
     * @access private
     */
    async cashDrawer_close(cashDrawerId: string, requestConfigurations: AxiosRequestConfig): Promise<unknown> {
      this.cashDrawer_isLoading = true;

      try {
        const response = await httpClient.post(
          `${CASH_DRAWER_CLOSE_ENDPOINT}/${cashDrawerId}`,
          {},
          {
            ...requestConfigurations,
          },
        );

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.cashDrawer_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api cash drawer - edit
     * @url /cash-drawer/edit
     * @method POST
     * @access private
     */
    async cashDrawer_edit(cashDrawerId: string, requestConfigurations: AxiosRequestConfig): Promise<unknown> {
      try {
        const response = await httpClient.post(
          `${CASH_DRAWER_EDIT_ENDPOINT}/${cashDrawerId}`,
          {},
          {
            ...requestConfigurations,
          },
        );

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      }
    },

    /**
     * @description Handle fetch api cash drawer - list
     * @url /cash-drawer/list
     * @method GET
     * @access private
     */
    async cashDrawer_list(
      storeId: string,
      params: ICashDrawerRequestQuery,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<unknown> {
      this.cashDrawer_isLoading = true;

      try {
        const response = await httpClient.get(`${CASH_DRAWER_LIST_ENDPOINT}/${storeId}`, {
          params,
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
        this.cashDrawer_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api cash drawer - open
     * @url /cash-drawer/open
     * @method POST
     * @access private
     */
    async cashDrawer_open(
      cashDrawerId: string,
      payload: ICashDrawerOpenFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.cashDrawer_isLoading = true;

      try {
        const response = await httpClient.post(`${CASH_DRAWER_OPEN_ENDPOINT}/${cashDrawerId}`, payload, {
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
        this.cashDrawer_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api cash drawer - status
     * @url /cash-drawer/status
     * @method GET
     * @access private
     */
    async cashDrawer_status(cashDrawerId: string, requestConfigurations: AxiosRequestConfig): Promise<unknown> {
      this.cashDrawer_isLoading = true;

      try {
        const response = await httpClient.get(`${CASH_DRAWER_STATUS_ENDPOINT}/${cashDrawerId}`, {
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
        this.cashDrawer_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api cash drawer - transactions
     * @url /cash-drawer/transactions
     * @method GET
     * @access private
     */
    async cashDrawer_transactions(
      cashDrawerId: string,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<unknown> {
      this.cashDrawer_isLoading = true;

      try {
        const response = await httpClient.get(`${CASH_DRAWER_TRANSACTION_ENDPOINT}/${cashDrawerId}`, {
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
        this.cashDrawer_isLoading = false;
      }
    },
  },
});
