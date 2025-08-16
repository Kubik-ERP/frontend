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
  products: { name: string; categories: string; price: number; discountPrice: number };
}

export interface IQueryParams {
  page?: number | null;
  pageSize?: number | null;
  search?: string | null;
}

export interface IProductBasedItems {
  productId?: string | null;
  name?: string| null;
  price?: number| null;
  pointsEarned?: number | null;
  minimumPurchase?: number | null;
}

export interface ILoyaltyPointSettingsFormData {
  productId?: string | null;
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

export interface ILoyaltyPointSettingsAllProductList {
  products: { name: string; price: number; discountPrice: number }[];
  total: number;
  page: number;
  lastPage: number;
}

export interface ILoyaltyPointSettingsAllProductListQueryParams {
  page: number;
  limit: number;
  search?: string | null;
}

export interface ISelectedProducts {
  id?: string | null;
  name?: string | null;
  price?: number | null;
  isSelected?: boolean | null;
  productId?: string| null;
  pointsEarned?: number| null;
  minimumPurchase?: number| null;
}

export interface IProductWithSelection extends ILoyaltyPointSettingsAllProductList {
  id?: string;
  isSelected?: boolean;
  points_earned?: number;
  minimum_purchase?: number;
  name?: string;
  price?: number;
  discountPrice?: number;
}

export interface IProduct {
  productId?: string | null;
  id: string;
  name: string;
  price: number;
  discountPrice: number;
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
  // dialog
  loyaltyPointSettings_onShowDialog: () => void;
  loyaltyPointSettings_onCloseDialog: () => void;
  loyaltyPointSettings_columns: IColumnDataTable[];
  loyaltyPointSettings_fetchAllProduct: () => Promise<void>;
  loyaltyPointSettings_allProductList: Ref<ILoyaltyPointSettingsAllProductList>;
  allProductList_isLoading: Ref<boolean>;
  loyaltyPointSettingAllProductQueryParams: ILoyaltyPointSettingsAllProductListQueryParams;
  loyaltyPointSettingsAllProduct_onChangePage: (page: number) => void;
  selectedProducts: Ref<ISelectedProducts[]>;
  loyaltyPointSettings_onSubmitDialog: () => void;
  loyaltyPointSettings_onShowDialogEditProduct: (product: IProduct) => void;
  loyaltyPointSettings_onCloseDialogEditProduct: () => void;
  // loyaltyPointSettings_toggleSelection: (product: IProductWithSelection) => void;
  isProductSelected: (product: IProduct) => boolean;
  getSelectedProductData: (product: IProduct) => ISelectedProducts | undefined;
  loyaltyPointSettings_toggleSelection: (product: IProduct) => void;
  loyaltyPointSettings_updateProductValue: (
    product: IProduct,
    field: 'pointsEarned' | 'minimumPurchase',
    newValue: number,
  ) => void;
  loyaltyPointSettings_EditProduct: Ref<IProduct[] | null>;
  loyaltyPointSettings_onSubmitDialogEditProduct: () => void;
}
