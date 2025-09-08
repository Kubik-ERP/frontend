// Helpers
import { debounce } from '@/app/helpers/debounce.helper';

// interfaces
import type { ICashierProductProvided, ICashierProductState } from '../interfaces/cashier-product-service';
import type { ICashierModalAddProduct, ICashierModalAddProductItem } from '../interfaces';

// Store / Pinia
import { storeToRefs } from 'pinia';
import { useCashierStore } from '../store';

// Vue
import { ref } from 'vue';

import { useRoute } from 'vue-router';
import { IProductItem } from '../interfaces/cashier-response';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useCashierProductService = (): ICashierProductProvided => {
  /**
   * @description Injected variables
   */
  const store = useCashierStore();

  const route = useRoute();

  const { cashierProduct_selectedProduct } = storeToRefs(store);

  /**
   * @description Reactive data binding
   */
  const cashierProduct_selectedView = ref<'image' | 'grid' | 'inline'>('image');

  const cashierProduct_productState = ref<ICashierProductState>({
    isLoadingProduct: true,
    isLoadingCategory: true,
    selectedCategory: '',
    searchProduct: '',
    listCategory: [],
    listProductSearch: [],
    listProductCategory: [],
  });

  const cashierProduct_modalAddEditItem = ref<ICashierModalAddProduct>({
    show: false,
    isAddNotesActive: false,
    product: null,
    item: {
      quantity: 1,
      variant: {
        id: '',
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
    @description Handle fetch category
    @param {string} category
  */
  const cashierProduct_handleFetchCategory = async () => {
    cashierProduct_productState.value.isLoadingProduct = true;
    try {
      const response = await store.cashierProduct_fetchCategory(route);

      cashierProduct_productState.value.listCategory = response.data;
    } catch (error) {
      console.error(error);
    } finally {
      cashierProduct_productState.value.isLoadingProduct = false;
    }
  };

  cashierProduct_handleFetchCategory();

  /**
    @description Handle fetch product category
    @param {string} category
  */
  const cashierProduct_handleFetchProductCategory = async () => {
    cashierProduct_productState.value.isLoadingProduct = true;
    try {
      cashierProduct_productState.value.listProductSearch = [];

      const selectedCategoryId = cashierProduct_productState.value.selectedCategory;

      const response = await store.cashierProduct_fetchCategoryProducts(
        selectedCategoryId,
        cashierProduct_productState.value.searchProduct,
        route,
      );

      cashierProduct_productState.value.listProductCategory = response.data;
    } catch (error) {
      console.error(error);
    } finally {
      cashierProduct_productState.value.isLoadingProduct = false;
    }
  };

  cashierProduct_handleFetchProductCategory();

  /**
   * @description watch selected category changes
   */
  watch(
    () => cashierProduct_productState.value.selectedCategory,
    () => {
      cashierProduct_handleFetchProductCategory();
    },
    { deep: true },
  );

  /**
   * @description Handle fetch api cashier search. We call the fetchCashierSearch function from the store to handle the request.
   */
  const cashierProduct_onSearchData = async () => {
    cashierProduct_productState.value.isLoadingProduct = true;
    try {
      await cashierProduct_handleFetchProductCategory();
    } catch (error) {
      console.error(error);
    } finally {
      cashierProduct_productState.value.isLoadingProduct = false;
    }
  };

  /**
   * @description debounce function to handle search data
   */
  const debouncedSearch = debounce(() => cashierProduct_onSearchData(), 500);

  /**
   * @description watch search data changes
   */
  watch(
    () => cashierProduct_productState.value.searchProduct,
    () => {
      debouncedSearch();
    },
  );

  /**
   * @description Handle select category, add or remove the category from selected category
   * @param {string} category
   */
  const cashierProduct_handleSelectCategory = (category: string) => {
    if (category === cashierProduct_productState.value.selectedCategory) {
      cashierProduct_productState.value.selectedCategory = '';
    } else {
      cashierProduct_productState.value.selectedCategory = category;
    }
  };

  /**
   * @description Adds a product to the selected list.
   * If a prodiuct with the same variant alreed already exists, increment the quantity by 1
   *  If not, add a new product with an initial quantity of 1.
   * @param {ICashierProduct} product
   * @param {ICashierVariant} variant
   */
  const cashierProduct_handleSelectProduct = (product?: IProductItem, item?: ICashierModalAddProductItem) => {
    if (product && item) {
      const existingProduct = cashierProduct_selectedProduct.value.find(
        val => val.product?.id === product?.id && item?.variant.id === val.variant?.id,
      );
      

      if (existingProduct) {
        existingProduct.quantity = item.quantity;
        existingProduct.notes = item.notes;
      } else {
        cashierProduct_selectedProduct.value.push({
          product,
          variantId: item.variant.id,
          productId: product.id,
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
  const isProductActive = (product: IProductItem): boolean => {
    return !!cashierProduct_selectedProduct.value.find(val => val.product?.id == product?.id);
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
      const productQty = cashierProduct_modalAddEditItem.value.product?.price || 1;

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
          val.product?.id === cashierProduct_modalAddEditItem.value.product?.id && val.variant?.id === newValue.id
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
        id: '',
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
  const cashierProduct_handleOpenModalAddProduct = (product: IProductItem) => {
    cashierProduct_resetModalAddProduct();

    cashierProduct_modalAddEditItem.value.product = product;
    cashierProduct_modalAddEditItem.value.show = true;

    const existingProduct = cashierProduct_selectedProduct.value.find(val => val.product?.id === product?.id);

    if (existingProduct) {
      cashierProduct_modalAddEditItem.value.item = {
        quantity: existingProduct.quantity,
        variant: {
          id: existingProduct.variant?.id,
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
    cashierProduct_productState,

    cashierProduct_modalAddEditItem,
    cashierProduct_modalCategory,

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
