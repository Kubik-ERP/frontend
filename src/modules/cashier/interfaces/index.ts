import { ICashierCategoriesResponse, ICashierProduct, ICashierVariant } from './cashier-response';

export interface ICashierModalAddProductItem {
  quantity: number;
  variant: ICashierVariant;
  notes: string;
}

export interface ICashierSelected {
  product: ICashierProduct;
  variant: ICashierVariant;
  productId: string;
  variantId: string;
  quantity: number;
  notes: string;
}

export interface ICashierModalAddProduct {
  show: boolean;
  isAddNotesActive: boolean;
  product: ICashierProduct | null;
  item: ICashierModalAddProductItem;
}

export interface ICashierStateStore {
  cashierProduct_selectedProduct: ICashierSelected[];
}

export interface ICashierStateCategory {
  isLoading: boolean;
  data: ICashierCategoriesResponse;
}
