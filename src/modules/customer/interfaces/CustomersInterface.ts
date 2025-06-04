export interface ITag {
  id: string;
  name: string;
}

export interface ICustomersHasTag {
  customerId: string;
  name: string;
  tag: ITag;
}

export interface ICustomer {
  id: string;
  name: string;
  code?: string;
  number?: string;
  dob?: string;
  email?: string;
  username?: string;
  address?: string;
  points?: number;
  latestVisit?: string;
  customersHasTag?: ICustomersHasTag[];
}

export interface ICustomerResponse {
  customers: ICustomer[];
  lastPage: number;
  total: number;
}

export interface ICustomerFormData {
  name: string;
  gender: string;
  dob: string;
  code: string;
  number: string;
  email: string;
  // id: string;
  tags: ITag[];
  address: string;
}

export interface ICreateCustomerPayload {
  name: string;
  code: string;
  number: string;
  dob: string;
  email: string;
  address: string;
  customers_has_tag: [
    {
      id: string;
    },
  ];
}

export interface ICustomerCreateResponse {
  data?: ICustomer;
  message: string;
  statusCode: number;
}
