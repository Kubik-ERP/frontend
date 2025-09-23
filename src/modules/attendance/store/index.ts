// Constants
import { attendanceList_BASE_ENDPOINT } from '../constants/attendance-api.constant';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type { IAttendanceListFormData, IAttendanceStateStore } from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';

export const useAttendanceStore = defineStore('attendance', {
  state: (): IAttendanceStateStore => ({
    attendanceList_detail: null,
    attendanceList_isLoading: false,
    attendanceList_lists: null,
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {
    /**
     * @description Handle fetch api attendance - create
     * @url /attendance
     * @method POST
     * @access private
     */
    async attendanceList_create(
      payload: IAttendanceListFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.attendanceList_isLoading = true;

      try {
        const response = await httpClient.post<unknown>(attendanceList_BASE_ENDPOINT, payload, {
          ...requestConfigurations,
        });

        this.attendanceList_isLoading = false;

        return Promise.resolve(response.data);
      } catch (error) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.attendanceList_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api attendance - delete
     * @url /attendance/{id}
     * @method DELETE
     * @access private
     */
    async attendanceList_delete(
      attendanceId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.attendanceList_isLoading = true;

      try {
        const response = await httpClient.delete<unknown>(`${attendanceList_BASE_ENDPOINT}/${attendanceId}`, {
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
        this.attendanceList_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api attendance - detail
     * @url /attendance/{id}
     * @method GET
     * @access private
     */
    async attendanceList_detail(
      attendanceId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.attendanceList_isLoading = true;

      try {
        const response = await httpClient.get<unknown>(`${attendanceList_BASE_ENDPOINT}/${attendanceId}`, {
          ...requestConfigurations,
        });

        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.attendanceList_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api attendance - list
     * @url /attendance
     * @method GET
     * @access private
     */
    async attendanceList_list(requestConfigurations: AxiosRequestConfig): Promise<unknown> {
      this.attendanceList_isLoading = true;

      try {
        const response = await httpClient.get<unknown>(attendanceList_BASE_ENDPOINT, {
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
        this.attendanceList_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api attendance - update
     * @url /attendance/{id}
     * @method PUT
     * @access private
     */
    async attendanceList_update(
      attendanceId: string,
      payload: IAttendanceListFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.attendanceList_isLoading = true;

      try {
        const response = await httpClient.put<unknown>(
          `${attendanceList_BASE_ENDPOINT}/${attendanceId}`,
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
        this.attendanceList_isLoading = false;
      }
    },
  },
});
