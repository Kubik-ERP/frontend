import { ComputedRef, Ref, WritableComputedRef } from 'vue';
import type { VirtualScrollerLazyEvent } from 'primevue/virtualscroller';
import { ICashierCategoriesData, ICashierCategoriesHasProductResponse, IProductItem } from './cashier-response';

import { ICashierSelected, ICashierModalAddProductItem, ICashierModalAddProduct, ICashierCustomerState } from './index';

export interface ICashierProductState {
  isLoadingProduct: boolean;
  isLoadingCategory: boolean;
  selectedCategory: string;
  searchProduct: string;
  listCategory: ICashierCategoriesData[];
  listProductSearch: IProductItem[];
  listProductCategory: ICashierCategoriesHasProductResponse[];
}

// Service returns this subset
export interface ICashierProductService {
  cashierProduct_productState: Ref<ICashierProductState>;

  cashierProduct_modalAddEditItem: Ref<ICashierModalAddProduct>;
  cashierProduct_modalCategory: Ref<{ show: boolean }>;

  cashierProduct_selectedProduct: Ref<ICashierSelected[]>;
  cashierProduct_selectedView: Ref<'image' | 'grid' | 'inline'>;

  cashierProduct_selectedProductQty: WritableComputedRef<number, number>;

  cashierProduct_handleSelectCategory: (category: string) => void;
  cashierProduct_handleSelectProduct: (product: IProductItem, item: ICashierModalAddProductItem) => void;

  cashierProduct_onSearchData: () => Promise<void>;
  cashierProduct_handleBarcodeScanned: (barcode: string) => Promise<void>;
  cashierProduct_handleFetchCategory: () => Promise<void>;
  cashierProduct_handleFetchProductCategory: () => Promise<void>;

  isProductActive: (product: IProductItem) => boolean;
  cashierProduct_handleQuantity: (type: 'increase' | 'decrease') => void;
  cashierProduct_handleOpenModalAddProduct: (product: IProductItem) => void;

  // Business type validation for barcode scanning
  isRetailBusinessType: ComputedRef<boolean>;
}

// Provided includes additional properties from other services
export interface ICashierProductProvided extends ICashierProductService {
  cashierProduct_customerState: Ref<ICashierCustomerState>;
  cashierProduct_onScrollFetchMoreCustomers: (event: VirtualScrollerLazyEvent) => void;
  cashierProduct_onSearchCustomer: (search: string) => void;
}
