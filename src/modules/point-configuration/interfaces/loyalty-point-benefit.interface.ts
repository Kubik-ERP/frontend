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
  type: string;
  benefitName: string;
  pointNeeds: number;
  discountFreeItems: IDiscount | IFreeItems[];
};

export type IDiscountFormData = {
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
  loyaltyPointBenefit_values: ILoyaltyPointBenefit[];
  loyaltyPointBenefit_columns: IColumnDataTable[];
  dailySalesList_onChangePage: () => void;

  discountBenefit_formData: IDiscountFormData;
  discountBenefit_formValidations: globalThis.Ref<Validation>;
  loyaltyPointBenefit_onSubmitDialogDiscount: () => Promise<void>;
  loyaltyPointBenefit_onShowDialogDiscount: () => void;
  loyaltyPointBenefit_onCloseDialogDiscount: () => void;
  
  freeItemsBenefit_formData: IFreeItemFormData;
  freeItemsBenefit_formValidations: globalThis.Ref<Validation>;
  loyaltyPointBenefit_onSubmitDialogFreeItems: () => Promise<void>;
  loyaltyPointBenefit_onShowDialogFreeItems: () => void;
  loyaltyPointBenefit_onCloseDialogFreeItems: () => void;
}
