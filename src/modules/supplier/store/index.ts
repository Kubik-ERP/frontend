// Constants
import { SUPPLIER_BASE_ENDPOINT } from '../constants';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type {
  ISupplierStateStore,
  ISupplierListResponse,
  ISupplierDetailResponse,
  ISupplierCreatePayload,
  ISupplierUpdatePayload,
  ISupplierItemListResponse,
} from '../interfaces';
import type {
  ISupplierItemListRequestQuery,
  ISupplierListRequestQuery,
} from '../interfaces/supplier-list.interface';

// Plugins
import httpClient from '@/plugins/axios';
import { ISupplierActionResponse, ISupplierImport, ISupplierImportResponse } from '../interfaces/supplier-import.interface';

export const useSupplierStore = defineStore('supplier', {
  state: (): ISupplierStateStore => ({
    supplier_isLoading: false,
    supplier_supplierLists: {
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
    supplier_itemLists: {
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
    supplier_supplierDetail: null,
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
    supplier_listItemsOnDropdown: (state): IDropdownItem[] => {
      return state.supplier_supplierLists.data.items.map(item => ({
        value: item.id,
        label: item.supplierName,
      }));
    },
  },
  actions: {
    /**
     * @description Handle fetch api suppliers - get suppliers list
     * @url /suppliers
     * @method GET
     * @access private
     */
    async supplier_list(
      params: ISupplierListRequestQuery,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<ISupplierListResponse> {
      this.supplier_isLoading = true;

      try {
        const response = await httpClient.get<ISupplierListResponse>(SUPPLIER_BASE_ENDPOINT, {
          params,
          ...requestConfigurations,
        });

        // Response.data sudah berisi struktur lengkap { statusCode, message, data: { items, meta } }
        this.supplier_supplierLists = response.data;

        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.supplier_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api supplier - get supplier by ID
     * @url /suppliers/:id
     * @method GET
     * @access private
     */
    async supplier_getById(
      supplierId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<ISupplierDetailResponse> {
      this.supplier_isLoading = true;

      try {
        const response = await httpClient.get<ISupplierDetailResponse>(`${SUPPLIER_BASE_ENDPOINT}/${supplierId}`, {
          ...requestConfigurations,
        });

        this.supplier_supplierDetail = response.data;

        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.supplier_isLoading = false;
      }
    },

    /**
     * @description Handle create supplier
     * @url /suppliers
     * @method POST
     * @access private
     */
    async supplier_create(
      payload: ISupplierCreatePayload,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<ISupplierDetailResponse> {
      this.supplier_isLoading = true;

      try {
        const response = await httpClient.post<ISupplierDetailResponse>(SUPPLIER_BASE_ENDPOINT, payload, {
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.supplier_isLoading = false;
      }
    },

    /**
     * @description Handle update supplier
     * @url /suppliers/:id
     * @method PUT
     * @access private
     */
    async supplier_update(
      supplierId: string,
      payload: ISupplierUpdatePayload,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<ISupplierDetailResponse> {
      this.supplier_isLoading = true;

      try {
        const response = await httpClient.put<ISupplierDetailResponse>(
          `${SUPPLIER_BASE_ENDPOINT}/${supplierId}`,
          payload,
          {
            ...requestConfigurations,
          },
        );

        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.supplier_isLoading = false;
      }
    },

    /**
     * @description Handle delete supplier
     * @url /suppliers/:id
     * @method DELETE
     * @access private
     */
    async supplier_delete(supplierId: string, requestConfigurations: AxiosRequestConfig): Promise<void> {
      this.supplier_isLoading = true;

      try {
        await httpClient.delete(`${SUPPLIER_BASE_ENDPOINT}/${supplierId}`, {
          ...requestConfigurations,
        });

        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.supplier_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api items - get supplier by ID
     * @url /suppliers/:id
     * @method GET
     * @access private
     */
    async supplier_getItems(
      supplierId: string,
      params: ISupplierItemListRequestQuery,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<ISupplierItemListResponse> {
      this.supplier_isLoading = true;

      try {
        const response = await httpClient.get<ISupplierItemListResponse>(
          `${SUPPLIER_BASE_ENDPOINT}/${supplierId}/item-supplies`,
          {
            params,
            ...requestConfigurations,
          },
        );

        this.supplier_itemLists = response.data;

        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.supplier_isLoading = false;
      }
    },

    async Supplier_generateTemplate(requestConfigurations: AxiosRequestConfig): Promise<void> {
      try {
        const response = await httpClient.post<Blob>(
          `${SUPPLIER_BASE_ENDPOINT}/import/generate-template`,
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
        a.download = 'Supplier-template.xlsx';
        document.body.appendChild(a);
        a.click();

        // Bersihkan
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async Supplier_importItems(
      data: FormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<ISupplierImportResponse> {
      this.supplier_isLoading = true;
      try {
        const response = await httpClient.post<ISupplierImportResponse>(
          `${SUPPLIER_BASE_ENDPOINT}/import/preview-data`,
          data,
          {
            ...requestConfigurations,
          },
        );

        response.data.data.mergedData = response.data.data.successData.map(
          (item: ISupplierImport) => {
            return {
              ...item,
              status: 'success',
            };
          },
        );

        response.data.data.mergedData = response.data.data.failedData.map(
          (item: ISupplierImport) => {
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
        this.supplier_isLoading = false;
      }
    },

    async SupplierImport_reset(batchId: string) {
      try {
        const response = await httpClient.delete<ISupplierActionResponse>(
          `${SUPPLIER_BASE_ENDPOINT}/import/batch`,
          {
            data: {
              batchId,
            },
          },
        );
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async SupplierImport_execute(
      batchId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<ISupplierActionResponse> {
      try {
        const response = await httpClient.post<ISupplierActionResponse>(
          `${SUPPLIER_BASE_ENDPOINT}/import/execute`,
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
