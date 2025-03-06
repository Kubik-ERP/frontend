// Store / Pinia
import { storeToRefs } from 'pinia';
import { useCashierStore } from '../store';

// interfaces
import type { ICashierProductProvided } from '../interfaces/cashier-product-service';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useCashierProductService = (): ICashierProductProvided => {
  /**
   * @description Injected variables
   */
  const store = useCashierStore();

  const { cashier_food, cashier_featured_product, cashier_drink } = storeToRefs(store);

  return {
    cashier_food,
    cashier_featured_product,
    cashier_drink,
  };
};
