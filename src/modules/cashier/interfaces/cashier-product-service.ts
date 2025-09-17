import { ICashierCategoriesData, ICashierCategoriesHasProductResponse, IProductItem } from './cashier-response';

import { ICashierSelected, ICashierModalAddProductItem, ICashierModalAddProduct } from './index';

export interface ICashierProductState {
  isLoadingProduct: boolean;
  isLoadingCategory: boolean;
  selectedCategory: string;
  searchProduct: string;
  listCategory: ICashierCategoriesData[];
  listProductSearch: IProductItem[];
  listProductCategory: ICashierCategoriesHasProductResponse[];
}

export interface ICashierProductProvided {
  cashierProduct_productState: Ref<ICashierProductState>;

  cashierProduct_modalAddEditItem: Ref<ICashierModalAddProduct>;
  cashierProduct_modalCategory: Ref<{ show: boolean }>;

  cashierProduct_selectedProduct: Ref<ICashierSelected[]>;
  cashierProduct_selectedView: Ref<'image' | 'grid' | 'inline'>;

  cashierProduct_selectedProductQty: WritableComputedRef<number, number>;

  cashierProduct_handleSelectCategory: (category: string) => void;
  cashierProduct_handleSelectProduct: (product: IProductItem, item: ICashierModalAddProductItem) => void;

  cashierProduct_onSearchData: (searchData: string) => Promise<void>;
  cashierProduct_handleBarcodeScanned: (barcode: string) => Promise<void>;

  isProductActive: (product: IProductItem) => boolean;
  cashierProduct_handleQuantity: (type: 'increase' | 'decrease') => void;
  cashierProduct_handleOpenModalAddProduct: (product: IProductItem) => void;
}
