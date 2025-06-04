import axios from 'axios';
import { ICustomer, ICustomerFormData, ICustomerResponse, ITag } from '../interfaces/CustomersInterface';

const API_URL = `${import.meta.env.VITE_APP_BASE_API_URL}/api/customers`;

const API_URL_TAGS = `${import.meta.env.VITE_APP_BASE_API_URL}/api/tags`;

import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

export const useCustomerService = () => {
  const customer_FormData = reactive<ICustomerFormData>({
    name: '',
    gender: '',
    dob: '',
    code: '+62',
    number: '',
    email: '',
    tags: [],
    address: '',
  });

  // const customer_formRules = computed(() => ({
  //   name: { required },
  //   email: { required, email },
  //   number: { required, numeric, minLength: minLength(10), maxLength: maxLength(11) },
  //   // id: { required, minLength: minLength(16), maxLength: maxLength(16) },
  //   address: { required },
  //   tags: {  },
  //   code: { required },
  //   dob: { required },
  //   gender: { required },
  // }));

  const customer_formRules = computed(() => ({
    name: { required },
  }));

  const customer_formValidatable = computed(() => ({
    name: customer_FormData.name,
  }));

  const customer_formValidations = useVuelidate(customer_formRules, customer_formValidatable, {
    $autoDirty: true,
  });

  const getCustomerTags = async (): Promise<ITag[]> => {
    const response = await axios.get(API_URL_TAGS);
    return response.data.data;
  };

  const getAllCustomers = async (page: number, limit: number, search: string): Promise<ICustomerResponse> => {
    const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}&search=${search}`);
    const customers: ICustomer[] = response.data.data.data.map((item: ICustomer) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      code: item.code,
      number: item.number || '-',
      points: item.points || 0,
      latestVisit: item.latestVisit || '-',
      customersHasTag: item.customersHasTag,
      username: item.username,
      address: item.address,
      dob: item.dob,
    }));

    return {
      customers,
      lastPage: response.data.data.lastPage,
      total: response.data.data.total,
    };
  };

  const createCustomer = async (payload: ICustomerFormData): Promise<ICustomer> => {
    const response = await axios.post(API_URL, payload);
    const data: ICustomer = response.data.data;

    return {
      address: data.address || '-',
      dob: data.dob || '-',
      customersHasTag: data.customersHasTag || [],
      username: data.username || '-',
      id: data.id,
      name: data.name,
      email: data.email,
      code: data.code,
      number: data.number || '-',
      points: data.points || 0,
      latestVisit: data.latestVisit || '-',
    };
  };

  const deleteCustomer = async (id: string): Promise<void> => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data.data;
  };

  return {
    getAllCustomers,
    createCustomer,
    deleteCustomer,
    getCustomerTags,
    customer_FormData,
    customer_formValidations,
  };
};
