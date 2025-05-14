import { ICategory } from '@/modules/catalog/interfaces/Category/CategoryInterface.ts';

export interface IProduct {
  id: string;
  name: string;
  price: number;
  discount_price?: number;
  picture_url?: string;
  categories_has_products?: ICategory[];
}

export interface CreateProductPayload {
  name: string;
  price?: number;
  discount_price?: number;
  picture_url?: string;
  category_ids: string[];
}
