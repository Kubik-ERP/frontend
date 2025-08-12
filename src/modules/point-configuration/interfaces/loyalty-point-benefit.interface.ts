import type { Validation } from '@vuelidate/core';

export type IFreeItems = {
  id?: string;
  name: string;
  category?: string;
  quantity: number;
};

export type IDiscount = {
  value: number;
  unit: string;
  isPercent: boolean;
};

export type ILoyaltyPointBenefit = {
  id: string;
  type: string;
  benefitName: string;
  pointNeeds: number;
  discountFreeItems: IDiscount | IFreeItems[];
};

export type IDiscountFormData = {
  id?: string | null;
  name: string;
  pointNeeds: number;
  discountPrice: IDiscount;
};

export type IFreeItemFormData = {
  name: string;
  pointNeeds: number;
  freeItems: IFreeItems[];
};

export interface ILoyaltyPointBenefitProvided {
  loyaltyPointBenefit_columns: IColumnDataTable[];
  dailySalesList_onChangePage: (page: number) => void;

  loyaltyPointBenefit_isLoading: globalThis.Ref<boolean>;

  isEdit: globalThis.Ref<boolean>;

  discountBenefit_formData: IDiscountFormData;
  discountBenefit_formValidations: globalThis.Ref<Validation>;
  loyaltyPointBenefit_onSubmitDialogDiscount: () => Promise<void>;
  loyaltyPointBenefit_onShowDialogDiscount: () => void;
  loyaltyPointBenefit_onShowEditDialogDiscount: (data: ILoyaltyPointBenefit) => void;
  loyaltyPointBenefit_onSubmitEditDialogDiscount: () => Promise<void>;
  loyaltyPointBenefit_onCloseDialogDiscount: () => void;
  loyaltyPointBenefit_fetchList: () => Promise<void>;

  loyaltyPointBenefit_queryParams: IPointConfigurationListRequestQuery;
  loyaltyPointBenefit_list: globalThis.Ref<IPointConfigurationListResponse>;

  freeItemsBenefit_formData: IFreeItemFormData;
  freeItemsBenefit_formValidations: globalThis.Ref<Validation>;
  loyaltyPointBenefit_onSubmitDialogFreeItems: () => Promise<void>;
  loyaltyPointBenefit_onShowEditDialogFreeItems: (data: IFreeItemFormData) => void;
  loyaltyPointBenefit_onShowDialogFreeItems: () => void;
  loyaltyPointBenefit_onCloseDialogFreeItems: () => void;
}

export type IPointConfigurationListRequestQuery = {
  page: number;
  limit: number;
};

export type IPointConfigurationListResponse = {
  loyaltyBenefits: {
    items: ILoyaltyPointBenefit[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  loyaltySettingsStatus: boolean;
  loyaltySettingsId?: string | null;
};

export type IPointConfigurationStore = {
  loyaltyPointBenefit_isLoading: boolean;
  loyaltyPointBenefit_list: IPointConfigurationListResponse;
};
