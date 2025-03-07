// Store / Pinia
import { storeToRefs } from 'pinia';
import { useCashierStore } from '../store';

// interfaces
import type { ICashierProductProvided } from '../interfaces/cashier-product-service';

// Vue
import { ref } from 'vue';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useCashierProductService = (): ICashierProductProvided => {
  /**
   * @description Injected variables
   */
  const store = useCashierStore();

  const {
    cashierProduct_listCategory,
    cashierProduct_listFood,
    cashierProduct_listFeaturedProduct,
    cashierProduct_listDrink,
  } = storeToRefs(store);

  /**
   * @description Reactive data binding
   */
  const cashierProduct_searchData = ref<string>('');
  const cashierProduct_isLoading = ref<boolean>(false);
  /**
   * @description Handle fetch api cashier search. We call the fetchCashierSearch function from the store to handle the request.
   */
  const cashierProduct_onSearchData = async (searchData: string) => {
    try {
      await store.cashierProduct_fetchSearch(searchData);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    cashierProduct_isLoading,
    cashierProduct_searchData,
    cashierProduct_listCategory,

    cashierProduct_listDrink,
    cashierProduct_listFeaturedProduct,
    cashierProduct_listFood,

    cashierProduct_onSearchData,
  };
};
