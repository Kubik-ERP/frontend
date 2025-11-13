// Dependencies
import { defineStore } from 'pinia';
import type { AxiosRequestConfig } from 'axios';

// Constants
import { TRANSFER_STOCK_API } from '../constants';

// Interfaces
import type {
  ITransferStockActionResponse,
  ITransferStockApprovePayload,
  ITransferStockCancelPayload,
  ITransferStockCreatePayload,
  ITransferStockDetailResponse,
  ITransferStockListRequestQuery,
  ITransferStockListResponse,
  ITransferStockRejectPayload,
  ITransferStockShipPayload,
  ITransferStockStateStore,
  ITransferStockUpdatePayload,
} from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';

export const useTransferStockStore = defineStore('transfer-stock', {
  state: (): ITransferStockStateStore => ({
    transferStock_data: null,
    transferStock_isLoading: false,
    transferStock_lists: null,
  }),

  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },

  actions: {
    /**
     * @description Handle fetch api transfer stock - approve
     * @url /transfer-stock/transfer/change-status/{id}
     * @method POST
     * @access private
     */
    async transferStock_approve(
      transferStockId: string,
      payload: ITransferStockApprovePayload,
      requestConfigurations?: AxiosRequestConfig,
    ): Promise<ITransferStockActionResponse> {
      this.transferStock_isLoading = true;

      try {
        const response = await httpClient.post<ITransferStockActionResponse>(
          `${TRANSFER_STOCK_API.CHANGE_STATUS}/${transferStockId}`,
          payload,
          requestConfigurations,
        );

        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.transferStock_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api transfer stock - cancel
     * @url /transfer-stock/transfer/change-status/{id}
     * @method POST
     * @access private
     */
    async transferStock_cancel(
      transferStockId: string,
      payload: ITransferStockCancelPayload,
      requestConfigurations?: AxiosRequestConfig,
    ): Promise<ITransferStockActionResponse> {
      this.transferStock_isLoading = true;

      try {
        const response = await httpClient.post<ITransferStockActionResponse>(
          `${TRANSFER_STOCK_API.CHANGE_STATUS}/${transferStockId}`,
          payload,
          requestConfigurations,
        );

        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.transferStock_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api transfer stock - create
     * @url /transfer-stock/transfer
     * @method POST
     * @access private
     */
    async transferStock_create(
      payload: ITransferStockCreatePayload,
      requestConfigurations?: AxiosRequestConfig,
    ): Promise<ITransferStockDetailResponse> {
      this.transferStock_isLoading = true;

      try {
        const response = await httpClient.post<ITransferStockDetailResponse>(
          TRANSFER_STOCK_API.CREATE,
          payload,
          requestConfigurations,
        );

        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.transferStock_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api transfer stock - delete
     * @url /transfer-stock/transfer/delete/{id}
     * @method DELETE
     * @access private
     */
    async transferStock_delete(
      transferStockId: string,
      requestConfigurations?: AxiosRequestConfig,
    ): Promise<ITransferStockActionResponse> {
      this.transferStock_isLoading = true;

      try {
        const response = await httpClient.delete<ITransferStockActionResponse>(
          `${TRANSFER_STOCK_API.DELETE}/${transferStockId}`,
          requestConfigurations,
        );

        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.transferStock_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api transfer stock - detail
     * @url /transfer-stock/detail/{id}
     * @method GET
     * @access private
     */
    async transferStock_detail(
      transferStockId: string,
      requestConfigurations?: AxiosRequestConfig,
    ): Promise<ITransferStockDetailResponse> {
      this.transferStock_isLoading = true;

      try {
        const response = await httpClient.get<ITransferStockDetailResponse>(
          `${TRANSFER_STOCK_API.DETAIL}/${transferStockId}`,
          requestConfigurations,
        );

        this.transferStock_data = response.data.data;

        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.transferStock_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api transfer stock - list
     * @url /transfer-stock/transfer
     * @method GET
     * @access private
     */
    async transferStock_list(
      params?: ITransferStockListRequestQuery,
      requestConfigurations?: AxiosRequestConfig,
    ): Promise<ITransferStockListResponse> {
      this.transferStock_isLoading = true;

      try {
        const response = await httpClient.get<ITransferStockListResponse>(TRANSFER_STOCK_API.LIST, {
          params,
          ...requestConfigurations,
        });

        this.transferStock_lists = response.data.data;

        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.transferStock_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api transfer stock - reject
     * @url /transfer-stock/transfer/change-status/{id}
     * @method POST
     * @access private
     */
    async transferStock_reject(
      transferStockId: string,
      payload: ITransferStockRejectPayload,
      requestConfigurations?: AxiosRequestConfig,
    ): Promise<ITransferStockActionResponse> {
      this.transferStock_isLoading = true;

      try {
        const response = await httpClient.post<ITransferStockActionResponse>(
          `${TRANSFER_STOCK_API.CHANGE_STATUS}/${transferStockId}`,
          payload,
          requestConfigurations,
        );

        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.transferStock_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api transfer stock - receive (receiver side)
     * @url /transfer-stock/transfer/change-status/{id}
     * @method POST
     * @access private
     */
    async transferStock_receive(
      transferStockId: string,
      requestConfigurations?: AxiosRequestConfig,
    ): Promise<ITransferStockActionResponse> {
      this.transferStock_isLoading = true;

      try {
        const response = await httpClient.post<ITransferStockActionResponse>(
          `${TRANSFER_STOCK_API.CHANGE_STATUS}/${transferStockId}`,
          { status: 'receive' },
          requestConfigurations,
        );

        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.transferStock_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api transfer stock - ship
     * @url /transfer-stock/transfer/change-status/{id}
     * @method POST
     * @access private
     */
    async transferStock_ship(
      transferStockId: string,
      payload: ITransferStockShipPayload,
      requestConfigurations?: AxiosRequestConfig,
    ): Promise<ITransferStockActionResponse> {
      this.transferStock_isLoading = true;

      try {
        const response = await httpClient.post<ITransferStockActionResponse>(
          `${TRANSFER_STOCK_API.CHANGE_STATUS}/${transferStockId}`,
          payload,
          requestConfigurations,
        );

        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.transferStock_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api transfer stock - update
     * @url /transfer-stock/transfer
     * @method PUT
     * @access private
     */
    async transferStock_update(
      id: string,
      payload: ITransferStockUpdatePayload,
      requestConfigurations?: AxiosRequestConfig,
    ): Promise<ITransferStockDetailResponse> {
      this.transferStock_isLoading = true;

      try {
        const response = await httpClient.put<ITransferStockDetailResponse>(
          `${TRANSFER_STOCK_API.UPDATE}/${id}`,
          payload,
          requestConfigurations,
        );

        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.transferStock_isLoading = false;
      }
    },
  },
});
