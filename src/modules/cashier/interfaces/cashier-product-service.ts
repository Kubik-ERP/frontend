import {
  ICashierProduct,
  ICashierCategory,
  ICashierSelected,
  ICashierModalAddProductItem,
  ICashierModalAddProduct,
} from './index';

export interface ICashierProductProvided {
  cashierProduct_searchData: Ref<string>;
  cashierProduct_isLoading: Ref<boolean>;
  cashierProduct_listCategory: Ref<ICashierCategory[], ICashierCategory[]>;

  cashierProduct_modalAddEditItem: Ref<ICashierModalAddProduct>;

  cashierProduct_listFood: Ref<ICashierProduct[], ICashierProduct[]>;
  cashierProduct_listFeaturedProduct: Ref<ICashierProduct[], ICashierProduct[]>;
  cashierProduct_listDrink: Ref<ICashierProduct[], ICashierProduct[]>;

  cashierProduct_selectedProduct: Ref<ICashierSelected[]>;
  cashierProduct_selectedCategory: Ref<string[]>;
  cashierProduct_selectedView: Ref<'image' | 'grid' | 'inline'>;

  cashierProduct_selectedProductQty: WritableComputedRef<string, string>;

  cashierProduct_handleSelectCategory: (category: string) => void;
  cashierProduct_handleSelectProduct: (product: ICashierProduct, item: ICashierModalAddProductItem) => void;

  cashierProduct_onSearchData: (searchData: string) => Promise<void>;

  isProductActive: (product: ICashierProduct) => boolean;
  cashierProduct_handleQuantity: (type: 'increase' | 'decrease') => void;
  cashierProduct_handleOpenModalAddProduct: (product: ICashierProduct) => void;
}
