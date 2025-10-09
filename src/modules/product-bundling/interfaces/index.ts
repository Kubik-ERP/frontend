import { Validation } from '@vuelidate/core';
export interface IProductBundlingCreateEditFormData {
  id?: string | null;
  name: string;
  description: string;
  products: IProductList;
  type: string;
  price: number;
  grandTotal: number;
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
  discount?: number | null;
  type: string;
  price: number;
  created_at: string;
  updated_at: string;
  products?: {
    product_id: string;
    quantity: number;
    product_name?: string;
    product_price?: number;
  }[];
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

export interface IProductBundlingListRequestQuery {
  page: number;
  limit: number;
  search?: string | null;
}

export interface IProductBundling_list {
  data: IProductBundling[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface IProductBundlingPayload {
  id?: string | null;
  name: string;
  description: string;
  discount?: number | null;
  type: string;
  price?: number | null;
  products: {
    productId: string;
    quantity: number;
  }[];
}

export interface IProductBundlingStore {
  productList_isLoading: boolean;
  productBundling_productList: IProductList;
  productBundling_isLoading: boolean;
  productBundling_list: IProductBundling_list;
}

export interface IProductBundlingDetailsResponse {
  id: string;
  store_id: string;
  name: string;
  description: string;
  type: string;
  discount?: number | null;
  price: number;
  created_at: string;
  updated_at: string;
  products?: {
    product_id: string;
    product_name: string;
    product_price: number;
    product_discount_price: number;
    quantity: number;
  }[];
}

export interface IProductBundlingProvided {
  // constant
  productBinding_columns: IColumnDataTable[];
  productBundling_list: globalThis.Ref<IProductBundlingList>;
  productBundling_onChangePage: (page: number) => void;
  productBundling_isLoading: globalThis.Ref<boolean>;

  price_type_option: { value: string; label: string }[];

  productBundling_grandTotal: globalThis.Ref<number>;
  productBundling_formData: IProductBundlingCreateEditFormData;
  productBundling_formValidations: globalThis.Ref<Validation>;

  productBundling_onShowDialogDelete: (id: string) => void;

  productBundling_fetchProductList: () => Promise<void>;
  productBundling_fetchProductBundlingList: () => Promise<void>;
  productBundling_fetchCreateProductBundlingList: () => Promise<void>;
  productBundling_fetchProductBundlingDetails: (id: string) => Promise<void>;
  productBundling_fetchUpdateProductBundlingList: () => Promise<void>;

  productBundling_productList: globalThis.Ref<IProductList>;
  productList_isLoading: globalThis.Ref<boolean>;

  // function
  setPricingType: () => void;
  calculateTotalPrice: () => void;
  productBundling_queryParams: {
    page: number;
    limit: number;
    search?: string | null | undefined;
  };
}
