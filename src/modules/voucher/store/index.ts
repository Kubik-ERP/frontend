import { VOUCHER_BASE_ENDPOINT } from '../constants';

// type
import { AxiosRequestConfig } from 'axios';
import {
  IVoucherListResponse,
  IVoucherStateStore,
  IVoucherListRequestQuery,
  IVoucherCreateRequest,
  IVoucherCreateResponse,
  IVoucherActiveResponse,
} from '../interfaces';

// plugins
import httpClient from '@/plugins/axios';
import { defineStore } from 'pinia';
import { IVoucherViewResponse } from '../interfaces/voucher-view.interface';
import { IVoucherEditRequest, IVoucherEditResponse } from '../interfaces/voucher-edit.interface';

export const useVoucherStore = defineStore('voucher', {
  state(): IVoucherStateStore {
    return {
      voucher_isLoading: false,
      voucher_lists: {
        message: '',
        statusCode: 200,
        data: {
          items: [],
          meta: {
            pageSize: 10,
            page: 1,
            total: 0,
            totalPages: 0,
          },
        },
      },
    };
  },
  actions: {
    /**
     * @description Fetch voucher list
     * @param params - Query parameters for fetching vouchers
     * @returns Promise with IVoucherListResponse
     */
    async voucherList_fetchListVouchers(
      params: IVoucherListRequestQuery,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IVoucherListResponse> {
      this.voucher_isLoading = true;
      try {
        const response = await httpClient.get<IVoucherListResponse>(`${VOUCHER_BASE_ENDPOINT}`, {
          params,
          ...requestConfigurations,
        });

        // console.log('Voucher List Response:', response.data);

        this.voucher_lists.data = response.data.data;

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        return Promise.reject(error instanceof Error ? error : new Error(String(error)));
      } finally {
        this.voucher_isLoading = false;
      }
    },

    /**
     * @description Delete voucher by ID
     */
    async voucherList_deleteVoucher(
      voucherId: string,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<unknown> {
      this.voucher_isLoading = true;
      console.warn('Deleting voucher with ID:', voucherId);
      try {
        const response = await httpClient.delete<unknown>(`${VOUCHER_BASE_ENDPOINT}/${voucherId}`, {
          ...requestConfigurations,
        });

        console.log('Delete Voucher Response:', response.data);

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.voucher_isLoading = false;
      }
    },

    /**
     * @description Create voucher
     * @param voucher - Voucher data to create or update
     * @returns Promise with IVoucherListResponse
     */
    async voucherList_createVoucher(
      voucher: IVoucherCreateRequest,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<IVoucherCreateResponse> {
      this.voucher_isLoading = true;
      try {
        const response = await httpClient.post<IVoucherCreateResponse>(`${VOUCHER_BASE_ENDPOINT}`, voucher, {
          ...requestConfigurations,
        });
        console.log(response.data.message);

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        return Promise.reject(error instanceof Error ? error : new Error(String(error)));
      } finally {
        this.voucher_isLoading = false;
      }
    },

    /**
     * @description Update voucher
     * @param voucherId - ID of the voucher to update
     * @param voucher - Updated voucher data
     * @returns Promise with IVoucherListResponse
     */
    async voucherList_updateVoucher(
      voucherId: string,
      voucher: IVoucherEditRequest,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<IVoucherEditResponse> {
      this.voucher_isLoading = true;
      try {
        const response = await httpClient.put<IVoucherEditResponse>(
          `${VOUCHER_BASE_ENDPOINT}/${voucherId}`,
          voucher,
          {
            ...requestConfigurations,
          },
        );
        console.log('Update Voucher Response:', response.data);
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        return Promise.reject(error instanceof Error ? error : new Error(String(error)));
      } finally {
        this.voucher_isLoading = false;
      }
    },

    /**
     * @description Get voucher by ID
     * @param voucherId - ID of the voucher to fetch
     * @returns Promise with IVoucherViewResponse
     * */
    async voucherList_getVoucherById(
      voucherId: string,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<IVoucherViewResponse> {
      this.voucher_isLoading = true;
      try {
        const response = await httpClient.get<IVoucherViewResponse>(`${VOUCHER_BASE_ENDPOINT}/${voucherId}`, {
          ...requestConfigurations,
        });
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        return Promise.reject(error instanceof Error ? error : new Error(String(error)));
      } finally {
        this.voucher_isLoading = false;
      }
    },

    /**
     * @description get voucher active
     */
    async voucherList_getActiveVoucher(
      search: string,
      productIds: string[],
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<IVoucherActiveResponse> {
      this.voucher_isLoading = true;
      try {
        console.log(search);
        const response = await httpClient.get<IVoucherActiveResponse>(`${VOUCHER_BASE_ENDPOINT}/active`, {
          params: {
            search: search,
            productIds: productIds,
          },
          paramsSerializer: params => {
            const query = new URLSearchParams();

            Object.entries(params).forEach(([key, value]) => {
              if (Array.isArray(value)) {
                value.forEach(v => query.append(key, v));
              } else if (value !== undefined && value !== null) {
                query.append(key, String(value));
              }
            });

            return query.toString();
          },
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        return Promise.reject(error instanceof Error ? error : new Error(String(error)));
      } finally {
        this.voucher_isLoading = false;
      }
    },
  },
});
