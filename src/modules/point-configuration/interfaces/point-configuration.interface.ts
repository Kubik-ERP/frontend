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
    limit: number;
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
  page?: number|null;
  limit?: number|null;
  search?: string|null;
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
}
