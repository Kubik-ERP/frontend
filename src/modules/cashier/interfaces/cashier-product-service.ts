import { ICashierProduct } from './index';

export interface ICashierProductProvided {
  cashier_listFood: Ref<ICashierProduct[], ICashierProduct[]>;
  cashier_listFeaturedProduct: Ref<ICashierProduct[], ICashierProduct[]>;
  cashier_listDrink: Ref<ICashierProduct[], ICashierProduct[]>;
}
