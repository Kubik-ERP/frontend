import { ICustomer } from './customer.interface';

export * from './customer.interface';

export interface ICatalogStateStore {
  catalog_isLoading: boolean;
  catalog_customerDetails: ICustomer | null;
  catalog_customerLists: ICustomer[] | [];
}
