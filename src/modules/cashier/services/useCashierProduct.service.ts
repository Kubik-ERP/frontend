// Store / Pinia
import { storeToRefs } from 'pinia';
import { useCashierStore } from '../store';

// interfaces
import type { ICashierProductProvided } from '../interfaces/cashier-product-service';
import type { ICashierProduct } from '../interfaces';

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

  const cashierProduct_selectedView = ref<'image' | 'grid' | 'inline'>('image');
  const cashierProduct_selectedProduct = ref<ICashierProduct[]>([]);
  const cashierProduct_selectedCategory = ref<string[]>([]);

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

  /**
   * @description Handle select category, add or remove the category from selected category
   * @param {string} category
   */
  const cashierProduct_handleSelectCategory = (category: string) => {
    if (cashierProduct_selectedCategory.value.includes(category)) {
      cashierProduct_selectedCategory.value = cashierProduct_selectedCategory.value.filter(
        item => item !== category,
      );
    } else {
      cashierProduct_selectedCategory.value.push(category);
    }
  };

  /**
   * @description Handle select product, add or remove the product from selected product
   * @param {ICashierProduct} product
   */
  const cashierProduct_handleSelectProduct = (product: ICashierProduct) => {
    if (cashierProduct_selectedProduct.value.includes(product)) {
      cashierProduct_selectedProduct.value = cashierProduct_selectedProduct.value.filter(item => item !== product);
    } else {
      cashierProduct_selectedProduct.value.push(product);
    }
  };

  return {
    cashierProduct_isLoading,
    cashierProduct_searchData,
    cashierProduct_listCategory,

    cashierProduct_listDrink,
    cashierProduct_listFeaturedProduct,
    cashierProduct_listFood,

    cashierProduct_selectedCategory,
    cashierProduct_selectedView,
    cashierProduct_selectedProduct,

    cashierProduct_handleSelectCategory,
    cashierProduct_handleSelectProduct,

    cashierProduct_onSearchData,
  };
};
