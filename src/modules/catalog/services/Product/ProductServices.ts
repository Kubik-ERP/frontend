import axios from 'axios';

import { CreateProductPayload, IProduct } from '@/modules/catalog/interfaces/Product/ProductInterface.ts';

import useVuelidate from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';

const API_URL = `${import.meta.env.VITE_API_URL}/api/products`;

export const useProductService = () => {
  const product_formData = reactive<CreateProductPayload>({
    image: '',
    name: '',
    categories: [],
    price: 0,
    isDiscount: false,
    discount_value: 0,
    discount_unit: 'Rp',
    discount_price: 0,
    variants: []
  });

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

  const product_formValidations = useVuelidate(product_formRules, product_formData, {
    $autoDirty: true,
  });

  const getAllProducts = async (): Promise<IProduct[]> => {
    const response = await axios.get(API_URL);
    const products: IProduct[] = response.data.data;

    return products.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      discount_price: item.discount_price || 0,
      picture_url: item.picture_url || '-',
      categories: item.categories_has_products?.map(item => item.categories.category),
      variants: item.variant_has_products?.map(item => item.variant.name),
    }));
  };

  const getProductById = async (id: string): Promise<IProduct> => {
    const response = await axios.get(`${API_URL}/${id}`);
    const product = response.data.data;
    const categories = product.categories_has_products?.map(item => item.categories.category);

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      discount_value: product.discount_price || 0,
      picture_url: product.picture_url || '-',
      categories: product.categories_has_products.map(item => item.categories) || [],
      variants: product.variant_has_products?.map(item => item.variant) || [],
    };
  };

  const createProduct = async (payload: CreateProductPayload): Promise<IProduct> => {
    const response = await axios.post(API_URL, payload);
    return response.data.data;
  };

  const updateProduct = async (id: string, payload: CreateProductPayload): Promise<IProduct> => {
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
