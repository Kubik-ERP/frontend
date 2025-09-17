import type { Validation } from '@vuelidate/core';
export type IItemDiscountFormData = {
  discountValue: number;
  isPercent: boolean;
};

export type ISelectedProduct = {
  id: string;
};

export type IProductListResponse = {
  products: IProductList[];
  total: number;
  page: number;
  lastPage: number;
};

export type IProductList = {
  id: string;
  name: string;
  price: number;
  discountPrice: number | null;
  pictureUrl: string | null;
  isPercent: boolean;
  storesId: string;
  categoriesHasProducts: Array<{
    categoriesId: string;
    productsId: string;
    categories: {
      id: string;
      category: string;
      description: string | null;
      pictureUrl: string | null;
      storesId: string;
    };
  }>;
  variantHasProducts: Array<{
    variantId: string;
    productsId: string;
  }>;
};

export type IProductListQueryParams = {
  page: number;
  limit: number;
  search: string;
};

export type IItemDiscountProvided = {
  hasPermission?: boolean;
  productList_columns: IColumnDataTable[];
  productList_isLoading: globalThis.Ref<boolean>;
  productList_values: globalThis.Ref<IProductListResponse>;
  productList_queryParams: IProductListQueryParams;
  productList_onChangePage: (page: number) => void;
  selectedProducts: globalThis.Ref<string[]>;
  isProductSelected: (product: ISelectedProduct) => boolean;
  toggleSelection: (product: ISelectedProduct) => void;

  itemDiscount_onShowDialog: () => void;
  itemDiscount_onCloseDialog: () => void;
  itemDiscount_onSubmitDialog: () => void;
  itemDiscount_formData: IItemDiscountFormData;
  itemDiscount_formValidations: globalThis.Ref<Validation>;
  fetchProductList: () => Promise<void>;
};
