import { ICashierCategoriesResponse, ICashierCustomer, ICashierVariant, IProductItem } from './cashier-response';

export interface ICashierModalAddProductItem {
  quantity: number;
  variant: ICashierVariant;
  notes: string;
}

export interface ICashierSelected {
  type: string;
  product?: IProductItem;
  variant: ICashierVariant;
  bundling?: IProductItem;
  bundlingId?: string;
  productId?: string;
  variantId?: string;
  quantity: number;
  notes: string;
}

export interface ICashierModalAddProduct {
  show: boolean;
  isAddNotesActive: boolean;
  product: IProductItem | null;
  item: ICashierModalAddProductItem;
}

export interface ICashierStateStore {
  cashierProduct_selectedProduct: ICashierSelected[];
  cashierSelfOrder_isLoadingSignUp: boolean;
  cashierSelfOrder_isLoadingSignIn: boolean;
}

export interface ICashierStateCategory {
  isLoading: boolean;
  data: ICashierCategoriesResponse;
}

export interface ICashierCustomerState {
  isLoading: boolean;
  customerList: ICashierCustomer[];
  page: number;
  limit: number;
  total: number;
  selectedCustomer: ICashierCustomer | null;
}

export interface ICashierOrderType {
  code: string;
  label: string;
  available: boolean;
}

// Export new service interfaces
export * from './cashier-order.interface';
export * from './cashier-payment.interface';
export * from './cashier-customer.interface';
