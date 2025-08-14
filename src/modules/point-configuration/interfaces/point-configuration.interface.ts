import type { Validation } from '@vuelidate/core';

export interface ILoyaltyPointSettings {
  id: string;
  spendBased: boolean;
  minimumTransaction: number;
  pointsPerTransaction: number;
  spendBasedPointsExpiryDays: number;
  spendBasedPointsApplyMultiple: boolean;
  spendBasedGetPointsOnRedemption: boolean;
  productBased: boolean;
  productBasedPointsExpiryDays: number;
  productBasedPointsApplyMultiple: boolean;
  productBasedGetPointsOnRedemption: boolean;
  createdAt: string;
  updatedAt: string;
  storesId: string;
}

export interface ILoyaltyPointSettingsProductList {
  data: ILoyaltyPointSettingsProductItem[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ILoyaltyPointSettingsProductItem {
  id: string;
  loyaltyPointSettingId: string;
  productId: string;
  points: number;
  minimumTransaction: number;
  createdAt: string;
  updatedAt: string;
}

export interface IQueryParams {
  page?: number | null;
  pageSize?: number | null;
  search?: string | null;
}

export interface IProductBasedItems {
  productId: string;
  pointsEarned: number;
  minimumPurchase: number;
}

export interface ILoyaltyPointSettingsFormData {
  spendBased: boolean;
  spendBasedMinTransaction: number;
  spendBasedPointEarned: number;
  spendBasedExpiration: number;
  spendBasedApplyMultiple: boolean;
  spendBasedEarnWhenRedeem: boolean;
  productBased: boolean;
  productBasedItems: IProductBasedItems[];
  productBasedExpiration: number;
  productBasedApplyMultiple: boolean;
  productBasedEarnWhenRedeem: boolean;
}

export interface ILoyaltyPointSettingsProvided {
  pointConfiguration_activeTab: globalThis.Ref<string>;
  pointConfiguration_listTabs: ITabs[];
  loyaltyPointSettingsProduct_isLoading: Ref<boolean>;
  loyaltyPointSettingsProduct_value: Ref<ILoyaltyPointSettingsProductList>;
  loyaltyPointSettings_isLoading: Ref<boolean>;
  loyaltyPointSettings_value: Ref<ILoyaltyPointSettings | null>;
  loyaltyPointSettingsDetail: () => Promise<void>;
  loyaltyPointSettingsProduct: () => Promise<void>;
  loyaltyPointSettingsProduct_columns: IColumnDataTable[];
  loyaltyPointSettingsProduct_onChangePage: (page: number) => void;
  // form
  loyaltyPointSettings_formData: ILoyaltyPointSettingsFormData;
  loyaltyPointSettings_formValidations: globalThis.Ref<Validation>;
  loyaltyPointSettings_onSubmit: () => Promise<void>;
}
