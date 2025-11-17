// Interfaces
import type { ISelfOrderProvided } from '../interfaces';
import type { 
  ICashierModalAddProduct,
  ICashierModalAddProductItem,
} from '@/modules/cashier/interfaces';
import type { ICashierProductState } from '@/modules/cashier/interfaces/cashier-product-service';
import type { IProductItem } from '@/modules/cashier/interfaces/cashier-response';
import type { ICashierSelected } from '@/modules/cashier/interfaces';

// Stores
import { useCashierStore } from '@/modules/cashier/store';
import { useOutletStore } from '@/modules/outlet/store';

// Router
import { useRoute } from 'vue-router';

// Vue
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';

// Helpers
import { debounce } from '@/app/helpers/debounce.helper';

// Toast
import eventBus from '@/plugins/mitt';
import { EToastPosition, EToastType } from '@/app/constants/toast.constant';

// Services
import { useProductBundlingService } from '@/modules/product-bundling/services/product-bundling.service';

/**
 * @description Closure function that returns everything what we need into an object for SelfOrderUI
 */
export const useSelfOrderService = (): ISelfOrderProvided => {
  /**
   * @description Injected variables
   */
  const store = useCashierStore();
  const storeOutlet = useOutletStore();
  const route = useRoute();
  const { cashierProduct_selectedProduct } = storeToRefs(store);
  const { productBundling_queryParams } = useProductBundlingService();

  /**
   * @description Check if the current outlet business type is retail
   */
  const isRetailBusinessType = computed(() => storeOutlet.outlet_currentOutlet?.businessType === 'Retail');

  /**
   * @description Reactive data binding
   */
  const selfOrder_selectedView = ref<'image' | 'grid' | 'inline'>('image');

  const selfOrder_productState = ref<ICashierProductState>({
    isLoadingCategory: true,
    isLoadingProduct: true,
    listCategory: [],
    listProductCategory: [],
    listProductSearch: [],
    searchProduct: '',
    selectedCategory: '',
  });

  const selfOrder_modalAddEditItem = ref<ICashierModalAddProduct>({
    isAddNotesActive: false,
    item: {
      notes: '',
      quantity: 1,
      variant: {
        id: '',
        name: '',
        price: 0,
      },
    },
    product: null,
    show: false,
  });

  const selfOrder_modalCategory = ref({
    show: false,
  });

  /**
   * @description Computed properties (sorted alphabetically)
   */

  /**
   * @description Computed getters setters, convert qty to string for the v-model purpose
   */
  const selfOrder_selectedProductQty = computed({
    get: () => selfOrder_modalAddEditItem.value.item?.quantity,
    set: (value: string | number) => {
      const qty = typeof value === 'string' ? parseInt(value) : value;
      const productQty = selfOrder_modalAddEditItem.value.product?.price || 1;

      if (qty > productQty) {
        selfOrder_modalAddEditItem.value.item.quantity = productQty;
      } else if (qty < 1) {
        selfOrder_modalAddEditItem.value.item.quantity = 1;
      } else {
        selfOrder_modalAddEditItem.value.item.quantity = qty;
      }
    },
  });

  /**
   * @description Form validations (sorted alphabetically)
   */

  /**
   * @description Functions (sorted alphabetically)
   */

  /**
   * @description Handle barcode scanning from external device
   * This function will search for product by barcode and automatically add it to selectedProduct
   * Only works for 'Retail' business type stores
   * @param {string} barcode - The scanned barcode
   */
  const selfOrder_handleBarcodeScanned = async (barcode: string) => {
    if (!barcode || barcode.length < 3) {
      return;
    }

    // Only allow barcode scanning for Retail business type
    if (!isRetailBusinessType.value) {
      console.warn('Barcode scanning is only available for Retail business type');
      return;
    }

    try {
      selfOrder_productState.value.isLoadingProduct = true;

      // First, trigger search to update the product list if search term matches barcode
      if (selfOrder_productState.value.searchProduct === barcode) {
        await selfOrder_onSearchData();
      }

      let foundProduct: IProductItem | null = null;

      // Look for the product in search results first
      foundProduct =
        selfOrder_productState.value.listProductSearch.find((product: IProductItem) => product.barcode === barcode) || null;

      // If not found in search results, look in category products
      if (!foundProduct) {
        for (const category of selfOrder_productState.value.listProductCategory) {
          const product = category.items.find((item: IProductItem) => item.barcode === barcode);
          if (product) {
            foundProduct = product;
            break;
          }
        }
      }

      // If still not found, try the barcode API as fallback
      if (!foundProduct) {
        try {
          const barcodeResponse = await store.cashierProduct_fetchProductByBarcode(barcode, route);
          if (barcodeResponse.data) {
            foundProduct = barcodeResponse.data;
          }
        } catch (barcodeError) {
          console.error('Error fetching product by barcode:', barcodeError);
        }
      }

      if (foundProduct) {
        let variantToUse: { id: string; name: string; price: number };

        // Check if product has variants
        if (foundProduct.variant && foundProduct.variant.length > 0) {
          variantToUse = {
            id: foundProduct.variant[0].id,
            name: foundProduct.variant[0].name,
            price: foundProduct.variant[0].price,
          };
        } else {
          variantToUse = {
            id: '',
            name: foundProduct.name,
            price: foundProduct.price,
          };
        }

        const item: ICashierModalAddProductItem = {
          notes: '',
          quantity: 1,
          variant: variantToUse,
        };

        // Check if product with same variant already exists in selectedProduct
        const existingProductIndex = cashierProduct_selectedProduct.value.findIndex(
          val => val.product?.id === foundProduct?.id && val.variant?.id === variantToUse.id,
        );

        if (existingProductIndex === -1) {
          // Product doesn't exist, add new
          const newProduct: ICashierSelected = {
            bundling: undefined,
            bundlingId: undefined,
            notes: item.notes,
            product: foundProduct,
            productId: foundProduct.id,
            quantity: item.quantity,
            type: (foundProduct.type ?? 'single') as 'single' | 'bundling',
            variant: item.variant,
            variantId: item.variant?.id || '',
          };

          cashierProduct_selectedProduct.value.push(newProduct);

          // Show success toast
          eventBus.emit('AppBaseToast', {
            isOpen: true,
            message: `Ditambahkan: ${foundProduct.name}`,
            position: EToastPosition.TOP_RIGHT,
            type: EToastType.SUCCESS,
          });
        } else {
          // Product exists, increment quantity
          cashierProduct_selectedProduct.value[existingProductIndex].quantity += 1;

          // Show success toast
          eventBus.emit('AppBaseToast', {
            isOpen: true,
            message: `Ditambahkan: ${foundProduct.name} (${cashierProduct_selectedProduct.value[existingProductIndex].quantity})`,
            position: EToastPosition.TOP_RIGHT,
            type: EToastType.SUCCESS,
          });
        }
      } else {
        // Product not found, show error toast
        eventBus.emit('AppBaseToast', {
          isOpen: true,
          message: `Produk dengan barcode "${barcode}" tidak ditemukan`,
          position: EToastPosition.TOP_RIGHT,
          type: EToastType.WARNING,
        });
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);

      // Show error toast
      eventBus.emit('AppBaseToast', {
        isOpen: true,
        message: 'Terjadi kesalahan saat memproses barcode',
        position: EToastPosition.TOP_RIGHT,
        type: EToastType.DANGER,
      });
    } finally {
      selfOrder_productState.value.isLoadingProduct = false;
    }
  };

  /**
   * @description Handle fetch category
   */
  const selfOrder_handleFetchCategory = async () => {
    selfOrder_productState.value.isLoadingProduct = true;
    try {
      const response = await store.cashierProduct_fetchCategory(route);
      selfOrder_productState.value.listCategory = response.data;
    } catch (error) {
      console.error(error);
    } finally {
      selfOrder_productState.value.isLoadingProduct = false;
    }
  };

  /**
   * @description Handle fetch product category
   */
  const selfOrder_handleFetchProductCategory = async () => {
    selfOrder_productState.value.isLoadingProduct = true;
    try {
      selfOrder_productState.value.listProductSearch = [];

      const selectedCategoryId = selfOrder_productState.value.selectedCategory;

      if (selectedCategoryId == 'bundle') {
        selfOrder_productState.value.listProductCategory = [];
        productBundling_queryParams.search = selfOrder_productState.value.searchProduct;
        return;
      }

      const response = await store.cashierProduct_fetchCategoryProducts(
        selectedCategoryId,
        selfOrder_productState.value.searchProduct,
        route,
      );

      productBundling_queryParams.search = selfOrder_productState.value.searchProduct;

      selfOrder_productState.value.listProductCategory = response.data;
    } catch (error) {
      console.error(error);
    } finally {
      selfOrder_productState.value.isLoadingProduct = false;
    }
  };

  /**
   * @description watch selected category changes
   */
  watch(
    () => selfOrder_productState.value.selectedCategory,
    () => {
      selfOrder_handleFetchProductCategory();
    },
    { deep: true },
  );

  /**
   * @description Handle open modal add product
   * @param {IProductItem} product
   */
  const selfOrder_handleOpenModalAddProduct = (product: IProductItem) => {
    selfOrder_resetModalAddProduct();

    selfOrder_modalAddEditItem.value.product = product;
    selfOrder_modalAddEditItem.value.show = true;

    const existingProduct = cashierProduct_selectedProduct.value.find(val => val.product?.id === product?.id);

    if (existingProduct) {
      selfOrder_modalAddEditItem.value.item = {
        notes: existingProduct.notes,
        quantity: existingProduct.quantity,
        variant: {
          id: existingProduct.variant?.id,
          name: existingProduct.variant?.name,
          price: existingProduct.variant?.price,
        },
      };

      if (existingProduct.notes) {
        selfOrder_modalAddEditItem.value.isAddNotesActive = true;
      }
    }
  };

  /**
   * @description Increase or decrease the quantity of the product
   * @param {'increase' | 'decrease'} type
   */
  const selfOrder_handleQuantity = (type: 'increase' | 'decrease') => {
    if (selfOrder_modalAddEditItem.value.item) {
      if (type === 'increase') {
        selfOrder_modalAddEditItem.value.item.quantity += 1;
      } else {
        selfOrder_modalAddEditItem.value.item.quantity -= 1;
      }
    }
  };

  /**
   * @description Handle select category, add or remove the category from selected category
   * @param {string} category
   */
  const selfOrder_handleSelectCategory = (category: string) => {
    if (category === selfOrder_productState.value.selectedCategory) {
      selfOrder_productState.value.selectedCategory = '';
    } else {
      selfOrder_productState.value.selectedCategory = category;
    }
  };

  /**
   * @description Adds a product to the selected list.
   * If a product with the same variant already exists, increment the quantity by 1
   * If not, add a new product with an initial quantity of 1.
   * @param {IProductItem} product
   * @param {ICashierModalAddProductItem} item
   */
  const selfOrder_handleSelectProduct = (product?: IProductItem, item?: ICashierModalAddProductItem) => {
    if (product && item) {
      const existingProduct = cashierProduct_selectedProduct.value.find(
        val =>
          (val.product?.id === product?.id && item?.variant.id === val.variant?.id) ||
          val.bundling?.id === product?.id,
      );

      if (existingProduct) {
        existingProduct.quantity = item.quantity;
        existingProduct.notes = item.notes;
      } else if ((product.type ?? 'single') === 'single') {
        cashierProduct_selectedProduct.value.push({
          bundling: undefined,
          bundlingId: undefined,
          notes: item.notes,
          product: product,
          productId: product.id,
          quantity: item.quantity,
          type: 'single',
          variant: item.variant,
          variantId: item.variant?.id || '',
        });
      } else if ((product.type ?? 'single') === 'bundling') {
        cashierProduct_selectedProduct.value.push({
          bundling: product,
          bundlingId: product.id,
          notes: item.notes,
          product: undefined,
          productId: undefined,
          quantity: item.quantity,
          type: 'bundling',
          variant: { id: '', name: '', price: 0 },
          variantId: undefined,
        });
      }
    }
  };

  /**
   * @description Checks if a product is currently selected.
   * @param {IProductItem} product
   * @returns {boolean}
   */
  const selfOrder_isProductActive = (product: IProductItem): boolean => {
    return !!cashierProduct_selectedProduct.value.find(val => val.product?.id == product?.id);
  };

  /**
   * @description Handle fetch api self-order search. We call the fetchCategoryProducts function from the store to handle the request.
   */
  const selfOrder_onSearchData = async () => {
    selfOrder_productState.value.isLoadingProduct = true;
    try {
      await selfOrder_handleFetchProductCategory();
    } catch (error) {
      console.error(error);
    } finally {
      selfOrder_productState.value.isLoadingProduct = false;
    }
  };

  /**
   * @description debounce function to handle search data
   */
  const debouncedSearch = debounce(() => selfOrder_onSearchData(), 500);

  /**
   * @description watch search data changes
   */
  watch(
    () => selfOrder_productState.value.searchProduct,
    () => {
      debouncedSearch();
    },
  );

  /**
   * @description watch variant changes
   */
  watch(
    () => selfOrder_modalAddEditItem.value.item.variant,
    newValue => {
      const productExist = cashierProduct_selectedProduct.value.find(val => {
        return (
          val.product?.id === selfOrder_modalAddEditItem.value.product?.id && val.variant?.id === newValue.id
        );
      });

      if (productExist) {
        selfOrder_modalAddEditItem.value.item.quantity = productExist.quantity;
        selfOrder_modalAddEditItem.value.item.notes = productExist.notes;
      } else {
        selfOrder_modalAddEditItem.value.item.quantity = 1;
      }
    },
  );

  /**
   * @description reset modal add product
   */
  const selfOrder_resetModalAddProduct = () => {
    selfOrder_modalAddEditItem.value.show = false;
    selfOrder_modalAddEditItem.value.isAddNotesActive = false;
    selfOrder_modalAddEditItem.value.product = null;
    selfOrder_modalAddEditItem.value.item = {
      notes: '',
      quantity: 1,
      variant: {
        id: '',
        name: '',
        price: 0,
      },
    };
  };

  /**
   * @description Return all the data and methods (sorted alphabetically)
   */
  return {
    isRetailBusinessType,
    isProductActive: selfOrder_isProductActive,
    selfOrder_handleBarcodeScanned,
    selfOrder_handleFetchCategory,
    selfOrder_handleFetchProductCategory,
    selfOrder_handleOpenModalAddProduct,
    selfOrder_handleQuantity,
    selfOrder_handleSelectCategory,
    selfOrder_handleSelectProduct,
    selfOrder_modalAddEditItem,
    selfOrder_modalCategory,
    selfOrder_onSearchData,
    selfOrder_productState,
    selfOrder_selectedProduct: cashierProduct_selectedProduct,
    selfOrder_selectedProductQty,
    selfOrder_selectedView,
  };
};
