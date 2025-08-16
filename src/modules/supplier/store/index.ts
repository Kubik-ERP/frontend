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
} from '../interfaces';
import type { ISupplierListRequestQuery } from '../interfaces/supplier-list.interface';

// Plugins
import httpClient from '@/plugins/axios';

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
    supplier_supplierDetail: null,
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
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
  },
});
