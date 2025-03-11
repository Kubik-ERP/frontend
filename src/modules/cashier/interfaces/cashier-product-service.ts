import { ICashierProduct, ICashierCategory } from './index';

export interface ICashierProductProvided {
  cashierProduct_searchData: Ref<string>;
  cashierProduct_isLoading: Ref<boolean>;
  cashierProduct_listCategory: Ref<ICashierCategory[], ICashierCategory[]>;

  cashierProduct_listFood: Ref<ICashierProduct[], ICashierProduct[]>;
  cashierProduct_listFeaturedProduct: Ref<ICashierProduct[], ICashierProduct[]>;
  cashierProduct_listDrink: Ref<ICashierProduct[], ICashierProduct[]>;

  cashierProduct_selectedProduct: Ref<ICashierProduct[]>;
  cashierProduct_selectedCategory: Ref<string[]>;
  cashierProduct_selectedView: Ref<'image' | 'grid' | 'inline'>;

  cashierProduct_handleSelectCategory: (category: string) => void;
  cashierProduct_handleSelectProduct: (product: ICashierProduct) => void;

  cashierProduct_onSearchData: (searchData: string) => Promise<void>;
}
