export interface ICategory {
  id: string;
  category: string;
  description?: string;
}

export interface IVariant {
  id: string;
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
  id?: string;
  image?: string;
  name: string;
  price: number;
  isDiscount?: boolean;
  discount_price?: number;
  discount_value?: number;
  is_percent: boolean;
  picture_url?: string;
  categories: object[];
  variants?: object[];
}

export interface IProductResponse {
  products: IProduct[];
  lastPage: number;
}