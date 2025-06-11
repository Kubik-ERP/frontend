// Constants
import { CATALOG_CUSTOMERS_BASE_ENDPOINT } from '../constants/catalog-api.constant';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type {
  ICatalogStateStore,
  ICustomerFormData,
  ICustomerRequestQuery,
  ICustomerDetailResponse,
  ICustomerListResponse,
} from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';

export const useCatalogStore = defineStore('catalog', {
  state: (): ICatalogStateStore => ({
    catalog_isLoading: false,
    catalog_customerDetails: null,
    catalog_customerLists: [],
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {
    /**
     * @description Handle fetch api catalog - create customer
     * @url /customers
     * @method POST
     * @access private
     */
    async fetchCatalog_createCustomer(
      payload: ICustomerFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<ICustomerDetailResponse> {
      this.catalog_isLoading = true;

      try {
        const response = await httpClient.post<ICustomerDetailResponse>(CATALOG_CUSTOMERS_BASE_ENDPOINT, payload, {
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
        this.catalog_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api catalog - delete customer
     * @url /customers/:id
     * @method DELETE
     * @access private
     */
    async fetchCatalog_deleteCustomer(id: string, requestConfigurations: AxiosRequestConfig): Promise<void> {
      this.catalog_isLoading = true;

      try {
        await httpClient.delete(`${CATALOG_CUSTOMERS_BASE_ENDPOINT}/${id}`, {
          ...requestConfigurations,
        });

        // Clear customer details after deletion
        this.catalog_customerDetails = null;
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.catalog_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api catalog - detail customer
     * @url /customer/details/:id
     * @method GET
     * @access private
     */
    async fetchCatalog_detailCustomer(
      id: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<ICustomerDetailResponse> {
      this.catalog_isLoading = true;

      try {
        const response = await httpClient.get<ICustomerDetailResponse>(
          `${CATALOG_CUSTOMERS_BASE_ENDPOINT}/${id}`,
          {
            ...requestConfigurations,
          },
        );

        if (response.data.data) {
          this.catalog_customerDetails = response.data.data;
        }

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.catalog_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api catalog - list customers
     * @url /customers?requestQuery=...
     * @method GET
     * @access private
     */
    async fetchCatalog_listCustomers(
      params: ICustomerRequestQuery,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<ICustomerListResponse> {
      this.catalog_isLoading = true;

      try {
        const response = await httpClient.get<ICustomerListResponse>(CATALOG_CUSTOMERS_BASE_ENDPOINT, {
          params,
          ...requestConfigurations,
        });

        if (response.data.data) {
          console.log('Catalog - List Customers:', response.data.data);
          this.catalog_customerLists = response.data.data;
        }

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.catalog_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api catalog - update customer
     * @url /customers/:id
     * @method PATCH
     * @access private
     */
    async fetchCatalog_updateCustomer(
      id: string,
      payload: ICustomerFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<ICustomerDetailResponse> {
      this.catalog_isLoading = true;

      try {
        const response = await httpClient.patch<ICustomerDetailResponse>(
          `${CATALOG_CUSTOMERS_BASE_ENDPOINT}/${id}`,
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
        this.catalog_isLoading = false;
      }
    },
  },
});
