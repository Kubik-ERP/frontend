// Constants
import { POINT_CONFIGURATION_BASE_ENDPOINT } from '../constants';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type {
  IPointConfigurationStore,
  IPointConfigurationListRequestQuery,
  IPointConfigurationListResponse,
  IProductListRequestQuery,
  IProductListResponse,
  IFreeItemsPayload,
} from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';

export const usePointConfigurationStore = defineStore('point-configuration', {
  state: (): IPointConfigurationStore => ({
    loyaltyPointBenefit_isLoading: false,
    productList_isLoading: false,
    loyaltyPointBenefit_list: {
      loyaltyBenefits: {
        items: [],
        meta: {
          page: 0,
          limit: 0,
          total: 0,
          totalPages: 0,
        },
      },
      loyaltySettingsStatus: false,
      loyaltySettingsId: null,
    },
    loyaltyPointBenefit_productList: [
      {
        id: '',
        name: '',
        category: '',
      },
    ],
  }),
  actions: {
    /**
     * @description Handle fetch api point configuration - list
     * @url /point-benefit
     * @method GET
     * @access private
     */
    async loyaltyPointBenefit_fetchlist(
      params: IPointConfigurationListRequestQuery,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IPointConfigurationListResponse> {
      this.loyaltyPointBenefit_isLoading = true;

      try {
        const response = await httpClient.get(`${POINT_CONFIGURATION_BASE_ENDPOINT}`, {
          params,
          ...requestConfigurations,
        });
        this.loyaltyPointBenefit_list = response.data.data;
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.loyaltyPointBenefit_isLoading = false;
      }
    },
    /**
     * @description Handle fetch api point configuration - list
     * @url /point-benefit
     * @method POST
     * @access private
     */
    async loyaltyPointBenefit_addBenefit(
      payload: {
        benefitType: string;
        benefitName: string;
        pointNeeds: number;
        value: number;
        isPercent: boolean;
      },
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.loyaltyPointBenefit_isLoading = true;
      try {
        const response = await httpClient.post(
          `${POINT_CONFIGURATION_BASE_ENDPOINT}/${this.loyaltyPointBenefit_list.loyaltySettingsId}`,
          payload,
          {
            ...requestConfigurations,
          },
        );
        console.log('🚀 ~ response:', response);
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.loyaltyPointBenefit_isLoading = false;
      }
    },

    async loyaltyPointBenefit_editBenefit(
      payload: {
        id?: string | null;
        benefitType: string;
        benefitName: string;
        pointNeeds: number;
        value: number;
        isPercent: boolean;
      },
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.loyaltyPointBenefit_isLoading = true;
      try {
        const response = await httpClient.patch(`${POINT_CONFIGURATION_BASE_ENDPOINT}/${payload.id}`, payload, {
          ...requestConfigurations,
        });
        console.log('🚀 ~ response:', response);
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.loyaltyPointBenefit_isLoading = false;
      }
    },

    async loyaltyPointBenefit_fetchProductList(
      params: IProductListRequestQuery,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.productList_isLoading = true;
      try {
        const response = await httpClient.get(`/products`, {
          params,
          ...requestConfigurations,
        });
        this.loyaltyPointBenefit_productList = response.data.data.products.map((product: IProductListResponse) => {
          return {
            id: product.id,
            name: product.name,
            category: product.categoriesHasProducts[0].categories.category,
          };
        });

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.productList_isLoading = false;
      }
    },

    async loyaltyBenefit_addFreeItems(
      payload: IFreeItemsPayload,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.loyaltyPointBenefit_isLoading = true;
      try {
        const response = await httpClient.post(
          `${POINT_CONFIGURATION_BASE_ENDPOINT}/${this.loyaltyPointBenefit_list.loyaltySettingsId}`,
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
        this.loyaltyPointBenefit_isLoading = false;
      }
    },

    async loyaltyBenefit_updateFreeItems(
      payload: IFreeItemsPayload,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.loyaltyPointBenefit_isLoading = true;
      try {
        const response = await httpClient.patch(`${POINT_CONFIGURATION_BASE_ENDPOINT}/${payload.id}`, payload, {
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
        this.loyaltyPointBenefit_isLoading = false;
      }
    },
  },
});
