import httpClient from "@/plugins/axios";
import { CATALOG_CATEGORIES_BASE_ENDPOINT } from "../constants/catalog-api.constant";
import { ICategoryActionResponse, ICategoryImportFailedSuccessData, ICategoryImportResponse } from "../interfaces/Category/category-import.interface";
import { AxiosRequestConfig } from "axios";

export const useCategoryImportStore = defineStore('category-import', {
  actions: {
    async category_generateTemplate(requestConfigurations: AxiosRequestConfig): Promise<void> {
      try {
        const response = await httpClient.post<Blob>(
          `${CATALOG_CATEGORIES_BASE_ENDPOINT}/import/generate-template`,
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

    async category_importItems(
      data: FormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<ICategoryImportResponse> {
      try {
        const response = await httpClient.post<ICategoryImportResponse>(
          `${CATALOG_CATEGORIES_BASE_ENDPOINT}/import/preview-data`,
          data,
          {
            ...requestConfigurations,
          },
        );

        response.data.data.mergedData = response.data.data.successData.map((item: ICategoryImportFailedSuccessData) => {
          return {
            ...item,
            status: 'success',
          };
        });

        response.data.data.mergedData = response.data.data.failedData.map((item: ICategoryImportFailedSuccessData) => {
          return {
            ...item,
            status: 'failed',
          };
        });

        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async category_Import_reset(batchId: string) {
      try {
        const response = await httpClient.delete<ICategoryActionResponse>(
          `${CATALOG_CATEGORIES_BASE_ENDPOINT}/import/batch`,
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

    async category_Import_execute(
      batchId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<ICategoryActionResponse> {
      try {
        const response = await httpClient.post<ICategoryActionResponse>(
          `${CATALOG_CATEGORIES_BASE_ENDPOINT}/import/execute`,
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
