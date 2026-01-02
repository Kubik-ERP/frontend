// Constants
import { ATTENDANCE_BASE_ENDPOINT } from '../constants/attendance-api.constant';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type { IAttendanceCreatePayload, IAttendanceListFormData, IAttendanceListResponse, IAttendanceStateStore } from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';

export const useAttendanceStore = defineStore('attendance', {
  state: (): IAttendanceStateStore => ({
    attendance_detail: null,
    attendance_isLoading: false,
    attendance_lists: [],
    attendance_meta: null,
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
    async attendance_create(
      payload: IAttendanceListFormData | IAttendanceCreatePayload,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.attendance_isLoading = true;

      try {
        const response = await httpClient.post<unknown>(ATTENDANCE_BASE_ENDPOINT, payload, {
          ...requestConfigurations,
        });

        this.attendance_isLoading = false;

        return Promise.resolve(response.data);
      } catch (error) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.attendance_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api attendance - delete
     * @url /attendance/{id}
     * @method DELETE
     * @access private
     */
    async attendance_delete(attendanceId: string, requestConfigurations: AxiosRequestConfig): Promise<unknown> {
      this.attendance_isLoading = true;

      try {
        const response = await httpClient.delete<unknown>(`${ATTENDANCE_BASE_ENDPOINT}/${attendanceId}`, {
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
        this.attendance_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api attendance - detail
     * @url /attendance/{id}
     * @method GET
     * @access private
     */
    async attendance_detail(attendanceId: string, requestConfigurations: AxiosRequestConfig): Promise<unknown> {
      this.attendance_isLoading = true;

      try {
        const response = await httpClient.get<unknown>(`${ATTENDANCE_BASE_ENDPOINT}/${attendanceId}`, {
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
        this.attendance_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api attendance - list
     * @url /attendance
     * @method GET
     * @access private
     */
    async attendance_list(requestConfigurations: AxiosRequestConfig): Promise<IAttendanceListResponse> {
      this.attendance_isLoading = true;

      try {
        const response = await httpClient.get<IAttendanceListResponse>(ATTENDANCE_BASE_ENDPOINT, {
          ...requestConfigurations,
        });

        if (Array.isArray(response.data.data.items)) {
          this.attendance_lists = response.data.data.items;
          const apiMeta = response.data.data.meta;
          this.attendance_meta = {
            total: apiMeta.total,
            perPage: apiMeta.pageSize,
            currentPage: apiMeta.page,
            lastPage: apiMeta.totalPages,
          };
        }

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.attendance_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api attendance - update
     * @url /attendance/{id}
     * @method PUT
     * @access private
     */
    async attendance_update(
      attendanceId: string,
      payload: IAttendanceListFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.attendance_isLoading = true;

      try {
        const response = await httpClient.put<unknown>(`${ATTENDANCE_BASE_ENDPOINT}/${attendanceId}`, payload, {
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
        this.attendance_isLoading = false;
      }
    },
  },
});
