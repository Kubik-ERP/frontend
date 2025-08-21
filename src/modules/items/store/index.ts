import { AxiosRequestConfig } from 'axios';
import { IInventoryItems, IInventoryItemsPayload, IInventoryItemsStockAdjustment, IInventoryItemsStockAdjustmentPayload } from '../interfaces';
import { IInventoryItemsListRequestQuery, IInventoryItemsListResponse } from '../interfaces/items-list.interface';
import httpClient from '@/plugins/axios';
import { ITEMS_API_BASE_ENDPOINT } from '../constants';
import { IInventoryItemsActionResponse } from '../interfaces/items-action.interface';
import { IInventoryItemsStcokAdjustmentListRequestQuery, IInventoryItemsStcokAdjustmentListResponse } from '../interfaces/items-stock-adjustment.interface';
import { ItemsStockAdjustmentActionResponse } from '../interfaces/items-stock-adjustment-action.interface';

export const useInventoryItemsStore = defineStore('items', {
  state: () => ({
    inventoryItems_isLoading: false,
    inventoryItems_lists: {
      statusCode: 200,
      message: '',
      data: {
        items: [] as IInventoryItems[],
        meta: {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 1,
        },
      },
    } as IInventoryItemsListResponse,
    inventoryItemsFormMode: 'create' as 'create' | 'edit',
    inventoryItems_editingItem: null as IInventoryItems | null,
    itemsStockAdjustment_lists: {
      statusCode: 200,
      message: '',
      data: {
        items: [] as IInventoryItemsStockAdjustment[],
        meta: {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 1,
        },
      },
    } as IInventoryItemsStcokAdjustmentListResponse,
    itemsStockAdjustmentFormMode:  'create' as 'create' | 'edit',
    itemStockAdjustment_editingItem: null as IInventoryItemsStockAdjustment | null
  }),

  actions: {
    setFormMode(mode: 'create' | 'edit', item: IInventoryItems | null = null) {
      this.inventoryItemsFormMode = mode;
      this.inventoryItems_editingItem = item;
    },

    setStockAdjustmentFormMode(mode: 'create' | 'edit', item: IInventoryItemsStockAdjustment | null = null) {
      this.itemsStockAdjustmentFormMode = mode;
      this.itemStockAdjustment_editingItem = item;
    },

    /**
     *
     * @param params
     * @param requestConfigurations
     * @returns
     */
    async InventoryItems_fetchData(
      params: IInventoryItemsListRequestQuery,
       requestConfigurations: AxiosRequestConfig
    ): Promise<IInventoryItemsListResponse> {
      this.inventoryItems_isLoading = true;
      try {
        const response = await httpClient.get<IInventoryItemsListResponse>(ITEMS_API_BASE_ENDPOINT, {
          params,
          ...requestConfigurations,
        });
        this.inventoryItems_lists = response.data;
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.inventoryItems_isLoading = false;
      }
    },

    /**
     * @description handle post data to end point items
     */

    async inventoryItems_PostData(requestConfigurations: AxiosRequestConfig, data: IInventoryItemsPayload): Promise<IInventoryItemsActionResponse> {
      try {
        const response = await httpClient.post<IInventoryItemsActionResponse>(ITEMS_API_BASE_ENDPOINT, data, {
          ...requestConfigurations,
        });
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /**
     * @description handle put data to end point items
     */
    async inventoryItems_PutData(requestConfigurations: AxiosRequestConfig, id: string, data: IInventoryItemsPayload): Promise<IInventoryItemsActionResponse> {
      try {
        const response = await httpClient.put<IInventoryItemsActionResponse>(`${ITEMS_API_BASE_ENDPOINT}/${id}`, data, {
          ...requestConfigurations,
        });
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description handle delete data to end point items
     */
    async inventoryItems_DeleteData(requestConfigurations: AxiosRequestConfig, id: string): Promise<IInventoryItemsActionResponse> {
      try {
        const response = await httpClient.delete<IInventoryItemsActionResponse>(`${ITEMS_API_BASE_ENDPOINT}/${id}`, {
          ...requestConfigurations,
        });
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description handle get data to end point items
     */
    async inventoryItems_GetData(requestConfigurations: AxiosRequestConfig, id: string): Promise<IInventoryItemsActionResponse> {
      try {
        const response = await httpClient.get<IInventoryItemsActionResponse>(`${ITEMS_API_BASE_ENDPOINT}/${id}`, {
          ...requestConfigurations,
        });
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     *  @description handle get data stock adjustment
     * @returns
     */

    async inventoryItem_StockAdjustment(requestConfigurations: AxiosRequestConfig, id: string, params: IInventoryItemsStcokAdjustmentListRequestQuery): Promise<IInventoryItemsStcokAdjustmentListResponse> {
      try {
        const response = await httpClient.get<IInventoryItemsStcokAdjustmentListResponse>(`${ITEMS_API_BASE_ENDPOINT}/${id}/stock-adjustments`, {
          params,
          ...requestConfigurations,
        });
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async inventoryItem_StockAdjustment_PostData(requestConfigurations: AxiosRequestConfig, idItems: string, data: IInventoryItemsStockAdjustmentPayload): Promise<ItemsStockAdjustmentActionResponse> {
      try{
        const response = await httpClient.post<ItemsStockAdjustmentActionResponse>(`${ITEMS_API_BASE_ENDPOINT}/${idItems}/stock-adjustments`, data, {
          ...requestConfigurations,
        });
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async inventoryItem_StockAdjustment_PutData(requestConfigurations: AxiosRequestConfig, idItems: string, idAdjustment: string, data: IInventoryItemsStockAdjustmentPayload): Promise<ItemsStockAdjustmentActionResponse> {
      try{
        const response = await httpClient.put<ItemsStockAdjustmentActionResponse>(`${ITEMS_API_BASE_ENDPOINT}/${idItems}/stock-adjustments/${idAdjustment}`, data, {
          ...requestConfigurations,
        });
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      }
    }
  },

});
