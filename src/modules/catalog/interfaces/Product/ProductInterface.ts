import { ICategory } from '@/modules/catalog/interfaces/Category/CategoryInterface.ts';
import { IVariant } from '@/modules/catalog/interfaces/Variant/VariantInterface.ts';

export interface IProduct {
  id: string;
  name: string;
  price: number;
  discount_price?: number;
  picture_url?: string;
  categories_has_products?: ICategory[];
  variant_has_products?: IVariant[];
}

export interface CreateProductPayload {
  name: string;
  price?: number;
  discount_price?: number;
  picture_url?: string;
  category_ids: string[];
  variant_ids: string[];
}
