export * from './product-details.interface';

export interface ICategory {
  id: string;
  category: string;
  description?: string;
  pictureUrl?: string;
}

export interface CategoryPayload {
  imagePreview?: string;
  imageFile?: File;
  category: string;
  description?: string;
}

export interface ICategoryFormData {
  imagePreview?: string;
  imageFile?: File;
  name: string;
  description: string;
}

export interface ICategoryResponse {
  categories: ICategory[];
  lastPage: number;
}

export interface ICategoryAddResponse {
  statusCode: number;
  message: string;
  data?: ICategory;
}

export interface ICategory {
  id: string;
  category: string;
  description?: string;
}

export interface IVariant {
  id?: string;
  name: string;
  price?: number;
}

export interface ICategoryHasProduct {
  categories_id: string;
  products_id: string;
  categories: ICategory;
}

export interface IVariantHasProduct {
  variant_id: string;
  products_id: string;
  variant: IVariant;
}

export interface IProduct {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  discount_value?: number;
  picture_url?: string;
  isPercent?: boolean;
  categoriesHasProducts?: ICategoryHasProduct[];
  variantHasProducts?: IVariantHasProduct[];
}

export interface CreateProductPayload {
  imagePreview?: string;
  imageFile?: File;
  name?: string;
  price?: number;
  isDiscount?: boolean;
  discount_price?: number;
  discount_value?: number;
  is_percent?: boolean;
  picture_url?: string;
  categories?: ICategory[];
  variants?: IVariant[];
  stock_quantity?: number;
  recipeId?: string;
}

export interface IProductResponse {
  products: IProduct[];
  lastPage: number;
}

export interface CreateCategoryPayload {
  name: string;
  price?: number;
}

export interface IProductStateStore {
  recipeList_values: IRecipeList[];
}

export interface IRecipeList {
  id: string;
  isBaseRecipe: boolean;
  recipeName: string;
  output: string;
  yieldTarget: number;
  costPerPortion: number;
  marginRp: number;
  marginPercent: number;
  updatedAt: string;
}
