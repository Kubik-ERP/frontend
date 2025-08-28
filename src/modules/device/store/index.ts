import httpClient from '@/plugins/axios';
import {
  IDevice,
  IDeviceActionResponse,
  IDeviceListRequestQuery,
  IDeviceListResponse,
  IDevicePayload,
} from '../interfaces';
import { DEVICE_API_BASE_ENDPOINT, DEVICE_FAKE_DATA } from '../constans/index.constant';
import { AxiosRequestConfig } from 'axios';

export const useDeviceStore = defineStore('device', {
  state: () => ({
    deviceList_loading: false,
    deviceList_values: {
      statusCode: 200,
      message: '',
      data: {
        items: DEVICE_FAKE_DATA || ([] as IDevice[]),
        meta: {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 1,
        },
      },
    } as IDeviceListResponse,
    deviceList_formMode: 'create',
    deviceList_editingItem: null as IDevice | null,
    deviceList_actionResponse: {
      statusCode: 200,
      message: '',
      data: {
        id: '',
        name: '',
        code: '',
        status: '',
        lastConnectedAt: '',
      } as IDevice,
    },
  }),

  actions: {
    setFormMode(mode: 'create' | 'edit', item: IDevice | null = null) {
      this.deviceList_formMode = mode;
      this.deviceList_editingItem = item ?? null;
    },

    /**
     * @description : fetch data from API
     */
    async deviceList_fetchData(
      params: IDeviceListRequestQuery,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IDeviceListResponse> {
      this.deviceList_loading = true;
      try {
        const response = await httpClient.get<IDeviceListResponse>(DEVICE_API_BASE_ENDPOINT, {
          params,
          ...requestConfigurations,
        });
        this.deviceList_values = response.data;
        return Promise.resolve(response.data);
      } catch (error) {
        console.log(error);
        return Promise.reject(error); // Add this line to return a rejected promise
      } finally {
        this.deviceList_loading = false;
      }
    },

    /**
     * @description : create data to API
     */
    async deviceList_createData(
      payload: IDevicePayload,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IDeviceActionResponse> {
      try {
        console.log('payload', requestConfigurations);
        return this.deviceList_actionResponse = {
          statusCode: 200,
          message: 'created data susccessfully',
          data: {
            id: '1',
            name: payload!.name,
            code: 'YASBSA',
            status: 'pending',
            lastConnectedAt: '2023-01-01T00:00:00Z',
          },
        };
        // const response = await httpClient.post<IDeviceActionResponse>(DEVICE_API_BASE_ENDPOINT, payload, {
        //   ...requestConfigurations,
        // });
        // return Promise.resolve(response.data);
      } catch (error) {
        console.log(error);
        return Promise.reject(error); // Add this line to return a rejected promise
      }
    },

    /**
     * @description : update data to API
     */
    async deviceList_updateData(
      id: string,
      payload: IDevicePayload,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IDeviceActionResponse> {
      try {
        const response = await httpClient.patch<IDeviceActionResponse>(
          `${DEVICE_API_BASE_ENDPOINT}/${id}`,
          payload,
          {
            ...requestConfigurations,
          },
        );
        return Promise.resolve(response.data);
      } catch (error) {
        console.log(error);
        return Promise.reject(error);
      }
    },

    /**
     * @description : delete data to API
     */
    async deviceList_deleteData(
      id: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IDeviceActionResponse> {
      try {
        const response = await httpClient.delete<IDeviceActionResponse>(`${DEVICE_API_BASE_ENDPOINT}/${id}`, {
          ...requestConfigurations,
        });
        return Promise.resolve(response.data);
      } catch (error) {
        console.log(error);
        return Promise.reject(error);
      }
    },
  },
});
