export type IProductDetailsStateStore = {
  productDetails_isLoading: boolean;
  productDetails: IProductDetails;
};

export type IProductDetails = {
  id: string;
  photoUrl: string;
  name: string;
  categories: string[];
  menuRecipes: IRecipe[];
  price: number;
  discountPrice: number;
  productVariant: IProductVariant[];
  portionStock: IProductPortionStock[];
};

type IRecipe = {
  recipeId: string;
  recipeName: string;
};

type IProductVariant = {
  name: string;
  additionalPrice: number;
};

type IProductPortionStock = {
  // batchName: string;
  // batchDate: Date;
  // batchActualPortion: number;
  // batchPortionLeft: number;
  // difference: number;
  id: string
  productId: string;
  storesId: string;
  action: string
  adjustmentQuantity: number
  notes: string
  previousQuantity: number
  newQuantity: number
  createdAt: string
  updatedAt: string
  createdBy: number
  users:{
    id: string
    username: string
    email: string
    fullname: string
  },
  stores: {
    id: string
    name: string
  }
};



export type IProductDetailsProvided = {
  // columns
  productDetails_productVariants_columns: IColumnDataTable[];
  productDetails_portionStock_columns: IColumnDataTable[];
  // data
  productDetails: globalThis.Ref<IProductDetails>;
  productDetails_isLoading: globalThis.Ref<boolean>;
  // methods
  productDetails_fetchProductDetails: (id: string) => Promise<void>;
};
