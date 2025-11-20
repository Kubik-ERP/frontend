// Constants
import { WORKING_HOURS_BASE_ENDPOINT } from '../constants/working-hours-api.constant';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type { IWorkingHoursFormData, IWorkingHoursListResponse, IWorkingHoursStateStore } from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';

export const useWorkingHoursStore = defineStore('working-hours', {
  state: (): IWorkingHoursStateStore => ({
    workingHours_detail: null,
    workingHours_isLoading: false,
    workingHours_lists: [],
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {
    /**
     * @description Handle fetch api working hours - create
     * @url /working-hours
     * @method POST
     * @access private
     */
    async workingHours_create(
      payload: IWorkingHoursFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.workingHours_isLoading = true;

      try {
        const response = await httpClient.post<unknown>(WORKING_HOURS_BASE_ENDPOINT, payload, {
          ...requestConfigurations,
        });

        this.workingHours_isLoading = false;

        return Promise.resolve(response.data);
      } catch (error) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.workingHours_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api working hours - delete
     * @url /working-hours/{id}
     * @method DELETE
     * @access private
     */
    async workingHours_delete(
      workingHoursId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.workingHours_isLoading = true;

      try {
        const response = await httpClient.delete<unknown>(`${WORKING_HOURS_BASE_ENDPOINT}/${workingHoursId}`, {
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
        this.workingHours_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api working hours - detail
     * @url /working-hours/{id}
     * @method GET
     * @access private
     */
    async workingHours_detail(
      workingHoursId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.workingHours_isLoading = true;

      try {
        const response = await httpClient.get<unknown>(`${WORKING_HOURS_BASE_ENDPOINT}/${workingHoursId}`, {
          ...requestConfigurations,
        });

        this.workingHours_isLoading = false;

        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.workingHours_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api working hours - list
     * @url /working-hours
     * @method GET
     * @access private
     */
    async workingHours_list(requestConfigurations: AxiosRequestConfig): Promise<IWorkingHoursListResponse> {
      this.workingHours_isLoading = true;

      try {
        const response = await httpClient.get<IWorkingHoursListResponse>(WORKING_HOURS_BASE_ENDPOINT, {
          ...requestConfigurations,
        });

        if (Array.isArray(response.data.data.items)) {
          this.workingHours_lists = response.data.data.items;
        }

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.workingHours_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api working hours - update
     * @url /working-hours/{id}
     * @method PUT
     * @access private
     */
    async workingHours_update(
      workingHoursId: string,
      payload: IWorkingHoursFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.workingHours_isLoading = true;

      try {
        const response = await httpClient.put<unknown>(
          `${WORKING_HOURS_BASE_ENDPOINT}/${workingHoursId}`,
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
        this.workingHours_isLoading = false;
      }
    },
  },
});
