// Constants
import { LOYALTY_POINT_BENEFIT_BASE_ENDPOINT, LOYALTY_POINT_SETTINGS_BASE_ENDPOINT } from '../constants';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type {
  IPointConfigurationStore,
  IPointConfigurationListRequestQuery,
  IPointConfigurationListResponse,
  IProductListRequestQuery,
  IProductListResponse,
  IFreeItemsPayload,
  IQueryParams,
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
    loyaltyPointSettings_isLoading: false,
    loyaltyPointSettings_value: {
      id: '0d53cfaf-70ba-416d-b10d-bb635ab48992',
      spendBased: false,
      minimumTransaction: 0,
      pointsPerTransaction: 0,
      spendBasedPointsExpiryDays: 0,
      spendBasedPointsApplyMultiple: false,
      spendBasedGetPointsOnRedemption: false,
      productBased: false,
      productBasedPointsExpiryDays: 0,
      productBasedPointsApplyMultiple: false,
      productBasedGetPointsOnRedemption: false,
      createdAt: '2025-08-13T17:41:58.554Z',
      updatedAt: '2025-08-13T17:41:58.554Z',
      storesId: '6dea1478-b97c-4245-968a-f2d38a827100',
    },
    loyaltyPointSettingsProduct_isLoading: false,
    loyaltyPointSettingsProduct_value: {
      data: [
        {
          id: '4b3b3439-4172-4daf-95f7-1aaf09854731',
          loyaltyPointSettingId: '5a04e4c7-0f9d-48e3-8e42-3a93b49fa078',
          productId: '7104a185-0d2c-4a64-b7b0-9aa8a4194b4a',
          points: 75,
          minimumTransaction: 1,
          createdAt: '2025-08-13T17:55:24.124Z',
          updatedAt: '2025-08-13T17:55:24.124Z',
        },
        {
          id: 'cb589852-09de-4b7d-9048-6a992ee5b650',
          loyaltyPointSettingId: '5a04e4c7-0f9d-48e3-8e42-3a93b49fa078',
          productId: 'ec5abfb7-ac93-404d-8a11-3f03f24a3cef',
          points: 50,
          minimumTransaction: 2,
          createdAt: '2025-08-13T17:55:24.124Z',
          updatedAt: '2025-08-13T17:55:24.124Z',
        },
      ],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    },
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
        const response = await httpClient.get(`${LOYALTY_POINT_BENEFIT_BASE_ENDPOINT}`, {
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
          `${LOYALTY_POINT_BENEFIT_BASE_ENDPOINT}/${this.loyaltyPointBenefit_list.loyaltySettingsId}`,
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
        const response = await httpClient.patch(`${LOYALTY_POINT_BENEFIT_BASE_ENDPOINT}/${payload.id}`, payload, {
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
          `${LOYALTY_POINT_BENEFIT_BASE_ENDPOINT}/${this.loyaltyPointBenefit_list.loyaltySettingsId}`,
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
        const response = await httpClient.patch(`${LOYALTY_POINT_BENEFIT_BASE_ENDPOINT}/${payload.id}`, payload, {
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

    async loyaltySettings_fetchDetails(requestConfigurations: AxiosRequestConfig): Promise<unknown> {
      this.loyaltyPointBenefit_isLoading = true;
      try {
        const response = await httpClient.get(`${LOYALTY_POINT_SETTINGS_BASE_ENDPOINT}`, requestConfigurations);
        console.log(JSON.stringify(response.data.data.data, null, 2));
        this.loyaltyPointSettings_value = response.data.data.data;
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

    async loyaltySettings_fetchProductList(
      params: IQueryParams,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.productList_isLoading = true;
      try {
        const response = await httpClient.get(
          `${LOYALTY_POINT_SETTINGS_BASE_ENDPOINT}/${this.loyaltyPointSettings_value.id}/product`,
          {
            params,
            ...requestConfigurations,
          },
        );
        this.loyaltyPointSettingsProduct_value = response.data.data;
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
  },
});
