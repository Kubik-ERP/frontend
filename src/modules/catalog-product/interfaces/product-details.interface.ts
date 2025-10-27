export type IProductDetailsStateStore = {
  productDetails_isLoading: boolean;
  productDetails: IProductDetails;
};

export type IProductDetails = {
  id: string;
  photoUrl: string;
  name: string;
  categories: string[];
  recipe: IRecipe;
  price: number;
  discountPrice: number;
  productVariant: IProductVariant[];
  portionStock: IProductPortionStock[];
};

type IRecipe = {
  id: string;
  name: string;
};

type IProductVariant = {
  name: string;
  additionalPrice: number;
};

type IProductPortionStock = {
  batchName: string;
  batchDate: Date;
  batchActualPortion: number;
  batchPortionLeft: number;
  difference: number;
};

export type IProductDetailsProvided = {
  // columns
  productDetails_productVariants_columns: IColumnDataTable[];
  productDetails_portionStock_columns: IColumnDataTable[];
  // data
  productDetails: globalThis.Ref<IProductDetails>;
  productDetails_isLoading: globalThis.Ref<boolean>;
};
