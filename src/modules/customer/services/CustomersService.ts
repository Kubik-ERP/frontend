import axios from 'axios';
import { ICustomer } from '../interfaces/CustomersInterface';

const API_URL = `${import.meta.env.VITE_API_URL}/api/customers`;

export const getAllCustomers = async (): Promise<ICustomer[]> => {
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

export const createCustomer = async (payload: {
  name: string;
  email: string;
  phone?: string;
}): Promise<ICustomer> => {
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
