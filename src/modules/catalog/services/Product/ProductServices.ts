import axios from 'axios';

import {
  CreateProductPayload,
  IProduct,
  ICategoryHasProduct,
  IVariantHasProduct,
  IProductResponse,
} from '@/modules/catalog/interfaces/Product/ProductInterface.ts';

import useVuelidate from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';

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
  if (payload.imageFile) {
    formData.append('image', payload.imageFile); // Make sure it's a File or Blob
  }

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
    categories: { required },
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
    const response = await axios.get(`${API_URL}/?page=${page}&limit=${limit}&search=${search}`);
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
  };

  const getProductById = async (id: string): Promise<IProduct> => {
    const response = await axios.get(`${API_URL}/${id}`);

    // console.log('🚀 ~ getProductById ~ response:', response);
    const product = response.data.data;
    // console.log('🚀 ~ getProductById ~ product:', product);

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice || 0,
      isPercent: product.isPercent,
      picture_url: `${import.meta.env.VITE_APP_BASE_API_URL}${product.pictureUrl}` || '-', // ← corrected `pictureUrl`
      categoriesHasProducts:
        product.categoriesHasProducts?.map((item: ICategoryHasProduct) => item.categories) || [],
      variantHasProducts: product.variantHasProducts?.map((item: IVariantHasProduct) => item.variant) || [],
    };
  };

  const createProduct = async (payload: CreateProductPayload): Promise<IProduct> => {
    const formData = convertProductToFormData(payload);
    // console.log('🚀 ~ createProduct ~ payload:', payload);
    // console.log('🚀 ~ createProduct ~ formData:', formData);

    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // console.log('🚀 ~ createProduct ~ response.data.data:', response);
    return response.data.data;
  };

  const updateProduct = async (id: string, payload: CreateProductPayload): Promise<IProduct> => {
    const formData = convertProductToFormData(payload);

    
    const response = await axios.patch(`${API_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const data: IProduct = response.data.data;
    // console.log('🚀 ~ updateProduct ~ response:', data);

    return {
      id: data.id,
      name: data.name,
      price: data.price,
    };
  };

  const deleteProduct = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  };

  return {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    product_formValidations,
    product_formData,
  };
};
