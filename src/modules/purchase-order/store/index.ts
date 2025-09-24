// Constants
import {
  PURCHASE_ORDER_BASE_ENDPOINT,
  PURCHASE_ORDER_CANCEL_ENDPOINT,
  PURCHASE_ORDER_CONFIRM_ENDPOINT,
  PURCHASE_ORDER_PAY_ENDPOINT,
  PURCHASE_ORDER_RECEIVE_ENDPOINT,
  PURCHASE_ORDER_SHIP_ENDPOINT,
} from '../constants';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type {
  IPurchaseOrderActionResponse,
  IPurchaseOrderCancelPayload,
  IPurchaseOrderConfirmPayload,
  IPurchaseOrderCreateFormData,
  IPurchaseOrderDetailResponse,
  IPurchaseOrderListRequestQuery,
  IPurchaseOrderResponse,
  IPurchaseOrderStateStore,
  IPurchaseOrderUpdateFormData,
} from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';
import {  IPurchaseOrderReceivedPaylaod } from '../interfaces/purchase-order-received.interface';

export const usePurchaseOrderStore = defineStore('purchase-order', {
  state: (): IPurchaseOrderStateStore => ({
    purchaseOrder_detail: null,
    purchaseOrder_isLoading: false,
    purchaseOrder_lists: null,
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {
    /**
     * @description Handle fetch api purchase order - cancel
     * @url /purchase-orders/{id}/cancel
     * @method POST
     * @access private
     */
    async purchaseOrder_cancel(
      purchaseOrderId: string,
      payload: IPurchaseOrderCancelPayload,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IPurchaseOrderActionResponse> {
      this.purchaseOrder_isLoading = true;

      try {
        const response = await httpClient.post<IPurchaseOrderActionResponse>(
          PURCHASE_ORDER_CANCEL_ENDPOINT.replace('{id}', purchaseOrderId),
          payload,
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
        this.purchaseOrder_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api purchase order - confirm
     * @url /purchase-orders/{id}/confirm
     * @method POST
     * @access private
     */
    async purchaseOrder_confirm(
      purchaseOrderId: string,
      payload: IPurchaseOrderConfirmPayload,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IPurchaseOrderActionResponse> {
      this.purchaseOrder_isLoading = true;

      try {
        const response = await httpClient.post<IPurchaseOrderActionResponse>(
          PURCHASE_ORDER_CONFIRM_ENDPOINT.replace('{id}', purchaseOrderId),
          payload,
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
        this.purchaseOrder_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api purchase order - create
     * @url /purchase-orders
     * @method POST
     * @access private
     */
    async purchaseOrder_create(
      payload: IPurchaseOrderCreateFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IPurchaseOrderActionResponse> {
      this.purchaseOrder_isLoading = true;

      try {
        const response = await httpClient.post<IPurchaseOrderActionResponse>(
          PURCHASE_ORDER_BASE_ENDPOINT,
          payload,
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
        this.purchaseOrder_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api purchase order - details
     * @url /purchase-orders/{id}
     * @method GET
     * @access private
     */
    async purchaseOrder_details(
      purchaseOrderId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IPurchaseOrderDetailResponse> {
      this.purchaseOrder_isLoading = true;

      try {
        const response = await httpClient.get<IPurchaseOrderDetailResponse>(
          `${PURCHASE_ORDER_BASE_ENDPOINT}/${purchaseOrderId}`,
          {
            ...requestConfigurations,
          },
        );

        this.purchaseOrder_detail = response.data.data;

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.purchaseOrder_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api purchase order - list
     * @url /purchase-orders
     * @method GET
     * @access private
     */
    async purchaseOrder_list(
      params: IPurchaseOrderListRequestQuery = {},
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<IPurchaseOrderResponse> {
      this.purchaseOrder_isLoading = true;

      try {
        const response = await httpClient.get<IPurchaseOrderResponse>(PURCHASE_ORDER_BASE_ENDPOINT, {
          params,
          ...requestConfigurations,
        });

        this.purchaseOrder_lists = response.data.data;

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.purchaseOrder_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api purchase order - pay
     * @url /purchase-orders/{id}/pay
     * @method POST
     * @access private
     */
    async purchaseOrder_pay(
      purchaseOrderId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IPurchaseOrderActionResponse> {
      this.purchaseOrder_isLoading = true;

      try {
        const response = await httpClient.post<IPurchaseOrderActionResponse>(
          PURCHASE_ORDER_PAY_ENDPOINT.replace('{id}', purchaseOrderId),
          null,
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
        this.purchaseOrder_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api purchase order - receive
     * @url /purchase-orders/{id}/receive
     * @method POST
     * @access private
     */
    async purchaseOrder_receive(
      purchaseOrderId: string,
      payload: IPurchaseOrderReceivedPaylaod,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IPurchaseOrderActionResponse> {
      this.purchaseOrder_isLoading = true;
      try {
        const response = await httpClient.post<IPurchaseOrderActionResponse>(
          PURCHASE_ORDER_RECEIVE_ENDPOINT.replace('{id}', purchaseOrderId),
          payload,
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
        this.purchaseOrder_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api purchase order - ship
     * @url /purchase-orders/{id}/ship
     * @method POST
     * @access private
     */
    async purchaseOrder_ship(
      purchaseOrderId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IPurchaseOrderActionResponse> {
      this.purchaseOrder_isLoading = true;

      try {
        const response = await httpClient.post<IPurchaseOrderActionResponse>(
          PURCHASE_ORDER_SHIP_ENDPOINT.replace('{id}', purchaseOrderId),
          null,
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
        this.purchaseOrder_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api purchase order - update
     * @url /purchase-orders/{id}
     * @method PUT
     * @access private
     */
    async purchaseOrder_update(
      purchaseOrderId: string,
      payload: IPurchaseOrderUpdateFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IPurchaseOrderActionResponse> {
      this.purchaseOrder_isLoading = true;

      try {
        const response = await httpClient.put<IPurchaseOrderActionResponse>(
          `${PURCHASE_ORDER_BASE_ENDPOINT}/${purchaseOrderId}`,
          payload,
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
        this.purchaseOrder_isLoading = false;
      }
    },
  },
});
