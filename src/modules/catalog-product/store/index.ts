import httpClient from "@/plugins/axios";
import { PRODUCT_API_BASE_ENDPOINT } from "../constants";
import { AxiosRequestConfig } from "axios";
import { IProductActionResponse, IProductImportFailedSuccessData, IProductImportResponse } from "../interfaces/product-import.interface";

export const useProductImportStore = defineStore('product-import', {
  actions: {
    async product_generateTemplate(requestConfigurations: AxiosRequestConfig): Promise<void> {
      try {
        const response = await httpClient.post<Blob>(
          `${PRODUCT_API_BASE_ENDPOINT}/import/generate-template`,
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
        a.download = 'product-template.xlsx';
        document.body.appendChild(a);
        a.click();

        // Bersihkan
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async product_importItems(
      data: FormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IProductImportResponse> {
      try {
        const response = await httpClient.post<IProductImportResponse>(
          `${PRODUCT_API_BASE_ENDPOINT}/import/preview-data`,
          data,
          {
            ...requestConfigurations,
          },
        );

        response.data.data.mergedData = response.data.data.successData.map(
          (item: IProductImportFailedSuccessData) => {
            return {
              ...item,
              status: 'success',
            };
          },
        );

        response.data.data.mergedData = response.data.data.failedData.map(
          (item: IProductImportFailedSuccessData) => {
            return {
              ...item,
              status: 'failed',
            };
          },
        );

        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async product_Import_reset(batchId: string) {
      try {
        const response = await httpClient.delete<IProductActionResponse>(
          `${PRODUCT_API_BASE_ENDPOINT}/import/batch`,
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

    async product_Import_execute(
      batchId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IProductActionResponse> {
      try {
        const response = await httpClient.post<IProductActionResponse>(
          `${PRODUCT_API_BASE_ENDPOINT}/import/execute`,
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
