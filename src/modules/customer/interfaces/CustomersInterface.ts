export interface ICustomer {
  id: string;
  name: string;
  email: string;
  code: string;
  number?: string;
  points?: number; //number
  latestVisit?: string; //date
}

export interface ICustomerFormData {
  name: string;
  gender: string;
  dob: string;
  code: string;
  number: string;
  email: string;
  id: string;
  tags: string[];
  address: string;
}
