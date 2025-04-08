import axios from 'axios';
import { Category } from '@/modules/catalog/interfaces/Category/CategoryInterface.ts';

const API_URL = `${import.meta.env.VITE_API_URL}/api/categories`;

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await axios.get(API_URL);
  const categories: Category[] = response.data.data;

  return categories.map(item => ({
    ID: item.id,
    Category: item.category,
    Description: item.description ?? '-',
  }));
};

export const createCategory = async (payload: { name: string; description?: string }): Promise<Category> => {
  const response = await axios.post(API_URL, payload);
  const data: CategoryResponse = response.data.data;

  return {
    ID: data.id,
    Category: data.category,
    Description: data.description ?? '-',
  };
};
