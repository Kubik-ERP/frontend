import { AxiosRequestConfig } from "axios";
import { IStorageLocation, IStorageLocationActionResponse, IStorageLocationListResponse, IStorageLocationPayload } from "../interfaces";
import { IStorageLocationListRequestQuery } from "../interfaces/storage-location-list.interface";
import httpClient from "@/plugins/axios";
import { STORAGE_LOCATION_API_BASE_ENDPOINT } from "../contants";
import { IStorageLocationImportFailedSuccessData, IStorageLocationImportResponse } from "../interfaces/storage-location-import.interface";

export const useStorageLocationStore = defineStore('storageLocation', {
  state: () => ({
    storageLocation_isLoading: false,
    storageLocation_lists: {
      statusCode: 200,
      message: '',
      data: {
        items: [] as IStorageLocation[],
        meta: {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 1,
        },
      },
    } as IStorageLocationListResponse,
    storageLocationFormMode: 'create' as 'create' | 'edit',
    storageLocation_editingItem: null as IStorageLocation | null,
  }),

  actions: {
    setFormMode(mode: 'create' | 'edit', item: IStorageLocation | null = null) {
      this.storageLocationFormMode = mode;
      this.storageLocation_editingItem = item;
    },

    async storageLocation_fetchListData(
      params: IStorageLocationListRequestQuery,
      requestConfigurations: AxiosRequestConfig
    ): Promise<IStorageLocationListResponse> {
      this.storageLocation_isLoading = true;
      try {
        const response = await httpClient.get<IStorageLocationListResponse>(STORAGE_LOCATION_API_BASE_ENDPOINT, {
          params,
          ...requestConfigurations,
        });
        this.storageLocation_lists = response.data;
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.storageLocation_isLoading = false;
      }
    },

    async storageLocation_createStorageLocation(payload: IStorageLocationPayload): Promise<IStorageLocationActionResponse> {
      this.storageLocation_isLoading = true;
      try {
        const response = await httpClient.post<IStorageLocationActionResponse>(STORAGE_LOCATION_API_BASE_ENDPOINT, payload);
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.storageLocation_isLoading = false;
      }
    },

    async storageLocation_editStorageLocation(storageLocationId: string, payload: IStorageLocationPayload): Promise<IStorageLocationActionResponse> {
      this.storageLocation_isLoading = true;
      try {
        const response = await httpClient.put<IStorageLocationActionResponse>(`${STORAGE_LOCATION_API_BASE_ENDPOINT}/${storageLocationId}`, payload);
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.storageLocation_isLoading = false;
      }
    },

    async storageLocation_deleteStorageLocation(storageLocationId: string): Promise<IStorageLocationActionResponse> {
      this.storageLocation_isLoading = true;
      try {
        const response = await httpClient.delete<IStorageLocationActionResponse>(`${STORAGE_LOCATION_API_BASE_ENDPOINT}/${storageLocationId}`);
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.storageLocation_isLoading = false;
      }
    },

     async storageLocation_generateTemplate(requestConfigurations: AxiosRequestConfig): Promise<void> {
      try {
        const response = await httpClient.post<Blob>(
          `${STORAGE_LOCATION_API_BASE_ENDPOINT}/import/generate-template`,
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
        a.download = 'storageLocation-template.xlsx';
        document.body.appendChild(a);
        a.click();

        // Bersihkan
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async storageLocation_importItems(
      data: FormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IStorageLocationImportResponse> {
      this.storageLocation_isLoading = true;
      try {
        const response = await httpClient.post<IStorageLocationImportResponse>(
          `${STORAGE_LOCATION_API_BASE_ENDPOINT}/import/preview-data`,
          data,
          {
            ...requestConfigurations,
          },
        );

        response.data.data.mergedData = response.data.data.successData.map(
          (item: IStorageLocationImportFailedSuccessData) => {
            return {
              ...item,
              status: 'success',
            };
          },
        );

        response.data.data.mergedData = response.data.data.failedData.map(
          (item: IStorageLocationImportFailedSuccessData) => {
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
        this.storageLocation_isLoading = false;
      }
    },

    async storageLocationImport_reset(batchId: string) {
      try {
        const response = await httpClient.delete<IStorageLocationActionResponse>(
          `${STORAGE_LOCATION_API_BASE_ENDPOINT}/import/batch`,
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

    async storageLocationImport_execute(
      batchId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IStorageLocationActionResponse> {
      try {
        const response = await httpClient.post<IStorageLocationActionResponse>(
          `${STORAGE_LOCATION_API_BASE_ENDPOINT}/import/execute`,
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
