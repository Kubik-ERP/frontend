import { AxiosRequestConfig } from "axios";
import { defineStore } from "pinia";
import {
  IInventoryCategoryActionResponse,
  IInventoryCategoryCreateUpdatePayload,
  IInventoryCategoryListResponse,
  IInventoryCategoryStateStore,
  IInventoryCategory,
} from "../interfaces";
import { IInventoryCategoryListRequestQuery } from "../interfaces/inventory-category-list.interface";
import httpClient from "@/plugins/axios";
import { INVENTORY_CATEGORY_BASE_ENDPOINT } from "../constants";
import { IInventoryCategoryImport, IInventoryCategoryImportResponse } from "../interfaces/inventory-category-import.interface";

export const useInventoryCategoryStore = defineStore('inventory-category', {
  state: (): IInventoryCategoryStateStore & {
    inventoryCategoryFormMode: 'create' | 'edit';
    inventoryCategory_editingItem: IInventoryCategory | null;
  } => ({
    inventoryCategoryList_isLoading: false,
    inventoryCategoryList: {
      statusCode: 200,
      message: '',
      data: {
        items: [],
        meta: {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 1,
        },
      },
    },
    // NEW: shared form mode & editing item
    inventoryCategoryFormMode: 'create',
    inventoryCategory_editingItem: null,
  }),

  actions: {
    // NEW helper to set mode + editing item
    setFormMode(mode: 'create' | 'edit', item: IInventoryCategory | null = null) {
      this.inventoryCategoryFormMode = mode;
      this.inventoryCategory_editingItem = item;
    },

    /**
     * @description Usually, we define actions if the action name is different from the state name.
     */
    async inventoryCategoryList_fetchList(
      params: IInventoryCategoryListRequestQuery,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IInventoryCategoryListResponse> {
      this.inventoryCategoryList_isLoading = true;

      try {
        const response = await httpClient.get<IInventoryCategoryListResponse>(INVENTORY_CATEGORY_BASE_ENDPOINT, {
          params,
          ...requestConfigurations,
        });

        this.inventoryCategoryList = response.data;

        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.inventoryCategoryList_isLoading = false;
      }
    },

    async inventoryCategoryList_createCategory(payload: IInventoryCategoryCreateUpdatePayload): Promise<IInventoryCategoryActionResponse> {
      try {
        const response = await httpClient.post<IInventoryCategoryActionResponse>(INVENTORY_CATEGORY_BASE_ENDPOINT, payload);
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async inventoryCategoryList_editCategory(categoryId: string, payload: IInventoryCategoryCreateUpdatePayload): Promise<IInventoryCategoryActionResponse> {
      try {
        const response = await httpClient.put<IInventoryCategoryActionResponse>(`${INVENTORY_CATEGORY_BASE_ENDPOINT}/${categoryId}`, payload);
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async inventoryCategoryList_deleteCategory(categoryId: string): Promise<IInventoryCategoryActionResponse> {
      try {
        const response = await httpClient.delete<IInventoryCategoryActionResponse>(`${INVENTORY_CATEGORY_BASE_ENDPOINT}/${categoryId}`);
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        // Refetch list after delete
        await this.inventoryCategoryList_fetchList({
          page: 1,
          pageSize: 10,
          orderBy: null,
          orderDirection: 'desc',
        }, {
          paramsSerializer: useParamsSerializer,
        });
      }
    },

    /**
     * @description action for import data to API
     */
    async inventoryCategory_generateTemplate(requestConfigurations: AxiosRequestConfig): Promise<void> {
      try {
        const response = await httpClient.post<Blob>(
          `${INVENTORY_CATEGORY_BASE_ENDPOINT}/import/generate-template`,
          requestConfigurations?.data || {},
          {
            ...requestConfigurations,
            responseType: 'blob', // penting untuk file download
          },
        );

        // Buat blob URL untuk download
        const blob = new Blob([response.data], { type: response.data.type });
        const url = window.URL.createObjectURL(blob);

        console.log('Blob URL:', url);

        // Buat link untuk trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'category-template.xlsx';
        document.body.appendChild(a);
        a.click();

        // Bersihkan
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async inventoryCategory_importItems(
      data: FormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IInventoryCategoryImportResponse> {
      this.inventoryCategoryList_isLoading = true;
      try {
        const response = await httpClient.post<IInventoryCategoryImportResponse>(
          `${INVENTORY_CATEGORY_BASE_ENDPOINT}/import/preview`,
          data,
          {
            ...requestConfigurations,
          },
        );

        response.data.data.mergedData = response.data.data.successData.map(
          (item: IInventoryCategoryImport) => {
            return {
              ...item,
              status: 'success',
            };
          },
        );

        response.data.data.mergedData = response.data.data.failedData.map(
          (item: IInventoryCategoryImport) => {
            return {
              ...item,
              status: 'failed',
            };
          },
        );

        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.inventoryCategoryList_isLoading = false;
      }
    },

    async inventoryCategory_Import_reset(batchId: string) {
      try {
        const response = await httpClient.delete<IInventoryCategoryActionResponse>(
          `${INVENTORY_CATEGORY_BASE_ENDPOINT}/import/batch/${batchId}`,
        );
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async inventoryCategory_Import_execute(
      batchId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IInventoryCategoryImportResponse> {
      try {
        const response = await httpClient.post<IInventoryCategoryImportResponse>(
          `${INVENTORY_CATEGORY_BASE_ENDPOINT}/import/execute`,
          {
            batchId,
          },
          {
            ...requestConfigurations,
          },
        );
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});
