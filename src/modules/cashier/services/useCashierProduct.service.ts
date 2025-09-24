// Interfaces
import type { ICashierProductProvided, ICashierProductState } from '../interfaces/cashier-product-service';
import type { ICashierModalAddProduct, ICashierModalAddProductItem } from '../interfaces';
import type { IProductItem } from '../interfaces/cashier-response';

// Store / Pinia
import { storeToRefs } from 'pinia';
import { useCashierStore } from '../store';
import { useOutletStore } from '@/modules/outlet/store';

// Toast
import eventBus from '@/plugins/mitt';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useCashierProductService = (): ICashierProductProvided => {
  /**
   * @description Injected variables
   */
  const store = useCashierStore();
  const storeOutlet = useOutletStore();

  const route = useRoute();

  const { cashierProduct_selectedProduct } = storeToRefs(store);

  /**
   * @description Check if the current outlet business type is retail
   */
  const isRetailBusinessType = computed(() => storeOutlet.outlet_currentOutlet?.businessType === 'Retail');

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
   * @description Handle barcode scanning from external device
   * This function will search for product by barcode and automatically add it to selectedProduct
   * Only works for 'Retail' business type stores
   * @param {string} barcode - The scanned barcode
   */
  const cashierProduct_handleBarcodeScanned = async (barcode: string) => {
    console.log('cashierProduct_handleBarcodeScanned called with barcode:', barcode); // Debug log

    if (!barcode || barcode.length < 3) {
      console.log('Barcode too short or empty, returning'); // Debug log
      return;
    }

    // Only allow barcode scanning for Retail business type
    if (!isRetailBusinessType.value) {
      console.warn('Barcode scanning is only available for Retail business type');
      return;
    }

    console.log('Starting barcode scan process for:', barcode); // Debug log

    try {
      cashierProduct_productState.value.isLoadingProduct = true;

      // First, trigger search to update the product list if search term matches barcode
      if (cashierProduct_productState.value.searchProduct === barcode) {
        await cashierProduct_onSearchData();
      }

      let foundProduct: IProductItem | null = null;

      console.log(
        'Current search results:',
        cashierProduct_productState.value.listProductSearch,
        'for barcode:',
        barcode,
      );

      // Look for the product in search results first
      foundProduct =
        cashierProduct_productState.value.listProductSearch.find(product => product.barcode === barcode) || null;

      console.log('foundProduct from search results:', foundProduct);

      // If not found in search results, look in category products
      if (!foundProduct) {
        console.log('Not found in search results, checking category products...');
        for (const category of cashierProduct_productState.value.listProductCategory) {
          foundProduct = category.items.find(product => product.barcode === barcode) || null;
          if (foundProduct) {
            console.log('Found product in category:', category, foundProduct);
            break;
          }
        }
      }

      // If still not found, try the barcode API as fallback
      if (!foundProduct) {
        try {
          const response = await store.cashierProduct_fetchProductByBarcode(barcode, route);
          foundProduct = response.data;
        } catch (barcodeError) {
          console.warn('Barcode API also failed:', barcodeError);
        }
      }

      if (foundProduct) {
        let item: ICashierModalAddProductItem;

        // Check if product has variants
        if (foundProduct.variant && foundProduct.variant.length > 0) {
          // Get the first variant if available
          const firstVariant = foundProduct.variant[0];

          item = {
            quantity: 1,
            variant: {
              id: firstVariant.id,
              name: firstVariant.name,
              price: firstVariant.price,
            },
            notes: '',
          };
        } else {
          // Handle products without variants
          item = {
            quantity: 1,
            variant: {
              id: '',
              name: '',
              price: 0,
            },
            notes: '',
          };
        }

        // Add product to selected products (only from barcode scanner)
        cashierProduct_handleSelectProduct(foundProduct, item);

        // Show success message
        eventBus.emit('AppBaseToast', {
          isOpen: true,
          message: `Produk "${foundProduct.name}" berhasil ditambahkan ke keranjang`,
          position: EToastPosition.TOP_RIGHT,
          type: EToastType.SUCCESS,
        });

        console.log(`Product "${foundProduct.name}" added to cart via barcode scan`);
      } else {
        // Product not found, show error message
        eventBus.emit('AppBaseToast', {
          isOpen: true,
          message: `Produk dengan barcode "${barcode}" tidak ditemukan`,
          position: EToastPosition.TOP_RIGHT,
          type: EToastType.DANGER,
        });

        console.warn(`Product with barcode "${barcode}" not found`);
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
    cashierProduct_handleBarcodeScanned,

    isProductActive,
    cashierProduct_handleQuantity,
    cashierProduct_handleOpenModalAddProduct,

    isRetailBusinessType,
  };
};
