// Helpers
import { debounce } from '@/app/helpers/debounce.helper';

// interfaces
import type { ICashierProductProvided } from '../interfaces/cashier-product-service';
import type { ICashierModalAddProduct, ICashierModalAddProductItem, ICashierProduct } from '../interfaces';

// Store / Pinia
import { storeToRefs } from 'pinia';
import { useCashierStore } from '../store';

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
    cashierProduct_selectedProduct,
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
  const cashierProduct_selectedCategory = ref<string[]>([]);

  const cashierProduct_modalAddEditItem = ref<ICashierModalAddProduct>({
    show: false,
    isAddNotesActive: false,
    product: null,
    item: {
      quantity: 1,
      variant: {
        variantId: '0',
        name: '',
        price: 0,
      },
      notes: '',
    },
  });

  const cashierProduct_modalCategory = ref({
    show: false,
  });

  /**
   * @description Handle fetch api cashier search. We call the fetchCashierSearch function from the store to handle the request.
   */
  const cashierProduct_onSearchData = async (searchData: string) => {
    cashierProduct_isLoading.value = true;
    try {
      await store.cashierProduct_fetchSearch(searchData);
    } catch (error) {
      console.error(error);
    } finally {
      cashierProduct_isLoading.value = false;
    }
  };

  /**
   * @description debounce function to handle search data
   */
  const debouncedSearch = debounce(val => cashierProduct_onSearchData(val), 500);

  /**
   * @description watch search data changes
   */
  watch(
    () => cashierProduct_searchData.value,
    newValue => {
      debouncedSearch(newValue);
    },
  );

  /**
    @description Handle fetch category
    @param {string} category
  */
  const cashierProduct_handleFetchCategory = async () => {
    cashierProduct_isLoading.value = true;
    try {
      await store.cashierProduct_fetchCategory(cashierProduct_selectedCategory.value[0] || '');
    } catch (error) {
      console.error(error);
    } finally {
      cashierProduct_isLoading.value = false;
    }
  };

  cashierProduct_handleFetchCategory();

  /**
    @description Handle fetch product category
    @param {string} category
  */
  const cashierProduct_handleFetchProductCategory = async () => {
    cashierProduct_isLoading.value = true;
    try {
      await store.cashierProduct_fetchCategory(cashierProduct_selectedCategory.value[0] || '');
    } catch (error) {
      console.error(error);
    } finally {
      cashierProduct_isLoading.value = false;
    }
  };

  cashierProduct_handleFetchProductCategory();

  /**
   * @description watch selected category changes
   */
  watch(
    () => cashierProduct_selectedCategory.value,
    newValue => {
      if (newValue.length > 0) {
        cashierProduct_handleFetchProductCategory();
      }
    },
    { immediate: true, deep: true },
  );

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
      // cashierProduct_selectedCategory.value.push(category);
      cashierProduct_selectedCategory.value = [category];
    }
  };

  /**
   * @description Adds a product to the selected list.
   * If a prodiuct with the same variant alreed already exists, increment the quantity by 1
   *  If not, add a new product with an initial quantity of 1.
   * @param {ICashierProduct} product
   * @param {ICashierVariant} variant
   */
  const cashierProduct_handleSelectProduct = (product?: ICashierProduct, item?: ICashierModalAddProductItem) => {
    if (product && item) {
      const existingProduct = cashierProduct_selectedProduct.value.find(
        val => val.product?.productId === product?.productId && item?.variant.variantId === val.variant?.variantId,
      );

      if (existingProduct) {
        existingProduct.quantity = item.quantity;
        existingProduct.notes = item.notes;
      } else {
        cashierProduct_selectedProduct.value.push({
          product,
          variantId: item.variant.variantId,
          productId: product.productId,
          ...item,
        });
      }
    }
  };

  /**
   * @description Checks if a product is currently selected.
   *
   * @param {ICashierProduct} product
   * @returns {boolan}
   */
  const isProductActive = (product: ICashierProduct): boolean => {
    return !!cashierProduct_selectedProduct.value.find(val => val.product?.productId == product?.productId);
  };

  /**
   * @description Increase or decrease the quantity of the product
   * @param {ICashierProduct} product
   * @param {number} qty
   * @param {'increase' | 'decrease'}
   */
  const cashierProduct_handleQuantity = (type: 'increase' | 'decrease') => {
    if (cashierProduct_modalAddEditItem.value.item) {
      if (type === 'increase') {
        cashierProduct_modalAddEditItem.value.item.quantity += 1;
      } else {
        cashierProduct_modalAddEditItem.value.item.quantity -= 1;
      }
    }
  };

  /**
   * @description computed getters setters, convert qty to string for the v-model purpose
   */
  const cashierProduct_selectedProductQty = computed({
    get: () => cashierProduct_modalAddEditItem.value.item?.quantity,
    set: (value: string) => {
      const qty = parseInt(value);
      const productQty = cashierProduct_modalAddEditItem.value.product?.quantity || 1;

      if (qty > productQty) {
        cashierProduct_modalAddEditItem.value.item.quantity = productQty;
      } else if (qty < 1) {
        cashierProduct_modalAddEditItem.value.item.quantity = 1;
      } else {
        cashierProduct_modalAddEditItem.value.item.quantity = parseInt(value);
      }
    },
  });

  /**
   * @description watch variant changes
   */
  watch(
    () => cashierProduct_modalAddEditItem.value.item.variant,
    newValue => {
      const productExist = cashierProduct_selectedProduct.value.find(val => {
        return (
          val.product?.productId === cashierProduct_modalAddEditItem.value.product?.productId &&
          val.variant?.variantId === newValue.variantId
        );
      });

      if (productExist) {
        cashierProduct_modalAddEditItem.value.item.quantity = productExist.quantity;
        cashierProduct_modalAddEditItem.value.item.notes = productExist.notes;
      } else {
        cashierProduct_modalAddEditItem.value.item.quantity = 1;
      }
    },
  );

  /**
   * @description reset modal add product
   */
  const cashierProduct_resetModalAddProduct = () => {
    cashierProduct_modalAddEditItem.value.show = false;
    cashierProduct_modalAddEditItem.value.isAddNotesActive = false;
    cashierProduct_modalAddEditItem.value.product = null;
    cashierProduct_modalAddEditItem.value.item = {
      quantity: 1,
      variant: {
        variantId: '0',
        name: '',
        price: 0,
      },
      notes: '',
    };
  };

  /**
   * @description handle open modal add product
   * @param {ICashierProduct} product
   */
  const cashierProduct_handleOpenModalAddProduct = (product: ICashierProduct) => {
    cashierProduct_resetModalAddProduct();

    cashierProduct_modalAddEditItem.value.product = product;
    cashierProduct_modalAddEditItem.value.show = true;

    const existingProduct = cashierProduct_selectedProduct.value.find(
      val => val.product?.productId === product?.productId,
    );

    if (existingProduct) {
      cashierProduct_modalAddEditItem.value.item = {
        quantity: existingProduct.quantity,
        variant: {
          variantId: existingProduct.variant?.variantId,
          name: existingProduct.variant?.name,
          price: existingProduct.variant?.price,
        },
        notes: existingProduct.notes,
      };

      if (existingProduct.notes) {
        cashierProduct_modalAddEditItem.value.isAddNotesActive = true;
      }
    }
  };

  return {
    cashierProduct_isLoading,
    cashierProduct_searchData,
    cashierProduct_listCategory,

    cashierProduct_modalAddEditItem,
    cashierProduct_modalCategory,

    cashierProduct_listDrink,
    cashierProduct_listFeaturedProduct,
    cashierProduct_listFood,

    cashierProduct_selectedCategory,
    cashierProduct_selectedView,
    cashierProduct_selectedProduct,

    cashierProduct_selectedProductQty,

    cashierProduct_handleSelectCategory,
    cashierProduct_handleSelectProduct,

    cashierProduct_onSearchData,

    isProductActive,
    cashierProduct_handleQuantity,
    cashierProduct_handleOpenModalAddProduct,
  };
};
