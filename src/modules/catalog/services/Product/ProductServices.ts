import axios from 'axios';

import { CreateProductPayload, IProduct } from '@/modules/catalog/interfaces/Product/ProductInterface.ts';

const API_URL = `${import.meta.env.VITE_API_URL}/api/products`;

export const getAllProducts = async (): Promise<IProduct[]> => {
  const response = await axios.get(API_URL);
  const products: IProduct[] = response.data.data;

  return products.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    discount_price: item.discount_price || 0,
    picture_url: item.picture_url || '-',
      categories: item.categories_has_products?.map((v: any) => v.categories) || [],
      variants: item.variant_has_products?.map((v: any) => v.variant) || [],
  }));
};

export const createProduct = async (payload: CreateProductPayload): Promise<IProduct> => {
  const response = await axios.post(API_URL, payload);
  return response.data.data;
};

export const updateProduct = async (id: string, payload: CreateProductPayload): Promise<IProduct> => {
  const response = await axios.patch(`${API_URL}/${id}`, payload);
  const data: IProduct = response.data.data;

  return {
    id: data.id,
    name: data.name,
    price: data.price,
    discount_price: data.discount_price || 0,
    picture_url: data.picture_url || '-',
    categories_has_products: data.categories_has_products || [],
  };
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
