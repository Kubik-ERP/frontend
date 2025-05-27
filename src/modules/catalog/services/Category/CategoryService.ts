import axios from 'axios';
import { CategoryPayload, ICategory } from '@/modules/catalog/interfaces/Category/CategoryInterface';

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

export const createCategory = async (payload: CategoryPayload): Promise<ICategory> => {
  const response = await axios.post(API_URL, payload);
  const data: ICategory = response.data.data;

  return {
    id: data.id,
    category: data.category,
    description: data.description || '-',
  };
};

export const updateCategory = async (id: string, payload: CategoryPayload): Promise<ICategory> => {
  const response = await axios.patch(`${API_URL}/${id}`, payload);
  const data: ICategory = response.data.data;

  return {
    id: data.id,
    category: data.category,
    description: data.description || '-',
  };
};

export const deleteCategory = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
