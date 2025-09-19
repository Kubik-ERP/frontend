// Constants
import { INTEGRATION_BASE_ENDPOINT } from '../constants/integration-api.constant';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type { IIntegrationResponse, IIntegrationStateStore } from '../interfaces/integration.interface';

// Plugins
import httpClient from '@/plugins/axios';

export const useIntegrationStore = defineStore('integration', {
  state: (): IIntegrationStateStore => ({
    integration_isLoading: false,
    integration_data: null,
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {
    /**
     * @description Handle fetch api integration - get integration data
     * @url /integrations
     * @method GET
     * @access private
     */
    async fetchIntegration_getIntegration(
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<IIntegrationResponse> {
      this.integration_isLoading = true;

      try {
        const response = await httpClient.get<IIntegrationResponse>(INTEGRATION_BASE_ENDPOINT, {
          ...requestConfigurations,
        });

        if (response.data.data) {
          this.integration_data = response.data.data;
        }

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.integration_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api integration - update integration
     * @url /integrations/:id
     * @method PATCH
     * @access private
     */
    async fetchIntegration_updateIntegration(
      id: string,
      payload: FormData,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<unknown> {
      this.integration_isLoading = true;

      try {
        const response = await httpClient.patch<unknown>(`${INTEGRATION_BASE_ENDPOINT}/${id}`, payload, {
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
        this.integration_isLoading = false;
      }
    },
  },
});
