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
  ILoyaltyPointSettingsFormData,
  ILoyaltyPointSettingsAllProductListQueryParams,
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
          pageSize: 0,
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
        categories: '',
      },
    ],
    loyaltyPointSettings_isLoading: false,
    loyaltyPointSettings_value: {
      id: '',
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
      createdAt: '',
      updatedAt: '',
      storesId: '',
    },
    loyaltyPointSettingsProduct_isLoading: false,
    loyaltyPointSettingsProduct_value: {
      data: [],
      meta: {
        total: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      },
    },
    loyaltyPointSettings_allProductList: {
      products: [],
      page: 1,
      total: 0,
      lastPage: 0,
    },
    allProductList_isLoading: false,
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

    async loyaltyPointBenefit_deleteBenefit(
      id: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.loyaltyPointBenefit_isLoading = true;
      try {
        const response = await httpClient.delete(`${LOYALTY_POINT_BENEFIT_BASE_ENDPOINT}/${id}`, {
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
            categories: (product.categoriesHasProducts as { categories: { id: string; category: string } }[]).map(
              ({ categories }) => categories.category,
            ),
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

    async loyaltyBenefit_deleteFreeItems(id: string, requestConfigurations: AxiosRequestConfig): Promise<unknown> {
      this.loyaltyPointBenefit_isLoading = true;
      try {
        const response = await httpClient.delete(`${LOYALTY_POINT_BENEFIT_BASE_ENDPOINT}/${id}`, {
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
        console.log(this.loyaltyPointSettingsProduct_value);
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

    async loyaltySettings_deleteProductList(
      id: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.productList_isLoading = true;
      try {
        const response = await httpClient.delete(
          `${LOYALTY_POINT_SETTINGS_BASE_ENDPOINT}/${id}`,
          requestConfigurations,
        );
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

    async loyaltySettings_initiate(requestConfigurations: AxiosRequestConfig): Promise<unknown> {
      this.loyaltyPointSettings_isLoading = true;
      try {
        const payload = {
          spend_based: false,
          product_based: true,
        };
        const response = await httpClient.post(
          `${LOYALTY_POINT_SETTINGS_BASE_ENDPOINT}`,
          payload,
          requestConfigurations,
        );
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.loyaltyPointSettings_isLoading = false;
      }
    },

    async loyaltySettings_update(
      payload: ILoyaltyPointSettingsFormData,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.loyaltyPointSettings_isLoading = true;
      try {
        const snakeCasePayload = Object.fromEntries(
          Object.entries(payload).map(([key, value]) => [key.replace(/([A-Z])/g, '_$1').toLowerCase(), value]),
        );
        const formattedPayload = {
          ...snakeCasePayload,
          product_based_items: snakeCasePayload.product_based_items.map(
            (item: { productId: string; pointsEarned: number; minimumPurchase: number }) => ({
              product_id: item.productId,
              points_earned: item.pointsEarned,
              minimum_purchase: item.minimumPurchase,
            }),
          ),
        };
        const response = await httpClient.patch(
          `${LOYALTY_POINT_SETTINGS_BASE_ENDPOINT}/${this.loyaltyPointSettings_value.id}`,
          formattedPayload,
          { ...requestConfigurations },
        );
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.loyaltyPointSettings_isLoading = false;
      }
    },

    async loyaltySettings_fetchAllProductList(
      params: ILoyaltyPointSettingsAllProductListQueryParams,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.allProductList_isLoading = true;
      try {
        const response = await httpClient.get(`/products`, { params, ...requestConfigurations });
        this.loyaltyPointSettings_allProductList = response.data.data;
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.allProductList_isLoading = false;
      }
    },
  },
});
