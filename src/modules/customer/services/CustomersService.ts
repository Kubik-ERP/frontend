import axios from 'axios';
import { ICustomer, ICustomerFormData,ICustomerResponse } from '../interfaces/CustomersInterface';

const API_URL = `${import.meta.env.VITE_API_URL}/api/customers`;

import useVuelidate from '@vuelidate/core';
import { required, email, numeric, minLength, maxLength } from '@vuelidate/validators';

export const useCustomerService = () => {
  const customer_FormData = reactive<ICustomerFormData>({
    name: '',
    gender: '',
    dob: '',
    code: '+62',
    number: '',
    email: '',
    id: '',
    tags: [],
    address: '',
  });

  const customer_formRules = computed(() => ({
    name: { required },
    email: { required, email },
    number: { required, numeric, minLength: minLength(10), maxLength: maxLength(11) },
    id: { required, minLength: minLength(16), maxLength: maxLength(16) },
    address: { required },
    tags: { required },
    code: { required },
    dob: { required },
    gender: { required },
  }));

  const customer_formValidations = useVuelidate(customer_formRules, customer_FormData, {
    $autoDirty: true,
  });

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
    }));;
    console.log('🚀 ~ getAllCustomers ~ customers:', customers);

    return {
      customers,
      lastPage: response.data.data.lastPage,
    }
  };

  const createCustomer = async (payload: ICustomerFormData): Promise<ICustomer> => {
    const response = await axios.post(API_URL, payload);
    const data: ICustomer = response.data.data;
    return {
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
    customer_FormData,
    customer_formValidations,
  };
};
