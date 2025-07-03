import axios from 'axios';

import { CATEGORIES_COLUMNS } from '../../constants';

import {
  CategoryPayload,
  ICategory,
  ICategoryFormData,
  ICategoryResponse,
  ICategoryAddResponse,
} from '@/modules/catalog/interfaces/Category/CategoryInterface';

import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

import eventBus from '@/plugins/mitt';

const API_URL = `${import.meta.env.VITE_APP_BASE_API_URL}/api/categories`;

function convertCategoriesToFormData(payload: CategoryPayload): FormData {
  // console.log('🚀 ~ convertCategoriesToFormData ~ payload:', payload);
  const formData = new FormData();

  formData.append('category', payload.category);
  formData.append('description', payload.description ?? '');

  if (payload.imageFile) formData.append('image', payload.imageFile);

  return formData;
}

export const useCategoryService = () => {
  const category_formData = reactive<ICategoryFormData>({
    name: '',
    description: '',
    imageFile: undefined,
    imagePreview: '',
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
    try {
      const formData = convertCategoriesToFormData(payload);
      // console.log("🚀 ~ createCategory ~ payload:", payload)
      // console.log("🚀 ~ createCategory ~ formData:", formData)
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const message = response.data.message || 'Successfully created a category.';
      if (response.data.statusCode !== 201)
        return {
          message,
          statusCode: response.data.statusCode,
        };
      const data: ICategory = response.data.data;
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Category has been created successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
      return {
        message,
        statusCode: response.data.statusCode,
        data: {
          id: data.id,
          category: data.category,
          description: data.description || '-',
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };
  const updateCategory = async (id: string, payload: CategoryPayload): Promise<ICategory> => {
    try {
      category_formValidations.value.$touch();
      const formData = convertCategoriesToFormData(payload);

      const response = await axios.patch(`${API_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data: ICategory = response.data.data;

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Category has been updated successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      return {
        id: data.id,
        category: data.category,
        description: data.description || '-',
      };
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };
  const deleteCategory = async (id: string): Promise<number> => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Category has been deleted successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
      return response.status;
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const getCategoryByID = async (id: string): Promise<ICategory> => {
    const response = await axios.get(`${API_URL}/${id}`);
    const data: ICategory = response.data.data;
    // console.log("🚀 ~ getCategoryByID ~ response:", response)
    const pictureUrl = data.pictureUrl
      ? `${import.meta.env.VITE_APP_BASE_API_URL}${data.pictureUrl}`
      : 'https://placehold.co/250';

    return {
      id: data.id,
      category: data.category,
      description: data.description || '-',
      pictureUrl: pictureUrl,
    };
  };

  return {
    category_columns: CATEGORIES_COLUMNS,
    category_formData,
    category_formValidations,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryByID,
  };
};
