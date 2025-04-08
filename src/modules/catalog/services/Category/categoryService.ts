import axios from 'axios';
import { Category } from '@/modules/catalog/interfaces/Category/CategoryInterface.ts';

const API_URL = `${import.meta.env.VITE_API_URL}/api/categories`;

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await axios.get(API_URL);
  const categories: Category[] = response.data.data;

  return categories.map((item) => ({
    ID: item.id,
    Category: item.name,
    Description: item.notes ?? '-',
  }));
};
