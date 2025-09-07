import { AxiosRequestConfig } from "axios";
import { defineStore } from "pinia";
import { IBrand, IBrandActionResponse, IBrandCreateUpdatePayload, IBrandListResponse } from "../interfaces";
import { IBrandListRequestQuery } from "../interfaces/brand-list.interface";
import httpClient from "@/plugins/axios";
import { BRAND_API_BASE_ENDPOINT } from "../constants";
import { brand_importFailedSuccessData, IBrandImportResponse } from "../interfaces/brand-import.interface";

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
      }
    },

    async brand_generateTemplate(requestConfigurations: AxiosRequestConfig): Promise<void> {
      try {
        const response = await httpClient.post<Blob>(
          `${BRAND_API_BASE_ENDPOINT}/import/generate-template`,
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
        a.download = 'brand-template.xlsx';
        document.body.appendChild(a);
        a.click();

        // Bersihkan
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async brand_importItems(
      data: FormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IBrandImportResponse> {
      this.brandList_isLoading = true;
      try {
        const response = await httpClient.post<IBrandImportResponse>(
          `${BRAND_API_BASE_ENDPOINT}/import/preview-data`,
          data,
          {
            ...requestConfigurations,
          },
        );

        response.data.data.mergedData = response.data.data.successData.map(
          (item: brand_importFailedSuccessData) => {
            return {
              ...item,
              status: 'success',
            };
          },
        );

        response.data.data.mergedData = response.data.data.failedData.map(
          (item: brand_importFailedSuccessData) => {
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
        this.brandList_isLoading = false;
      }
    },

    async brandImport_reset(batchId: string) {
      try {
        const response = await httpClient.delete<IBrandActionResponse>(
          `${BRAND_API_BASE_ENDPOINT}/import/batch`,
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

    async brandImport_execute(
      batchId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IBrandActionResponse> {
      try {
        const response = await httpClient.post<IBrandActionResponse>(
          `${BRAND_API_BASE_ENDPOINT}/import/execute`,
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
  }
});
