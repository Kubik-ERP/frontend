import axios from 'axios';
import { Category } from '@/modules/catalog/interfaces/Category/CategoryInterface.ts';


const API_URL = `${import.meta.env.VITE_API_URL}/api/categories`;

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await axios.get(API_URL);
  return response.data.data.map((cat: any) => ({
    ID: cat.id,
    Category: cat.name,
    Description: cat.notes ?? '-',
  })) as Category[];
};
