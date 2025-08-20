// Constants
import { CASH_IN_OUT_BASE_ENDPOINT } from '../constants';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type { ICashInOutListRequestQuery, ICashInOutListResponse, ICashInOutStateStore } from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';

export const useCashInOutStore = defineStore('cash-in-out', {
  state: (): ICashInOutStateStore => ({
    cashInOut_isLoading: false,
    cashInOut_list: {
      items: [],
      meta: {
        currentPage: 1,
        perPage: 10,
        total: 1,
        totalPages: 1,
      },
    },
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {
    /**
     * @description Handle fetch api cash in out - list
     * @url /cash-in-out/list
     * @method GET
     * @access private
     */
    async fetchCashInOut_list(
      params: ICashInOutListRequestQuery,
      requestConfigurations?: AxiosRequestConfig,
    ): Promise<ICashInOutListResponse> {
      this.cashInOut_isLoading = true;
      try {
        const response = await httpClient.get<ICashInOutListResponse>(CASH_IN_OUT_BASE_ENDPOINT, {
          params,
          ...requestConfigurations,
        });

        this.cashInOut_list = {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items: response.data.data.items as any[],
          meta: response.data.data.meta,
        };

        return response.data;
      } catch (error) {
        console.error('Error fetching cash in out list:', error);
        throw error;
      } finally {
        this.cashInOut_isLoading = false;
      }
    },
  },
});
