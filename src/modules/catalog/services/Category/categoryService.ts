import axios from 'axios';
import { ICategory } from '@/modules/catalog/interfaces/Category/CategoryInterface';

const API_URL = `${import.meta.env.VITE_API_URL}/api/categories`;

export const getAllCategories = async (): Promise<ICategory[]> => {
  const response = await axios.get(API_URL);
  const categories: ICategory[] = response.data.data;

  return categories.map(item => ({
    id: item.id,
    category: item.category,
    description: item.description ?? '-',
  }));
};

export const createCategory = async (payload: { category: string; description?: string }): Promise<ICategory> => {
  const response = await axios.post(API_URL, payload);
  const data: ICategory = response.data.data;

  return {
    id: data.id,
    category: data.category,
    description: data.description ?? '-',
  };
};
