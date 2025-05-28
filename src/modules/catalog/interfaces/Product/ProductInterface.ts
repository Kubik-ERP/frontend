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
  discount_price?: number;
  picture_url?: string;
  categories_has_products?: ICategoryHasProduct[];
  variant_has_products?: IVariantHasProduct[];
}

export interface CreateProductPayload {
  image?: string;
  name: string;
  price?: number;
  isDiscount?: boolean;
  discount_price?: number;
  discount_value?: number;
  discount_unit?: string;
  picture_url?: string;
  category_ids: string[];
  variant_ids: string[];
}
