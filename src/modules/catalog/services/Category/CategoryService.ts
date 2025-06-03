import axios from 'axios';
import {
  CategoryPayload,
  ICategory,
  ICategoryFormData,
  ICategoryResponse,
  ICategoryAddResponse,
} from '@/modules/catalog/interfaces/Category/CategoryInterface';

import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

const API_URL = `${import.meta.env.VITE_API_URL}/api/categories`;

export const useCategoryService = () => {
  const category_formData = reactive<ICategoryFormData>({
    name: '',
    description: '',
  });

  const category_formRules = computed(() => ({
    name: { required },
    description: {},
  }));

  const category_formValidations = useVuelidate(category_formRules, category_formData, {
    $autoDirty: true,
  });

  const getAllCategories = async (page: number, limit: number, search: string): Promise<ICategoryResponse> => {
    const response = await axios.get(`${API_URL}/?page=${page}&limit=${limit}&search=${search}`);
    const lastPage = response.data.data.lastPage;
    const categories: ICategory[] = response.data.data.categories.map((item: ICategory) => ({
      id: item.id,
      category: item.category,
      description: item.description ?? '-',
    }));
    return {
      categories,
      lastPage,
    };
  };
  const createCategory = async (payload: CategoryPayload): Promise<ICategoryAddResponse> => {
    const response = await axios.post(API_URL, payload);
    const message = response.data.message || 'Successfully created a category.';
    if (response.data.statusCode !== 201)
      return {
        message,
        statusCode: response.data.statusCode,
      };
    const data: ICategory = response.data.data;
    return {
      message,
      statusCode: response.data.statusCode,
      data: {
        id: data.id,
        category: data.category,
        description: data.description || '-',
      },
    };
  };
  const updateCategory = async (id: string, payload: CategoryPayload): Promise<ICategory> => {
    category_formValidations.value.$touch();

    const response = await axios.patch(`${API_URL}/${id}`, payload);
    const data: ICategory = response.data.data;

    return {
      id: data.id,
      category: data.category,
      description: data.description || '-',
    };
  };
  const deleteCategory = async (id: string): Promise<number> => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.status;
  };

  const getCategoryByID = async (id: string): Promise<ICategory> => {
    const response = await axios.get(`${API_URL}/${id}`);
    const data: ICategory = response.data.data;

    return {
      id: data.id,
      category: data.category,
      description: data.description || '-',
    };
  };

  return {
    category_formData,
    category_formValidations,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryByID,
  };
};
