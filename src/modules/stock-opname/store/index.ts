// Plugins
import httpClient from '@/plugins/axios';

// constants
import { STOCK_OPNAME_BASE_ENDPOINT } from '../constants';

// type
import type { AxiosRequestConfig } from 'axios';
import type { IStockOpnameStore, IStockOpnameListRequestQuery, IStockOpnameFormData } from '../interfaces';

export const useStockOpnameStore = defineStore('stock-opname', {
  state: (): IStockOpnameStore => ({
    stockOpname_isLoading: false,
    stockOpname_detail: {
      id: '4fbb5132-3a86-4d9d-bf5e-470acccfbffb',
      createdAt: '2025-08-17T20:47:40.005Z',
      updatedAt: null,
      code: 'STK-20251101-001',
      storeId: 'e5396731-5263-4969-9e31-860f617b5213',
      status: 'draft',
      performedBy: 7,
      stockOpnameItems: [
        {
          id: 'ed6021fb-da13-43ca-99e3-3b31ddae4d36',
          createdAt: '2025-08-17T20:49:48.262Z',
          updatedAt: null,
          stockOpnameId: '4fbb5132-3a86-4d9d-bf5e-470acccfbffb',
          masterInventoryItemId: '5054bd41-cc1a-4d9e-9942-e9d4cba1bcbe',
          masterInventoryItems: {
            id: '5054bd41-cc1a-4d9e-9942-e9d4cba1bcbe',
            name: 'Baju',
            sku: 'B0001',
          },
          expectedQuantity: 50,
          actualQuantity: 40,
          notes: 'hmm',
          diffQuantity: -10,
        },
      ],
      users: {
        fullname: 'Fikry Ramadhan',
      },
    },
    stockOpname_lists: {
      items: [
        {
          id: '4fbb5132-3a86-4d9d-bf5e-470acccfbffb',
          createdAt: '2025-08-17T20:47:40.005Z',
          updatedAt: null,
          code: 'STK-20251101-001',
          storeId: 'e5396731-5263-4969-9e31-860f617b5213',
          status: 'draft',
          performedBy: 7,
          users: {
            fullname: 'Fikry Ramadhan',
          },
          totalItemChecked: 40,
          stockMismatches: -10,
        },
      ],
      meta: {
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
      },
    },
  }),
  actions: {
    async getStockOpnameList(
      params: IStockOpnameListRequestQuery,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.stockOpname_isLoading = true;
      try {
        const response = await httpClient.get(`${STOCK_OPNAME_BASE_ENDPOINT}`, {
          params,
          ...requestConfigurations,
        });
        this.stockOpname_lists = response.data.data;
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.stockOpname_isLoading = false;
      }
    },

    async getStockOpnameDetail(id: string, requestConfigurations: AxiosRequestConfig): Promise<unknown> {
      this.stockOpname_isLoading = true;
      try {
        const response = await httpClient.get(`${STOCK_OPNAME_BASE_ENDPOINT}/${id}`, requestConfigurations);
        this.stockOpname_detail = response.data.data;
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.stockOpname_isLoading = false;
      }
    },

    async createStockOpname(payload: IStockOpnameFormData, requestConfigurations: AxiosRequestConfig) {
      this.stockOpname_isLoading = true;
      try {
        const response = await httpClient.post(STOCK_OPNAME_BASE_ENDPOINT, payload, requestConfigurations);
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.stockOpname_isLoading = false;
      }
    },

    async updateStockOpname(id: string, payload: IStockOpnameFormData, requestConfigurations: AxiosRequestConfig) {
      this.stockOpname_isLoading = true;
      try {
        const response = await httpClient.patch(
          `${STOCK_OPNAME_BASE_ENDPOINT}/${id}`,
          payload,
          requestConfigurations,
        );
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.stockOpname_isLoading = false;
      }
    },

    async deleteStockOpname(id: string, requestConfigurations: AxiosRequestConfig) {
      this.stockOpname_isLoading = true;
      try {
        const response = await httpClient.delete(`${STOCK_OPNAME_BASE_ENDPOINT}/${id}`, requestConfigurations);
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.stockOpname_isLoading = false;
      }
    },

    async verifyStockOpname(id: string, requestConfigurations: AxiosRequestConfig) {
      this.stockOpname_isLoading = true;
      try {
        const response = await httpClient.post(
          `${STOCK_OPNAME_BASE_ENDPOINT}/${id}/verify`,
          requestConfigurations,
        );
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.stockOpname_isLoading = false;
      }
    },

  },
});
