import { Validation } from '@vuelidate/core';
export interface IProductBundlingCreateEditFormData {
  name: string;
  description: string;
  products: IProductList;
  type: string;
  price: number;
}

export type IProduct = {
  id: string;
  name: string;
  categories: string;
  price: number;
  discountPrice: number;
  quantity: number;
};

export type IProductList = IProduct[];

export type IProductListRequestQuery = {
  page: number;
  limit: number;
  search?: string | null;
};

export type IProductListResponse = {
  id: string;
  name: string;
  price: number;
  discountPrice: number;
  categoriesHasProducts: [
    {
      categories: {
        id: string;
        category: string;
      };
    },
  ];
};

export type IProductBundling = {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  created_at: string;
  updated_at: string;
};

export type IProductBundlingList = {
  data: IProductBundling[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export interface IProductBundlingStore {
  productList_isLoading: boolean;
  productBundling_productList: IProductList;
}

export interface IProductBundlingProvided {
  // constant
  productBinding_columns: IColumnDataTable[];
  productBundling_list: IProductBundlingList;

  price_type_option: { value: string; label: string }[];

  productBundling_grandTotal: globalThis.Ref<number>;
  productBundling_formData: IProductBundlingCreateEditFormData;
  productBundling_formValidations: globalThis.Ref<Validation>;

  productBundling_fetchProductList: () => Promise<void>;

  productBundling_productList: globalThis.Ref<IProductList>;
  productList_isLoading: globalThis.Ref<boolean>;
}
