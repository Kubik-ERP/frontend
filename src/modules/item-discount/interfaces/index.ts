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

export type IItemDiscountProvided = {
  productList_isLoading: globalThis.Ref<boolean>;
  productList_values: globalThis.Ref<IProductList[]>;
  fetchProductList: () => Promise<void>;
};
