import { ICashierProduct } from './index';

export interface ICashierProductProvided {
  cashier_food: Ref<ICashierProduct[], ICashierProduct[]>;
  cashier_featured_product: Ref<ICashierProduct[], ICashierProduct[]>;
  cashier_drink: Ref<ICashierProduct[], ICashierProduct[]>;
}
