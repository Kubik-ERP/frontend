import { AxiosRequestConfig } from "axios";
import { IStorageLocation, IStorageLocationActionResponse, IStorageLocationListResponse, IStorageLocationPayload } from "../interfaces";
import { IStorageLocationListRequestQuery } from "../interfaces/storage-location-list.interface";
import httpClient from "@/plugins/axios";
import { STORAGE_LOCATION_API_BASE_ENDPOINT } from "../contants";

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
  }
});
