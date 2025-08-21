import { AxiosRequestConfig } from "axios";
import { defineStore } from "pinia";
import { IBrand, IBrandActionResponse, IBrandCreateUpdatePayload, IBrandListResponse } from "../interfaces";
import { IBrandListRequestQuery } from "../interfaces/brand-list.interface";
import httpClient from "@/plugins/axios";
import { BRAND_API_BASE_ENDPOINT } from "../constants";

export const useBrandStore = defineStore('brand', {
  state: () => ({
    brandList_isLoading: false,
    brandList: {
      statusCode: 200,
      message: '',
      data: {
        items: [] as IBrand[],
        meta: {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 1,
        },
      },
    } as IBrandListResponse,

    // ✅ Tambahan untuk kontrol modal
    brandFormMode: 'create' as 'create' | 'edit',
    brand_editingItem: null as IBrand | null,
  }),

  actions: {
    setFormMode(mode: 'create' | 'edit', item: IBrand | null = null) {
      this.brandFormMode = mode;
      this.brand_editingItem = item;
    },

    async brandList_fetchList(
      params: IBrandListRequestQuery,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IBrandListResponse> {
      this.brandList_isLoading = true;
      try {
        const response = await httpClient.get(BRAND_API_BASE_ENDPOINT, {
          params,
          ...requestConfigurations,
        });
        this.brandList = response.data;
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.brandList_isLoading = false;
      }
    },

    async brandList_createBrand(
      payload: IBrandCreateUpdatePayload
    ): Promise<IBrandActionResponse> {
      this.brandList_isLoading = true;
      try {
        const response = await httpClient.post<IBrandActionResponse>(BRAND_API_BASE_ENDPOINT, payload);
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.brandList_isLoading = false;
      }
    },

    async brandList_editBrand(
      brandId: string,
      payload: IBrandCreateUpdatePayload
    ): Promise<IBrandActionResponse> {
      this.brandList_isLoading = true;
      try {
        const response = await httpClient.put<IBrandActionResponse>(`${BRAND_API_BASE_ENDPOINT}/${brandId}`, payload);
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.brandList_isLoading = false;
      }
    },

    async brandList_deleteBrand(
      brandId: string
    ): Promise<IBrandActionResponse> {
      this.brandList_isLoading = true;
      try {
        const response = await httpClient.delete<IBrandActionResponse>(`${BRAND_API_BASE_ENDPOINT}/${brandId}`);
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.brandList_isLoading = false;
        await this.brandList_fetchList({
          page: 1,
          pageSize: 10,
          orderBy: null,
          orderDirection: 'desc',
        }, {});
      }
    }
  }
});
