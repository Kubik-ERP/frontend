import axios from 'axios';
import {
  ICustomer,
  ICustomerFormData,
  ICustomerResponse,
  ITag,
  ICustomerCreateResponse,
} from '../interfaces/CustomersInterface';

const API_URL = `${import.meta.env.VITE_APP_BASE_API_URL}/api/customers`;

const API_URL_TAGS = `${import.meta.env.VITE_APP_BASE_API_URL}/api/tags`;

import useVuelidate from '@vuelidate/core';

import { required } from '@vuelidate/validators';

import eventBus from '@/plugins/mitt';

// import { required } from '@vuelidate/validators';

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
    console.log('🚀 ~ getCustomerTags ~ response:', response);
    return response.data.data;
  };

  const getAllCustomers = async (page: number, limit: number, search: string): Promise<ICustomerResponse> => {
    const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}&search=${search}`);
    // console.log("🚀 ~ getAllCustomers ~ response:", response)
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

  const createCustomer = async (payload: ICustomerFormData): Promise<ICustomerCreateResponse> => {
    try {
      const response = await axios.post(API_URL, payload);
      console.log('🚀 ~ createCustomer ~ response:', response);

      const data: ICustomer = response.data.data;

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Customer has been created successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      return {
        data,
        message: response.data.message,
        statusCode: response.status,
      };
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const getCustomerByID = async (id: string): Promise<ICustomer> => {
    const response = await axios.get(`${API_URL}/${id}`);
    const customer: ICustomer = response.data.data;
    // console.log("🚀 ~ getCustomerByID ~ customer:", customer)
    // console.log("🚀 ~ getCustomerByID ~ response:", response)

    return customer;
  };

  const updateCustomer = async (id: string, payload: ICustomerFormData): Promise<ICustomerCreateResponse> => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, payload);
      const data: ICustomer = response.data.data.data;
      console.log("🚀 ~ updateCustomer ~ response:", response)

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Customer has been updated successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      return {
        data,
        message: response.data.message,
        statusCode: response.status,
      };
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const deleteCustomer = async (id: string): Promise<void> => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Customer has been deleted successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  return {
    getAllCustomers,
    createCustomer,
    deleteCustomer,
    getCustomerTags,
    getCustomerByID,
    updateCustomer,
    customer_FormData,
    customer_formValidations,
  };
};
