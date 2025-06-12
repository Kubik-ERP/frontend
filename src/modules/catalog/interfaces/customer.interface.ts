// Interfaces
import type { Validation } from '@vuelidate/core';

export interface ICustomer {
  id: string;
  address: string;
  code: string;
  dob: string;
  email: string;
  gender: string;
  name: string;
  number: string;
  customerHasTag: {
    customerId: string;
    tagId: string;
    tag: ICustomerTag;
  }[];
  customerHasStores: [];
}

export interface ICustomerTag {
  id: string;
  name: string;
}

export interface ICustomerFormData {
  address: string;
  code: string;
  dob: string;
  email: string;
  gender: string;
  name: string;
  number: string;
  tags: Omit<ICustomerTag, 'id'>[];
}

export interface ICustomerRequestQuery {
  limit: string;
  page: string;
  search: string;
}

export interface ICustomerDetailResponse {
  data: ICustomer;
}

export interface ICustomerListResponse {
  data: ICustomer[];
  lastPage: number;
  page: number;
  total: number;
}

export interface ICustomerListProvided {
  customerList_columns: IColumnDataTable[];
  customerList_fetchListCustomers: () => Promise<void>;
  customerList_isLoading: globalThis.Ref<boolean>;
  customerList_onDelete: (customerId: string) => Promise<void>;
  customerList_queryParams: ICustomerRequestQuery;
  customerList_values: never[];
}

export interface ICustomerProvided {
  customer_formData: ICustomerFormData;
  customer_formValidations: globalThis.Ref<Validation>;
  customer_isLoading: globalThis.Ref<boolean>;
}
