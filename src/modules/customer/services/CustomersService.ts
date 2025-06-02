import axios from 'axios';
import { ICustomer, ICustomerFormData } from '../interfaces/CustomersInterface';

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
    number: { required, numeric, minLength: minLength(10), maxLength: maxLength(11)},
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

  const getAllCustomers = async (): Promise<ICustomer[]> => {
    const response = await axios.get(API_URL);
    const customers: ICustomer[] = response.data.data;
    console.log(response);
    return customers.map(item => ({
      id: item.id,
      name: item.name,
      email: item.email,
      code: item.code,
      phone: item.number || '-',
      points: item.points || 0,
      latestVisit: item.latestVisit || '-',
    }));
  };

  const createCustomer = async (payload: { name: string; email: string; phone?: string }): Promise<ICustomer> => {
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

  return {
    getAllCustomers,
    createCustomer,
    customer_FormData,
    customer_formValidations,
  };
};
