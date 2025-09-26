import axios from 'axios';

import {
  CreateProductPayload,
  IProduct,
  ICategoryHasProduct,
  IVariantHasProduct,
  IProductResponse,
  ICategory,
} from '../interfaces';

import useVuelidate from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';

import eventBus from '@/plugins/mitt';

import { useOutletStore } from '@/modules/outlet/store';

const API_URL = `${import.meta.env.VITE_APP_BASE_API_URL}/api/products`;

function convertProductToFormData(payload: CreateProductPayload): FormData {
  const formData = new FormData();

  // Required flat fields (assume all are non-undefined)
  formData.append('name', String(payload.name));
  formData.append('price', String(payload.price));
  formData.append('discount_price', String(payload.discount_price));
  formData.append('isDiscount', String(payload.isDiscount));
  formData.append('is_percent', String(payload.is_percent));

  // Optional image

  formData.append('image', payload.imageFile!); // Make sure it's a File or Blob

  // Categories
  payload.categories?.forEach((cat, i) => {
    if (cat.id) formData.append(`categories[${i}][id]`, cat.id);
    if (cat.category) formData.append(`categories[${i}][category]`, cat.category);
    if (cat.description) formData.append(`categories[${i}][description]`, cat.description);
  });

  // Variants
  payload.variants?.forEach((variant, i) => {
    if (variant.name) formData.append(`variants[${i}][name]`, variant.name);
    if (variant.price !== undefined) {
      formData.append(`variants[${i}][price]`, String(variant.price));
    }
  });

  return formData;
}

export const useProductService = () => {
  const outletStore = useOutletStore();

  const storeID = outletStore.outlet_currentOutlet?.id;
  const token = JSON.parse(localStorage.getItem('authentication') ?? '{}');

  const headers = {
    'X-STORE-ID': storeID,
    Authorization: `Bearer ${token?.authentication_token}`,
    'ngrok-skip-browser-warning': 'true'
  };

  const product_formData = reactive<CreateProductPayload>({
    imageFile: undefined,
    imagePreview: '',
    name: '',
    categories: [],
    price: 0,
    isDiscount: false,
    discount_value: 0,
    is_percent: false,
    discount_price: 0,
    variants: [],
  });
  const product_formValidatable = computed(() => ({
    name: product_formData.name,
    price: product_formData.price,
    categories: product_formData.categories,
    discount_value: product_formData.discount_value,
    variants: product_formData.variants,
  }));

  const product_formRules = computed(() => ({
    name: { required },
    price: { required },
    categories: {},
    discount_value: { required },
    variants: {
      $each: helpers.forEach({
        name: { required },
        price: { required },
      }),
    },
  }));

  const product_formValidations = useVuelidate(product_formRules, product_formValidatable, {
    $autoDirty: true,
  });

  const getAllProducts = async (page: number, limit: number, search: string): Promise<IProductResponse> => {
    try {
      const response = await axios.get(`${API_URL}/?page=${page}&limit=${limit}&search=${search}`, {
        headers: headers,
      });
      
      const products: IProduct[] = response.data.data.products.map((item: IProduct) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        discount_price: item.discountPrice || 0,
        picture_url: item.picture_url || '-',
        categoriesHasProducts: item.categoriesHasProducts?.map(
          (cat: ICategoryHasProduct) => cat.categories.category,
        ),
        variantHasProducts: item.variantHasProducts?.map((variant: IVariantHasProduct) => variant.variant.name),
      }));

      const lastPage = response.data.data.lastPage;

      return {
        products,
        lastPage,
      };
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const getProductByCategories = async (
    page: number,
    limit: number,
    search: string,
    categories: ICategory[],
  ): Promise<IProductResponse> => {
    try {
      const categoriesID = categories.map(cat => cat.id);
      const response = await axios.get(`${API_URL}`, {
        params: {
          page: page,
          limit: limit,
          search: search,
          category_id: categoriesID,
        },
        headers: headers,
        paramsSerializer: useParamsSerializer,
      });
      const products: IProduct[] = response.data.data.products.map((item: IProduct) => {
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          discount_price: item.discountPrice || 0,
          picture_url: item.picture_url || '-',
          categoriesHasProducts: item.categoriesHasProducts?.map(
            (cat: ICategoryHasProduct) => cat.categories.category,
          ),
          variantHasProducts: item.variantHasProducts?.map((variant: IVariantHasProduct) => variant.variant.name),
        };
      });
      const lastPage = response.data.data.lastPage;

      return {
        products,
        lastPage,
      };
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const getProductById = async (id: string): Promise<IProduct> => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: headers,
      });

      // console.log('🚀 ~ getProductById ~ response:', response);
      const product = response.data.data;
      // console.log('🚀 ~ getProductById ~ product:', product);

      const pictureUrl = product.pictureUrl
        ? `${import.meta.env.VITE_APP_BASE_BUCKET_URL}${product.pictureUrl}`
        : 'https://placehold.co/250';

      const categories =
        product.categoriesHasProducts?.map((item: ICategoryHasProduct) => {
          const { id, category, description } = item.categories;
          return { id, category, description };
        }) || [];

      const variants = product.variantHasProducts?.map((item: IVariantHasProduct) => item.variant) || [];

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice || 0,
        isPercent: product.isPercent,
        picture_url: pictureUrl,
        categoriesHasProducts: categories,
        variantHasProducts: variants,
      };
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const createProduct = async (payload: CreateProductPayload): Promise<IProduct> => {
    try {
      const formData = convertProductToFormData(payload);

      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-STORE-ID': storeID,
          Authorization: `Bearer ${token?.authentication_token}`,
        },
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Product has been created successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
      // console.log('🚀 ~ createProduct ~ response.data.data:', response);
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const updateProduct = async (id: string, payload: CreateProductPayload): Promise<IProduct> => {
    try {
      const formData = convertProductToFormData(payload);

      const response = await axios.patch(`${API_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-STORE-ID': storeID,
          Authorization: `Bearer ${token?.authentication_token}`,
        },
      });
      const data: IProduct = response.data.data;

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Product has been updated successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      return {
        id: data.id,
        name: data.name,
        price: data.price,
      };
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: headers,
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Product has been deleted successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  return {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductByCategories,
    product_formValidations,
    product_formData,
  };
};
