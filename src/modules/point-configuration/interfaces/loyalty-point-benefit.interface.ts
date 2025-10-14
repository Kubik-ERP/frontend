import type { Validation } from '@vuelidate/core';

export type IFreeItems = {
  id?: string;
  name: string;
  categories?: string;
  quantity: number;
};

export type IDiscount = {
  value: number;
  unit: string;
  isPercent: boolean;
};

export type ILoyaltyPointBenefit = {
  id?: string | null;
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

export type IProductListRequestQuery = {
  page: number;
  limit: number;
  search?: string | null;
};

export type IFreeItemFormData = {
  id?: string | null;
  name: string;
  pointNeeds: number;
  freeItems: IFreeItems[];
};

export interface ILoyaltyPointBenefitProvided {
  loyaltyPointBenefit_columns: IColumnDataTable[];
  dailySalesList_onChangePage: (page: number) => void;

  loyaltyPointBenefit_isLoading: globalThis.Ref<boolean>;

  isEdit: globalThis.Ref<boolean>;

  loyaltyPointBenefit_fetchProductList: () => Promise<void>;

  discountBenefit_formData: IDiscountFormData;
  discountBenefit_formValidations: globalThis.Ref<Validation>;
  loyaltyPointBenefit_onSubmitDialogDiscount: () => Promise<void>;
  loyaltyPointBenefit_onShowDialogDiscount: () => void;
  loyaltyPointBenefit_onShowEditDialogDiscount: (data: ILoyaltyPointBenefit) => void;
  loyaltyPointBenefit_onSubmitEditDialogDiscount: () => Promise<void>;
  loyaltyPointBenefit_onCloseDialogDiscount: () => void;
  loyaltyPointBenefit_fetchList: () => Promise<void>;
  loyaltyPointBenefit_onDelete: (id: string) => Promise<void>;

  loyaltyPointBenefit_queryParams: IPointConfigurationListRequestQuery;
  loyaltyPointBenefit_list: globalThis.Ref<IPointConfigurationListResponse>;

  freeItemsBenefit_formData: IFreeItemFormData;
  freeItemsBenefit_formValidations: globalThis.Ref<Validation>;
  loyaltyPointBenefit_onSubmitDialogFreeItems: () => Promise<void>;
  loyaltyPointBenefit_onSubmitEditDialogFreeItems: () => Promise<void>;
  loyaltyPointBenefit_onShowEditDialogFreeItems: (data: ILoyaltyPointBenefit) => void;
  loyaltyPointBenefit_onShowDialogFreeItems: () => void;
  loyaltyPointBenefit_onCloseDialogFreeItems: () => void;

  productList_isLoading: globalThis.Ref<boolean>;
  loyaltyPointBenefit_productList: globalThis.Ref<IProductList[]>;
  loyaltyPointSettings_initiate: () => Promise<void>;
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
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
  loyaltySettingsStatus: boolean;
  loyaltySettingsId?: string | null;
};

export type IProductList = {
  id: string;
  name: string;
  categories: string;
  freeItems?: IFreeItems[] | null;
};

export type IProductListResponse = {
  id: string;
  name: string;
  categoriesHasProducts: [
    {
      categories: {
        id: string;
        category: string;
      };
    },
  ];
};

export type IItems = {
  productId: string;
  quantity: number;
};

export type IFreeItemsPayload = {
  id?: string | null;
  benefitType: string;
  benefitName: string;
  pointNeeds: number;
  items?: IItems[] | [];
};
