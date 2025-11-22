// Constants
import {
  CASHIER_ORDER_TYPE,
  CASHIER_DUMMY_LIST_FLOOR,
  CASHIER_DUMMY_LIST_TABLE,
  CASHIER_PROVIDER,
  CASHIER_DUMMY_PARAMS_SIMULATE_PAYMENT,
} from '@/modules/cashier/constants';
import { EToastPosition, EToastType } from '@/app/constants/toast.constant';

// Helpers
import { debounce } from '@/app/helpers/debounce.helper';

// Interfaces
import type {
  ICashierCustomerState,
  ICashierModalAddProduct,
  ICashierModalAddProductItem,
} from '@/modules/cashier/interfaces';
import type {
  ICashierCalulateEstimationData,
  ICashierListTable,
  ICashierOrderSummary,
  ICashierOrderSummaryData,
  ICashierOrderSummaryModalAddCustomer,
  ICashierOrderSummaryModalAddEdit,
  ICashierOrderSummaryModalCancelOrder,
  ICashierOrderSummaryModalInvoiceDetail,
  ICashierOrderSummaryModalOrderType,
  ICashierOrderSummaryModalPaymentMethod,
  ICashierOrderSummaryModalPlaceOrder,
  ICashierOrderSummaryModalPlaceOrderConfirmation,
  ICashierOrderSummaryModalSelectTable,
  ICashierOrderSummaryModalVoucher,
  ICashierResponseAddCustomer,
  ICashierVoucher,
} from '@/modules/cashier/interfaces/cashier-order-summary';
import type { ICashierCustomer, ICashierResponseWebsocketMessage } from '@/modules/cashier/interfaces/cashier-response';
import type { ICashierProductState } from '@/modules/cashier/interfaces/cashier-product-service';
import type { IProductItem } from '@/modules/cashier/interfaces/cashier-response';
import type { ILoyaltyPointBenefit } from '@/modules/point-configuration/interfaces';
import type { IVoucher } from '@/modules/voucher/interfaces';
import type { MenuPassThroughAttributes } from 'primevue';
import type { MenuItem } from 'primevue/menuitem';
import type { VirtualScrollerLazyEvent } from 'primevue/virtualscroller';
import type { ISelfOrderProvided, ISelfOrderDisplayUser } from '../interfaces';

// Router
import { useRouter, useRoute } from 'vue-router';

// Pinia helpers
import { storeToRefs } from 'pinia';

// Stores
import { useCashierStore } from '@/modules/cashier/store';
import { useOutletStore } from '@/modules/outlet/store';
import { useVoucherStore } from '@/modules/voucher/store';

// Socket
import { useSocket } from '@/plugins/socket';

// Vue
import { computed, onUnmounted, reactive, ref, watch } from 'vue';

// Composables
import { useRbac } from '@/app/composables/useRbac';
import useVuelidate from '@vuelidate/core';
import { minValue, numeric, required } from '@vuelidate/validators';

// Event Bus
import eventBus from '@/plugins/mitt';

// Services
import { useProductBundlingService } from '@/modules/product-bundling/services/product-bundling.service';

/**
 * @description Self-order service with all business logic
 */
export const useSelfOrderService = (): ISelfOrderProvided => {
  /**
   * @description Destructure all the data and methods what we need
   */
  const { productBundling_queryParams } = useProductBundlingService();

  // Router
  const router = useRouter();
  const route = useRoute();

  // RBAC
  const { hasPermission } = useRbac();

  /**
   * @description Injected variables
   */
  const store = useCashierStore();
  const storeOutlet = useOutletStore();
  const storeVoucher = useVoucherStore();
  const voucherData = ref<ICashierVoucher[]>([]);
  const { cashierProduct_selectedProduct } = storeToRefs(store);

  // Socket connection
  const socket = useSocket();

  /**
   * ================================================================
   * REACTIVE STATE - PRODUCT
   * ================================================================
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
   * ================================================================
   * REACTIVE STATE - ORDER SUMMARY
   * ================================================================
   */

  const selfOrder_isShowQuickOverview = ref<boolean>(false);

  const selfOrder_modalOrderSummary = ref({
    show: false,
  });

  const selfOrder_modalOrderType = ref<ICashierOrderSummaryModalOrderType>({
    show: false,
    selectedOrderType: 'dine_in',
    data: CASHIER_ORDER_TYPE.filter(item => (route.name === 'self-order' ? true : item.code !== 'self_order')),
  });

  const selfOrder_customerState = ref<ICashierCustomerState>({
    isLoading: false,
    customerList: [],
    page: 1,
    limit: 20,
    total: 0,
    selectedCustomer: null,
  });

  const selfOrder_selectedLoyaltyBenefitId = ref<string | null>(null);
  const selfOrder_selectedLoyaltyBenefit = ref<ILoyaltyPointBenefit | null>(null);
  const selfOrder_selectedBenefit = ref<ILoyaltyPointBenefit | null>(null);
  const selfOrder_showLoyaltyModal = ref(false);

  /**
   * ================================================================
   * REACTIVE STATE - SELF ORDER DISPLAY USER
   * ================================================================
   */

  const defaultSelfOrderDisplayUser: ISelfOrderDisplayUser = {
    name: 'Guest',
    code: null,
    number: null,
    email: null,
    isGuest: true,
  };

  const selfOrder_displayUser = ref<ISelfOrderDisplayUser>({ ...defaultSelfOrderDisplayUser });

  const selfOrder_modalInvoiceDetail = ref<ICashierOrderSummaryModalInvoiceDetail>({
    show: false,
    value: null,
    form: {
      received_by: '',
      notes: '',
    },
  });

  const selfOrder_modalCancelOrder = ref<ICashierOrderSummaryModalCancelOrder>({
    show: false,
  });

  const selfOrder_modalPaymentMethod = ref<ICashierOrderSummaryModalPaymentMethod>({
    show: false,
    isLoading: false,
    selectedPaymentMethod: '',
    data: [],
  });

  const selfOrder_calculateEstimation = ref<ICashierCalulateEstimationData>({
    isLoading: false,
    data: {
      total: 0,
      subTotal: 0,
      discountTotal: 0,
      totalRedeemDiscount: 0,
      grandTotal: 0,
      serviceCharge: 0,
      roundingAdjustment: 0,
      serviceChargeInclude: false,
      tax: 0,
      taxInclude: false,
      items: [],
      totalProductDiscount: 0,
      voucherAmount: 0,
    },
  });

  const selfOrder_modalSelectTable = ref<ICashierOrderSummaryModalSelectTable>({
    show: false,
    selectedTable: [],
    activeFloor: 1,
    listFloor: CASHIER_DUMMY_LIST_FLOOR,
    data: CASHIER_DUMMY_LIST_TABLE as ICashierListTable[],
  });

  const selfOrder_modalVoucher = ref<ICashierOrderSummaryModalVoucher>({
    show: false,
    form: {
      voucherId: '',
      voucher_code: '',
    },
    search: '',
    get data() {
      return voucherData.value;
    },
  });

  const selfOrder_orderData = ref<ICashierOrderSummaryData>({
    customerName: '',
    orderId: '1234',
    orderType: '',
    tableNumber: '',
    voucherId: '',
    paymentMethod: '',
    isExpanded: true,
    isExpandedVisible: false,
  });

  const selfOrder_modalAddCustomer = ref<ICashierOrderSummaryModalAddCustomer>({
    show: false,
  });

  const selfOrder_modalRegisterCustomer = ref({
    show: false,
  });

  const selfOrder_menuOrder = ref<MenuPassThroughAttributes>({} as MenuPassThroughAttributes);

  const selfOrder_modalMenuOrderItem = ref({
    show: false,
  });

  const selfOrder_menuOrderItem = ref<MenuItem[]>([
    {
      label: 'Cancel Order',
      class: 'text-text-action-error',
      command: () => {
        selfOrder_modalCancelOrder.value.show = true;
      },
    },
  ]);

  const selfOrder_modalAddEditNotes = ref<ICashierOrderSummaryModalAddEdit>({
    show: false,
    item: null,
    tempValue: '',
  });

  const selfOrder_modalPlaceOrderDetail = ref<ICashierOrderSummaryModalPlaceOrderConfirmation>({
    show: false,
    isLoading: false,
    showModalPayment: false,
    data: {},
  });

  const selfOrder_paymentForm = reactive({
    paymentAmount: 0,
  });

  const selfOrder_formRules = {
    paymentAmount: {
      required,
      numeric,
      minValue: minValue(computed(() => selfOrder_calculateEstimation.value.data.grandTotal)),
    },
  };

  const selfOrder_paymentAmountFormValidation = ref(
    useVuelidate(selfOrder_formRules, selfOrder_paymentForm, {
      $autoDirty: true,
    }),
  );

  const selfOrder_isLoadingUnpaidOrder = ref(false);

  const selfOrder_modalPlaceOrderConfirmation = ref<ICashierOrderSummaryModalPlaceOrder>({
    show: false,
    form: {
      payment_method: '',
      amount: 0,
      notes: '',
    },
  });

  /**
   * ================================================================
   * COMPUTED PROPERTIES (Alphabetically sorted)
   * ================================================================
   */

  /**
   * @description Computed property to get active floor tables
   */
  const selfOrder_getListActiveFloor = computed(() => {
    const activeFloor = selfOrder_modalSelectTable.value.data.filter(
      data => data.floor === selfOrder_modalSelectTable.value.activeFloor,
    );
    return activeFloor;
  });

  /**
   * @description Check if user has customer management permission
   */
  const selfOrder_hasCustomerManagementPermission = computed(() => hasPermission('customer_management'));

  /**
   * @description Check if the "Place Order" button should be disabled
   */
  const selfOrder_isButtonPlaceOrderDisabled = computed(() => {
    const isDisabled =
      selfOrder_modalOrderType.value.selectedOrderType === '' || cashierProduct_selectedProduct.value.length === 0;
    return isDisabled;
  });

  /**
   * @description Check if a product is currently selected
   */
  const selfOrder_isProductActive = (product: IProductItem): boolean => {
    return !!cashierProduct_selectedProduct.value.find(val => val.product?.id == product?.id);
  };

  /**
   * @description Check if the current outlet business type is retail
   */
  const selfOrder_isRetailBusinessType = computed(() => storeOutlet.outlet_currentOutlet?.businessType === 'Retail');

  /**
   * @description Check if current route is self-order
   */
  const selfOrder_isSelfOrderRoute = computed(() => route.name === 'self-order');

  /**
   * @description Computed property for loyalty button text
   */
  const selfOrder_loyaltyButtonText = computed(() => {
    if (selfOrder_selectedBenefit.value) {
      return `${selfOrder_selectedBenefit.value.benefitName} (${selfOrder_selectedBenefit.value.pointNeeds} pts)`;
    }
    return 'Redeem Loyalty Point';
  });

  /**
   * @description Computed property for phone display
   */
  const selfOrder_phoneDisplay = computed(() => {
    if (!selfOrder_displayUser.value.number) {
      return null;
    }

    const segments = [selfOrder_displayUser.value.code, selfOrder_displayUser.value.number].filter(Boolean);
    return segments.join(' ');
  });

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
        selfOrder_modalAddEditItem.value.item.quantity = typeof value === 'string' ? parseInt(value) : value;
      }
    },
  });

  /**
   * @description Computed property to summarize order details
   */
  const selfOrder_summary = computed(() => {
    const summary: ICashierOrderSummary = {
      provider: CASHIER_PROVIDER,
      orderType: selfOrder_isRetailBusinessType.value
        ? 'take_away'
        : selfOrder_modalOrderType.value.selectedOrderType,
      invoiceDetail: {
        receivedBy: selfOrder_modalInvoiceDetail.value.form.received_by,
        notes: selfOrder_modalInvoiceDetail.value.form.notes,
      },
      paymentMethod: selfOrder_orderData.value.paymentMethod,
      tableCode: selfOrder_isRetailBusinessType.value ? '' : selfOrder_modalSelectTable.value.selectedTable.toString(),
      selectedVoucher: selfOrder_modalVoucher.value.form.voucherId,
      customerName: selfOrder_customerState.value.selectedCustomer?.id || '',
      product: cashierProduct_selectedProduct.value,
    };
    return summary;
  });

  /**
   * ================================================================
   * HANDLER FUNCTIONS - PRODUCT (Alphabetically sorted with on... prefix)
   * ================================================================
   */

  /**
   * @description Handle barcode scanning from external device
   */
  const selfOrder_onBarcodeScanned = async (barcode: string) => {
    if (!barcode || barcode.length < 3) {
      return;
    }

    if (!selfOrder_isRetailBusinessType.value) {
      console.warn('Barcode scanning is only available for Retail business type');
      return;
    }

    try {
      selfOrder_productState.value.isLoadingProduct = true;

      if (selfOrder_productState.value.searchProduct === barcode) {
        await selfOrder_onSearchData();
      }

      let foundProduct: IProductItem | null = null;

      foundProduct = selfOrder_productState.value.listProductSearch.find(product => product.barcode === barcode) || null;

      if (!foundProduct) {
        for (const category of selfOrder_productState.value.listProductCategory) {
          foundProduct = category.items.find(product => product.barcode === barcode) || null;
          if (foundProduct) break;
        }
      }

      if (!foundProduct) {
        try {
          const response = await store.cashierProduct_fetchProductByBarcode(barcode, route);
          foundProduct = response.data;
        } catch (barcodeError) {
          console.warn('Barcode API also failed:', barcodeError);
        }
      }

      if (foundProduct) {
        let variantToUse: { id: string; name: string; price: number };

        if (foundProduct.variant && foundProduct.variant.length > 0) {
          const firstVariant = foundProduct.variant[0];
          variantToUse = {
            id: firstVariant.id,
            name: firstVariant.name,
            price: firstVariant.price,
          };
        } else {
          variantToUse = {
            id: '',
            name: '',
            price: 0,
          };
        }

        const existingProduct = cashierProduct_selectedProduct.value.find(
          val => val.product?.id === foundProduct?.id && variantToUse.id === val.variant?.id,
        );

        if (existingProduct) {
          existingProduct.quantity += 1;

          eventBus.emit('AppBaseToast', {
            isOpen: true,
            message: `Quantity produk "${foundProduct.name}" ditambah menjadi ${existingProduct.quantity}`,
            position: EToastPosition.TOP_RIGHT,
            type: EToastType.SUCCESS,
          });
        } else {
          const item: ICashierModalAddProductItem = {
            quantity: 1,
            variant: variantToUse,
            notes: '',
          };

          selfOrder_onSelectProduct(foundProduct, item);

          eventBus.emit('AppBaseToast', {
            isOpen: true,
            message: `Produk "${foundProduct.name}" berhasil ditambahkan ke keranjang`,
            position: EToastPosition.TOP_RIGHT,
            type: EToastType.SUCCESS,
          });
        }
      } else {
        eventBus.emit('AppBaseToast', {
          isOpen: true,
          message: `Produk dengan barcode "${barcode}" tidak ditemukan`,
          position: EToastPosition.TOP_RIGHT,
          type: EToastType.DANGER,
        });
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);

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
   * @description Handle calculation of estimation
   */
  const selfOrder_onCalculateEstimation = async (recalculating = false) => {
    selfOrder_calculateEstimation.value.isLoading = true;

    try {
      const response = await store.cashierProduct_calculateEstimation(
        {
          voucherId: selfOrder_modalVoucher.value.form.voucherId || null,
          customerId: selfOrder_customerState.value.selectedCustomer?.id ?? undefined,
          products: selfOrder_summary.value.product,
          orderType: selfOrder_summary.value.orderType,
          redeemLoyalty: selfOrder_selectedLoyaltyBenefitId.value
            ? { loyalty_points_benefit_id: selfOrder_selectedLoyaltyBenefitId.value }
            : undefined,
        },
        route,
      );

      selfOrder_calculateEstimation.value.data = response.data;

      if (!recalculating) {
        await selfOrder_onFetchVoucherActive(
          selfOrder_modalVoucher.value.search,
          cashierProduct_selectedProduct.value.map(p => p.productId ?? p.bundlingId ?? ''),
        );

        const availableVouchers = voucherData.value.filter(v => v.available);

        if (availableVouchers.length > 0) {
          availableVouchers.sort((a, b) => {
            if (a.stock !== b.stock) {
              return a.stock - b.stock;
            }

            const subTotal = selfOrder_calculateEstimation.value.data.subTotal;
            const discountA =
              a.type === 'percentage' ? Math.min((subTotal * a.discount) / 100, a.maxDiscount) : a.discount;
            const discountB =
              b.type === 'percentage' ? Math.min((subTotal * b.discount) / 100, b.maxDiscount) : b.discount;

            return discountB - discountA;
          });

          const bestVoucher = availableVouchers[0];

          if (bestVoucher && !selfOrder_modalVoucher.value.form.voucherId) {
            selfOrder_modalVoucher.value.form.voucherId = bestVoucher.id;
            selfOrder_modalVoucher.value.form.voucher_code = bestVoucher.code;
            await selfOrder_onCalculateEstimation(true);
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      selfOrder_calculateEstimation.value.isLoading = false;
    }
  };

  /**
   * @description Handle cancel order action
   */
  const selfOrder_onCancelOrder = () => {
    selfOrder_summary.value.product = [];
    selfOrder_summary.value.orderType = 'dine_in';
    selfOrder_modalPaymentMethod.value.selectedPaymentMethod = '';
    selfOrder_customerState.value.selectedCustomer = {} as ICashierCustomer;
    selfOrder_modalSelectTable.value.selectedTable = [];
    selfOrder_modalVoucher.value.form = { voucherId: '', voucher_code: '' };
    selfOrder_selectedLoyaltyBenefitId.value = null;
    selfOrder_selectedLoyaltyBenefit.value = null;
    cashierProduct_selectedProduct.value = [];
    selfOrder_modalCancelOrder.value.show = false;
  };

  /**
   * @description Handle quantity increase or decrease
   */
  const selfOrder_onChangeQuantity = (type: 'increase' | 'decrease') => {
    if (selfOrder_modalAddEditItem.value.item) {
      if (type === 'increase') {
        selfOrder_modalAddEditItem.value.item.quantity += 1;
      } else {
        selfOrder_modalAddEditItem.value.item.quantity -= 1;
      }
    }
  };

  /**
   * @description Handle business logic for closing dialog stock overview
   */
  const selfOrder_onCloseDialogStockOverview = () => {
    const argsEventEmitter: IPropsDialog = {
      id: 'cashier-stock-overview-dialog',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: 'w-[1200px]',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle edit order
   */
  const selfOrder_onEditOrder = async () => {
    try {
      const invoiceId = route.params?.invoiceId as string;
      if (!invoiceId) {
        throw new Error('No invoice ID provided in route parameters');
      }

      await store.cashierProduct_handleEditOrder({
        invoiceId,
        products: cashierProduct_selectedProduct.value,
      });

      router.push({
        name: 'invoice',
        params: {
          invoiceId,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch category
   */
  const selfOrder_onFetchCategory = async () => {
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
   * @description Fetches the customer list from the store
   */
  const selfOrder_onFetchCustomerList = async (page: number, search: string = '') => {
    selfOrder_customerState.value.isLoading = true;
    try {
      const response = await store.cashierProduct_fetchCustomers({
        params: {
          page,
          limit: selfOrder_customerState.value.limit,
          search: search || '',
        },
      });

      if (page === 1) {
        selfOrder_customerState.value.customerList = response.data.data;
      } else {
        selfOrder_customerState.value.customerList.push(...response.data.data);
      }

      selfOrder_customerState.value.page = response.data.page;
      selfOrder_customerState.value.total = response.data.total;
    } catch (error) {
      console.error(error);
    } finally {
      selfOrder_customerState.value.isLoading = false;
    }
  };

  /**
   * @description Handle order type selection
   */
  const selfOrder_onFetchPaymentMethod = async () => {
    selfOrder_modalPaymentMethod.value.isLoading = true;

    try {
      const response = await store.cashierProduct_fetchPaymentMethod(route.name === 'self-order', route, {});
      selfOrder_modalPaymentMethod.value.data = response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      selfOrder_modalPaymentMethod.value.isLoading = false;
    }
  };

  /**
   * @description Handle fetch product category
   */
  const selfOrder_onFetchProductCategory = async () => {
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
   * @description Handle voucher selection
   */
  const selfOrder_onFetchVoucherActive = async (search: string, productIds?: string[]) => {
    try {
      const response = await storeVoucher.voucherList_getActiveVoucher(search, productIds ?? [], {}, route);
      const data = response.data;

      voucherData.value = data.map((voucher: IVoucher) => {
        const total = selfOrder_calculateEstimation.value.data.grandTotal;
        const isAmountMatch = total >= voucher.minPrice;
        const isAvailable = isAmountMatch;

        return {
          id: voucher.id,
          code: voucher.promoCode,
          label: voucher.promoCode,
          available: isAvailable,
          discount: voucher.amount,
          minPurchase: voucher.minPrice,
          maxDiscount: voucher.maxPrice,
          validFrom: new Date(voucher.startPeriod).toISOString().split('T')[0],
          validUntil: new Date(voucher.endPeriod).toISOString().split('T')[0],
          type: voucher.isPercent ? 'percentage' : 'nominal',
          stock: voucher.quota || 0,
        };
      });
    } catch (error: unknown) {
      console.error(error);
    }
  };

  /**
   * @description Initialize self-order setup
   */
  const selfOrder_onInitialize = async () => {
    // Self-order specific initialization logic can be added here
  };

  /**
   * @description Initialize route-based setup
   */
  const selfOrder_onInitializeRoute = () => {
    // Route-specific initialization for self-order
  };

  /**
   * @description Handle invoice detail submission
   */
  const selfOrder_onInvoiceDetail = () => {};

  /**
   * @description Handle modal add customer
   */
  const selfOrder_onModalAddCustomer = (response: ICashierResponseAddCustomer | null) => {
    selfOrder_modalAddCustomer.value.show = !selfOrder_modalAddCustomer.value.show;

    if (response) {
      selfOrder_customerState.value.selectedCustomer = response.data;
    }
  };

  /**
   * @description Handle business logic for showing dialog stock overview
   */
  const selfOrder_onOpenDialogStockOverview = async () => {
    const { useInventoryItemsListService } = await import('@/modules/items/services/items-list.service');
    const { inventoryItems_fetchData } = useInventoryItemsListService();

    await inventoryItems_fetchData();

    const argsEventEmitter: IPropsDialog = {
      id: 'cashier-stock-overview-dialog',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: 'w-[1200px]',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle open modal add product
   */
  const selfOrder_onOpenModalAddProduct = (product: IProductItem) => {
    selfOrder_onResetModalAddProduct();

    selfOrder_modalAddEditItem.value.product = product;
    selfOrder_modalAddEditItem.value.show = true;

    const existingProduct = cashierProduct_selectedProduct.value.find(val => val.product?.id === product?.id);

    if (existingProduct) {
      selfOrder_modalAddEditItem.value.item = {
        quantity: existingProduct.quantity,
        variant: {
          id: existingProduct.variant?.id,
          name: existingProduct.variant?.name,
          price: existingProduct.variant?.price,
        },
        notes: existingProduct.notes,
      };

      if (existingProduct.notes) {
        selfOrder_modalAddEditItem.value.isAddNotesActive = true;
      }
    }
  };

  /**
   * @description Handle payment method selection
   */
  const selfOrder_onPaymentMethod = async () => {};

  /**
   * @description Handle place order confirmation
   */
  const selfOrder_onPlaceOrderConfirmation = async () => {
    const getSelectedPaymentMethod = selfOrder_modalPaymentMethod.value.data.find(
      f => f.id === selfOrder_modalPaymentMethod.value.selectedPaymentMethod,
    )?.name;

    switch (getSelectedPaymentMethod?.toUpperCase()) {
      case 'CASH':
        selfOrder_modalPlaceOrderDetail.value.show = true;
        break;
      case 'QRIS':
        await selfOrder_onPlaceOrderDetail();
        selfOrder_modalPlaceOrderConfirmation.value.show = false;
        break;
      case 'DEBIT':
        selfOrder_modalPlaceOrderDetail.value.show = true;
        break;
      case 'CREDIT':
        selfOrder_modalPlaceOrderDetail.value.show = true;
        break;
      case 'PAY AT CASHIER':
        selfOrder_onSaveUnpaidOrder();
        break;
      default:
        console.error('Invalid payment method selected');
        break;
    }
  };

  /**
   * @description Handle placing order detail
   */
  const selfOrder_onPlaceOrderDetail = async () => {
    const getSelectedPaymentMethod = selfOrder_modalPaymentMethod.value.data.find(
      f => f.id === selfOrder_modalPaymentMethod.value.selectedPaymentMethod,
    )?.name;

    selfOrder_modalPlaceOrderDetail.value.show = false;
    selfOrder_modalPlaceOrderDetail.value.isLoading = true;

    const provider =
      getSelectedPaymentMethod?.toUpperCase() === 'CASH' ? 'cash' : selfOrder_summary.value.provider;

    try {
      const params = {
        products: selfOrder_summary.value.product,
        orderType: selfOrder_summary.value.orderType,
        provider: provider,
        paymentMethodId: selfOrder_modalPaymentMethod.value.selectedPaymentMethod,
        customerId: selfOrder_customerState.value.selectedCustomer?.id ?? null,
        tableCode: selfOrder_isRetailBusinessType.value ? '' : selfOrder_summary.value.tableCode,
        storeId: storeOutlet.outlet_currentOutlet?.id || '',
        paymentAmount: selfOrder_paymentForm.paymentAmount || null,
        voucherId: selfOrder_modalVoucher.value.form.voucherId || null,
        rounding_amount: selfOrder_calculateEstimation.value.data.roundingAdjustment || 0,
        redeemLoyalty: selfOrder_selectedLoyaltyBenefitId.value
          ? { loyalty_points_benefit_id: selfOrder_selectedLoyaltyBenefitId.value }
          : undefined,
      };

      const response = await store.cashierProduct_paymentInstant(params, route);

      selfOrder_modalPlaceOrderDetail.value.data = response.data;

      if (getSelectedPaymentMethod?.toUpperCase() === 'CASH') {
        router.push({
          name: route.name === 'cashier' || route.name === 'cashier-order-edit' ? 'invoice' : 'self-order-invoice',
          params: {
            invoiceId: response.data?.invoiceId ?? null,
          },
          query: {
            ...route.query,
          },
        });

        localStorage.removeItem('shoppingCart');
      } else {
        selfOrder_modalPlaceOrderDetail.value.showModalPayment = true;
      }
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      selfOrder_modalPlaceOrderDetail.value.isLoading = false;
    }
  };

  /**
   * @description Reset modal add product
   */
  const selfOrder_onResetModalAddProduct = () => {
    selfOrder_modalAddEditItem.value.show = false;
    selfOrder_modalAddEditItem.value.isAddNotesActive = false;
    selfOrder_modalAddEditItem.value.product = null;
    selfOrder_modalAddEditItem.value.item = {
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
   * @description Handle saving unpaid order
   */
  const selfOrder_onSaveUnpaidOrder = async () => {
    selfOrder_isLoadingUnpaidOrder.value = true;

    try {
      const params = {
        products: selfOrder_summary.value.product,
        orderType: selfOrder_summary.value.orderType,
        paymentMethodId: selfOrder_modalPaymentMethod.value.selectedPaymentMethod,
        voucherId: selfOrder_summary.value.selectedVoucher,
        customerId: selfOrder_customerState.value.selectedCustomer?.id ?? null,
        tableCode: selfOrder_isRetailBusinessType.value ? '' : selfOrder_summary.value.tableCode,
        storeId: storeOutlet.outlet_currentOutlet?.id || '',
        rounding_amount: selfOrder_calculateEstimation.value.data.roundingAdjustment || 0,
        redeemLoyalty: selfOrder_selectedLoyaltyBenefitId.value
          ? { loyalty_points_benefit_id: selfOrder_selectedLoyaltyBenefitId.value }
          : undefined,
      };

      const response = await store.cashierProduct_paymentProcess(params, route);

      store.cashierProduct_selectedProduct = [];

      if (route.name === 'cashier' || route.name === 'cashier-order-edit') {
        router.push({
          name: 'invoice',
          params: {
            invoiceId: response.data?.orderId ?? null,
          },
        });
      } else {
        router.push({
          name: 'self-order-invoice',
          params: {
            invoiceId: response.data?.orderId ?? null,
          },
          query: {
            ...route.query,
          },
        });

        localStorage.removeItem('shoppingCart');
      }
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      selfOrder_isLoadingUnpaidOrder.value = false;
    }
  };

  /**
   * @description Handle search customer
   */
  const selfOrder_onSearchCustomer = (search: string) => {
    selfOrder_customerState.value.page = 1;
    selfOrder_onFetchCustomerList(1, search);
  };

  /**
   * @description Handle fetch cashier search
   */
  const selfOrder_onSearchData = async () => {
    selfOrder_productState.value.isLoadingProduct = true;
    try {
      await selfOrder_onFetchProductCategory();
    } catch (error) {
      console.error(error);
    } finally {
      selfOrder_productState.value.isLoadingProduct = false;
    }
  };

  /**
   * @description Handle on scroll fetch more customers
   */
  const selfOrder_onScrollFetchMoreCustomers = (event: VirtualScrollerLazyEvent) => {
    const { last } = event;

    const customerListLength = selfOrder_customerState.value.customerList.length;
    const totalCustomers = selfOrder_customerState.value.total;
    const isLoading = selfOrder_customerState.value.isLoading;

    if (!isLoading && last >= customerListLength - 1 && customerListLength < totalCustomers) {
      selfOrder_customerState.value.page += 1;
      selfOrder_onFetchCustomerList(selfOrder_customerState.value.page);
    }
  };

  /**
   * @description Handle select category
   */
  const selfOrder_onSelectCategory = (category: string) => {
    if (category === selfOrder_productState.value.selectedCategory) {
      selfOrder_productState.value.selectedCategory = '';
    } else {
      selfOrder_productState.value.selectedCategory = category;
    }
  };

  /**
   * @description Handle select product
   */
  const selfOrder_onSelectProduct = (product?: IProductItem, item?: ICashierModalAddProductItem) => {
    if (product && item) {
      const existingProduct = cashierProduct_selectedProduct.value.find(
        val =>
          (val.product?.id === product?.id && item?.variant.id === val.variant?.id) || val.bundling?.id === product?.id,
      );

      if (existingProduct) {
        existingProduct.quantity = item.quantity;
        existingProduct.notes = item.notes;
      } else if ((product.type ?? 'single') === 'single') {
        cashierProduct_selectedProduct.value.push({
          product,
          variantId: item.variant.id,
          productId: product.id,
          ...item,
          type: product.type ?? 'single',
        });
      } else if ((product.type ?? 'single') === 'bundling') {
        cashierProduct_selectedProduct.value.push({
          ...item,
          bundling: product,
          bundlingId: product.id,
          type: product.type ?? 'single',
          product,
          variantId: item.variant.id,
          productId: product.id,
        });
      }
    }
  };

  /**
   * @description Handle table selection
   */
  const selfOrder_onSelectTable = () => {};

  /**
   * @description Handle voucher selection
   */
  const selfOrder_onSelectVoucher = (id: string) => {
    selfOrder_modalVoucher.value.show = false;
    selfOrder_modalVoucher.value.form.voucherId = id;
    debouncedCalculateEstimation();
  };

  /**
   * @description Set selected loyalty benefit
   */
  const selfOrder_onSetLoyaltyBenefit = (benefit: ILoyaltyPointBenefit | null) => {
    selfOrder_selectedLoyaltyBenefitId.value = benefit?.id ?? null;
    selfOrder_selectedLoyaltyBenefit.value = benefit;
  };

  /**
   * @description Handle simulating payment
   */
  const selfOrder_onSimulatePayment = async (invoiceId: string) => {
    try {
      const params = {
        ...CASHIER_DUMMY_PARAMS_SIMULATE_PAYMENT,
        order_id: invoiceId ?? null,
      };

      await store.cashierProduct_simulatePayment(params, route);
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      selfOrder_modalPlaceOrderDetail.value.isLoading = false;
    }
  };

  /**
   * @description Handle isExpanded toggle
   */
  const selfOrder_onToggleExpanded = () => {
    selfOrder_orderData.value.isExpanded = !selfOrder_orderData.value.isExpanded;
  };

  /**
   * @description Handle table selection toggle
   */
  const selfOrder_onToggleSelectTable = (table: string) => {
    const index = selfOrder_modalSelectTable.value.selectedTable.indexOf(table);

    if (index === -1) {
      selfOrder_modalSelectTable.value.selectedTable.push(table);
    } else {
      selfOrder_modalSelectTable.value.selectedTable.splice(index, 1);
    }
  };

  /**
   * ================================================================
   * ACTIONS - SELF ORDER USER MANAGEMENT (from component)
   * ================================================================
   */

  /**
   * @description Set display user as guest
   */
  const selfOrder_onSetDisplayUserAsGuest = (name: string = defaultSelfOrderDisplayUser.name) => {
    selfOrder_displayUser.value = {
      name,
      code: null,
      number: null,
      email: null,
      isGuest: true,
    };
  };

  /**
   * @description Set display user from customer object
   */
  const selfOrder_onSetDisplayUserFromCustomer = (customer: ICashierCustomer) => {
    selfOrder_displayUser.value = {
      name: customer.name,
      code: customer.code as string | null,
      number: customer.number as string | null,
      email: customer.email as string | null,
      isGuest: false,
    };

    if (selfOrder_customerState.value.selectedCustomer?.id !== customer.id) {
      selfOrder_customerState.value.selectedCustomer = customer;
    }
  };

  /**
   * @description Sync self-order user from localStorage
   */
  const selfOrder_onSyncUserFromStorage = () => {
    if (!selfOrder_isSelfOrderRoute.value || typeof window === 'undefined') {
      return;
    }

    const stored = window.localStorage.getItem('userinfo');

    if (!stored) {
      selfOrder_onSetDisplayUserAsGuest();
      return;
    }

    try {
      const parsed = JSON.parse(stored) as Partial<ICashierCustomer> & { isGuest?: boolean; name?: string };

      if (parsed?.isGuest) {
        selfOrder_onSetDisplayUserAsGuest(parsed.name ?? defaultSelfOrderDisplayUser.name);
        selfOrder_customerState.value.selectedCustomer = null;
        return;
      }

      if (parsed && typeof parsed === 'object' && parsed.name) {
        selfOrder_onSetDisplayUserFromCustomer(parsed as ICashierCustomer);
        return;
      }

      selfOrder_onSetDisplayUserAsGuest();
    } catch (error) {
      console.error('Failed to parse stored user info', error);
      selfOrder_onSetDisplayUserAsGuest();
    }
  };

  /**
   * @description Sign in as guest
   */
  const selfOrder_onSignInAsGuest = () => {
    if (!selfOrder_isSelfOrderRoute.value || typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(
      'userinfo',
      JSON.stringify({ isGuest: true, name: defaultSelfOrderDisplayUser.name }),
    );
    window.localStorage.setItem('shoppingCart', JSON.stringify({}));
    selfOrder_customerState.value.selectedCustomer = null;
    selfOrder_onSetDisplayUserAsGuest();
  };

  /**
   * @description Navigate to self-order login
   */
  const selfOrder_onNavigateToLogin = () => {
    if (!selfOrder_isSelfOrderRoute.value) {
      return;
    }

    router.push({
      name: 'self-order-login',
      query: {
        ...route.query,
        redirect: route.fullPath,
      },
    });
  };

  /**
   * @description Open register customer modal
   */
  const selfOrder_onOpenRegisterCustomerModal = () => {
    selfOrder_modalRegisterCustomer.value.show = true;
  };

  /**
   * @description Close register customer modal
   */
  const selfOrder_onCloseRegisterCustomerModal = () => {
    selfOrder_modalRegisterCustomer.value.show = false;
  };

  /**
   * ================================================================
   * ACTIONS - LOYALTY MANAGEMENT (from component)
   * ================================================================
   */

  /**
   * @description Request customer loyalty point
   */
  const selfOrder_onRequestCustomerLoyaltyPoint = async (customerId: string) => {
    // This method needs access to external services
    // Will be implemented when integrating with loyalty service
    console.log('Request loyalty points for customer:', customerId);
  };

  /**
   * @description Open loyalty modal
   */
  const selfOrder_onOpenLoyaltyModal = async () => {
    // This method needs access to external services
    // Will be implemented when integrating with loyalty service
    selfOrder_showLoyaltyModal.value = true;
  };

  /**
   * @description Close loyalty modal
   */
  const selfOrder_onCloseLoyaltyModal = () => {
    selfOrder_showLoyaltyModal.value = false;
  };

  /**
   * @description Select benefit
   */
  const selfOrder_onSelectBenefit = (benefit: ILoyaltyPointBenefit) => {
    // Only allow selection if user has enough points (will implement with loyalty service)
    selfOrder_selectedBenefit.value = benefit.id === selfOrder_selectedBenefit.value?.id ? null : benefit;
  };

  /**
   * @description Redeem points
   */
  const selfOrder_onRedeemPoints = () => {
    if (selfOrder_selectedBenefit.value) {
      selfOrder_onCloseLoyaltyModal();
    }
  };

  /**
   * @description Initialize loyalty (called on mount)
   */
  const selfOrder_onInitializeLoyalty = async () => {
    // This method needs access to external services
    // Will be implemented when integrating with loyalty service
    console.log('Initialize loyalty');
  };

  /**
   * ================================================================
   * WATCHERS - LIFECYCLE MANAGEMENT (from component)
   * ================================================================
   */

  /**
   * @description Watch route changes
   */
  const selfOrder_onWatchRouteChanges = () => {
    watch(
      () => route.name,
      newName => {
        if (newName === 'self-order') {
          selfOrder_onSyncUserFromStorage();
        }
      },
    );
  };

  /**
   * @description Watch customer changes
   */
  const selfOrder_onWatchCustomerChanges = () => {
    watch(
      () => selfOrder_customerState.value.selectedCustomer?.id,
      newCustomerId => {
        if (!newCustomerId) {
          selfOrder_onSetLoyaltyBenefit(null);
          selfOrder_selectedBenefit.value = null;
          return;
        }

        selfOrder_selectedBenefit.value = null;
      },
      { immediate: true },
    );

    watch(
      () => selfOrder_customerState.value.selectedCustomer,
      newCustomer => {
        if (!selfOrder_isSelfOrderRoute.value) {
          return;
        }

        if (newCustomer) {
          selfOrder_onSetDisplayUserFromCustomer(newCustomer);

          if (typeof window !== 'undefined') {
            window.localStorage.setItem('userinfo', JSON.stringify(newCustomer));
          }

          return;
        }

        if (typeof window === 'undefined') {
          selfOrder_onSetDisplayUserAsGuest();
          return;
        }

        const stored = window.localStorage.getItem('userinfo');

        if (!stored) {
          selfOrder_onSetDisplayUserAsGuest();
          return;
        }

        try {
          const parsed = JSON.parse(stored) as { isGuest?: boolean; name?: string };

          if (parsed?.isGuest) {
            selfOrder_onSetDisplayUserAsGuest(parsed.name ?? defaultSelfOrderDisplayUser.name);
          }
        } catch {
          selfOrder_onSetDisplayUserAsGuest();
        }
      },
      { deep: true },
    );
  };

  /**
   * @description Watch benefit changes
   */
  const selfOrder_onWatchBenefitChanges = () => {
    watch(
      () => selfOrder_selectedBenefit.value,
      benefit => {
        selfOrder_onSetLoyaltyBenefit(benefit ?? null);
      },
      { immediate: true },
    );

    watch(
      () => selfOrder_selectedLoyaltyBenefitId.value,
      benefitId => {
        if (!benefitId) {
          selfOrder_selectedBenefit.value = null;
          return;
        }

        if (selfOrder_selectedLoyaltyBenefit?.value?.id === benefitId) {
          selfOrder_selectedBenefit.value = selfOrder_selectedLoyaltyBenefit.value;
        }
      },
    );
  };

  /**
   * ================================================================
   * DEBOUNCED FUNCTIONS
   * ================================================================
   */

  const debouncedCalculateEstimation = debounce(() => selfOrder_onCalculateEstimation(), 500);
  const debouncedRecalculateWithLoyalty = debounce(() => selfOrder_onCalculateEstimation(true), 300);
  const debouncedSearch = debounce(() => selfOrder_onSearchData(), 500);
  const debouncedHandleWatchChanges = debounce(() => {
    if (selfOrder_modalOrderType.value.selectedOrderType) {
      selfOrder_orderData.value.isExpanded = false;
      selfOrder_orderData.value.isExpandedVisible = true;
    } else {
      selfOrder_orderData.value.isExpanded = true;
      selfOrder_orderData.value.isExpandedVisible = false;
    }
  }, 500);

  /**
   * ================================================================
   * SOCKET SUBSCRIPTIONS
   * ================================================================
   */

  const subscribe = () => {
    const orderId = selfOrder_modalPlaceOrderDetail.value.data?.orderId;
    if (!orderId) return;

    socket.emit('subscribe-invoice', orderId);

    socket.on('payment-success', (data: ICashierResponseWebsocketMessage) => {
      localStorage.removeItem('shoppingCart');

      if (data.orderId === orderId) {
        if (route.name === 'cashier' || route.name === 'cashier-order-edit') {
          router.replace({ name: 'invoice', params: { invoiceId: data?.orderId ?? null } });
        } else {
          router.replace({
            name: 'self-order-invoice',
            params: { invoiceId: data?.orderId ?? null },
            query: { ...route.query },
          });
        }
      }
    });

    socket.on('payment-failed', data => {
      localStorage.removeItem('shoppingCart');

      if (route.name === 'self-order') {
        router.push({ name: 'self-order' });
      }
      if (route.name === 'cashier' || route.name === 'cashier-order-edit') {
        if (data.orderId === orderId) {
          router.replace({ name: 'invoice', params: { invoiceId: data?.orderId ?? null } });
        }
      }
    });
  };

  const unsubscribe = () => {
    const orderId = selfOrder_modalPlaceOrderDetail.value.data?.orderId;
    if (!orderId) return;

    socket.emit('unsubscribe-invoice', orderId);
    socket.off('payment-success');
    socket.off('payment-failed');
  };

  /**
   * ================================================================
   * WATCHERS
   * ================================================================
   */

  // Watch selected category changes
  watch(
    () => selfOrder_productState.value.selectedCategory,
    () => {
      selfOrder_onFetchProductCategory();
    },
    { deep: true },
  );

  // Watch search data changes
  watch(
    () => selfOrder_productState.value.searchProduct,
    () => {
      debouncedSearch();
    },
  );

  // Watch variant changes
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

  // Watch for changes in payment method modal visibility
  watch(
    () => selfOrder_modalPaymentMethod.value.show,
    value => {
      if (value) {
        selfOrder_onFetchPaymentMethod();
      }
    },
  );

  // Watch shopping cart changes
  watch(
    () => cashierProduct_selectedProduct.value,
    () => {
      localStorage.setItem('shoppingCart', JSON.stringify(cashierProduct_selectedProduct.value));
    },
    { deep: true },
  );

  // Watch for voucher modal and product changes
  watch(
    () => [
      cashierProduct_selectedProduct.value,
      selfOrder_modalVoucher.value.show,
      selfOrder_modalVoucher.value.search,
    ],
    async () => {
      if (selfOrder_modalVoucher.value.show && cashierProduct_selectedProduct.value.length > 0) {
        debouncedCalculateEstimation();
        await selfOrder_onFetchVoucherActive(
          selfOrder_modalVoucher.value.search,
          cashierProduct_selectedProduct.value.map(p => p.productId ?? p.bundlingId ?? ''),
        );
      }

      if (selfOrder_modalVoucher.value.form.voucherId) {
        debouncedCalculateEstimation();
      }
    },
  );

  // Watch for order type changes
  watch(
    () => [selfOrder_modalOrderType.value.selectedOrderType],
    () => {
      debouncedHandleWatchChanges();
    },
    { immediate: true, deep: true },
  );

  // Watch for modal add/edit notes changes
  watch(
    () => selfOrder_modalAddEditNotes.value.show,
    value => {
      if (!value) {
        selfOrder_modalAddEditNotes.value.item = null;
      }
    },
  );

  // Watch loyalty benefit changes
  watch(
    () => selfOrder_selectedLoyaltyBenefitId.value,
    () => {
      if (selfOrder_modalOrderType.value.selectedOrderType && cashierProduct_selectedProduct.value.length > 0) {
        debouncedRecalculateWithLoyalty();
      }
    },
  );

  // Watch customer changes
  watch(
    () => selfOrder_customerState.value.selectedCustomer?.id,
    () => {
      if (selfOrder_modalOrderType.value.selectedOrderType && cashierProduct_selectedProduct.value.length > 0) {
        debouncedRecalculateWithLoyalty();
      }
    },
  );

  // Watch calculate estimation changes
  watch(
    () => [cashierProduct_selectedProduct.value, selfOrder_modalOrderType.value.selectedOrderType],
    async () => {
      if (selfOrder_modalOrderType.value.selectedOrderType && cashierProduct_selectedProduct.value.length > 0) {
        selfOrder_modalVoucher.value.form.voucherId = '';
        selfOrder_modalVoucher.value.form.voucher_code = '';
        debouncedCalculateEstimation();
      } else {
        selfOrder_calculateEstimation.value.data = {
          total: 0,
          subTotal: 0,
          discountTotal: 0,
          totalRedeemDiscount: 0,
          grandTotal: 0,
          serviceCharge: 0,
          roundingAdjustment: 0,
          serviceChargeInclude: false,
          tax: 0,
          taxInclude: false,
          items: [],
          totalProductDiscount: 0,
          voucherAmount: 0,
        };
      }
    },
    { deep: true },
  );

  // Watch for visibility of payment modal to manage subscription
  watch(
    () => selfOrder_modalPlaceOrderDetail.value.showModalPayment,
    isVisible => {
      if (isVisible) {
        subscribe();
      } else {
        unsubscribe();
      }
    },
  );

  /**
   * ================================================================
   * CLEANUP
   * ================================================================
   */

  onUnmounted(() => {
    unsubscribe();
  });

  /**
   * ================================================================
   * RETURN (Alphabetically sorted with selfOrder_ prefix)
   * ================================================================
   */

  return {
    // State - Product
    selfOrder_calculateEstimation,
    selfOrder_customerState,
    selfOrder_data: selfOrder_orderData,
    selfOrder_isLoadingUnpaidOrder,
    selfOrder_isShowQuickOverview,
    selfOrder_menuOrder,
    selfOrder_menuOrderItem,
    selfOrder_paymentAmountFormValidation,
    selfOrder_paymentForm,
    selfOrder_productState,
    selfOrder_selectedProduct: cashierProduct_selectedProduct,
    selfOrder_selectedProductQty,
    selfOrder_selectedView,
    selfOrder_summary,

    // State - Loyalty
    selfOrder_selectedLoyaltyBenefit,
    selfOrder_selectedLoyaltyBenefitId,
    selfOrder_selectedBenefit,
    selfOrder_showLoyaltyModal,

    // State - Self Order Display User
    selfOrder_displayUser,
    selfOrder_isSelfOrderRoute,
    selfOrder_phoneDisplay,
    selfOrder_loyaltyButtonText,

    // Modals
    selfOrder_modalAddCustomer,
    selfOrder_modalRegisterCustomer,
    selfOrder_modalAddEditItem,
    selfOrder_modalAddEditNotes,
    selfOrder_modalCancelOrder,
    selfOrder_modalCategory,
    selfOrder_modalInvoiceDetail,
    selfOrder_modalMenuOrderItem,
    selfOrder_modalOrderSummary,
    selfOrder_modalOrderType,
    selfOrder_modalPaymentMethod,
    selfOrder_modalPlaceOrderConfirmation,
    selfOrder_modalPlaceOrderDetail,
    selfOrder_modalSelectTable,
    selfOrder_modalVoucher,

    // Computed
    selfOrder_getListActiveFloor,
    selfOrder_hasCustomerManagementPermission,
    selfOrder_isButtonPlaceOrderDisabled,
    selfOrder_isProductActive,
    isProductActive: selfOrder_isProductActive,
    selfOrder_isRetailBusinessType,

    // Actions - Product (with handle* aliases for backward compatibility)
    selfOrder_onBarcodeScanned,
    selfOrder_handleBarcodeScanned: selfOrder_onBarcodeScanned,
    selfOrder_onChangeQuantity,
    selfOrder_handleQuantity: selfOrder_onChangeQuantity,
    selfOrder_onFetchCategory,
    selfOrder_onFetchProductCategory,
    selfOrder_onOpenModalAddProduct,
    selfOrder_handleOpenModalAddProduct: selfOrder_onOpenModalAddProduct,
    selfOrder_onSearchCustomer,
    selfOrder_onSearchData,
    selfOrder_onScrollFetchMoreCustomers,
    selfOrder_onSelectCategory,
    selfOrder_handleSelectCategory: selfOrder_onSelectCategory,
    selfOrder_onSelectProduct,
    selfOrder_handleSelectProduct: selfOrder_onSelectProduct,

    // Actions - Order
    selfOrder_onCancelOrder,
    selfOrder_handleCancelOrder: selfOrder_onCancelOrder,
    selfOrder_onCloseDialogStockOverview,
    selfOrder_onEditOrder,
    selfOrder_handleEditOrder: selfOrder_onEditOrder,
    selfOrder_onFetchPaymentMethod,
    selfOrder_onInvoiceDetail,
    selfOrder_handleInvoiceDetail: selfOrder_onInvoiceDetail,
    selfOrder_onModalAddCustomer,
    selfOrder_onOpenDialogStockOverview,
    selfOrder_onPaymentMethod,
    selfOrder_handlePaymentMethod: selfOrder_onPaymentMethod,
    selfOrder_onPlaceOrderConfirmation,
    selfOrder_handlePlaceOrderConfirmation: selfOrder_onPlaceOrderConfirmation,
    selfOrder_onPlaceOrderDetail,
    selfOrder_handlePlaceOrderDetail: selfOrder_onPlaceOrderDetail,
    selfOrder_onSaveUnpaidOrder,
    selfOrder_handleSaveUnpaidOrder: selfOrder_onSaveUnpaidOrder,
    selfOrder_onSelectTable,
    selfOrder_handleSelectTable: selfOrder_onSelectTable,
    selfOrder_onSelectVoucher,
    selfOrder_handleVoucher: selfOrder_onSelectVoucher,
    selfOrder_onSetLoyaltyBenefit,
    selfOrder_onSimulatePayment,
    selfOrder_onToggleExpanded,
    selfOrder_onToggleSelectTable,
    selfOrder_handleToggleSelectTable: selfOrder_onToggleSelectTable,

    // Actions - Self Order User Management
    selfOrder_onSetDisplayUserAsGuest,
    selfOrder_onSetDisplayUserFromCustomer,
    selfOrder_onSyncUserFromStorage,
    selfOrder_onSignInAsGuest,
    selfOrder_onNavigateToLogin,
    selfOrder_onOpenRegisterCustomerModal,
    selfOrder_onCloseRegisterCustomerModal,

    // Actions - Loyalty Management
    selfOrder_onRequestCustomerLoyaltyPoint,
    selfOrder_onOpenLoyaltyModal,
    selfOrder_onCloseLoyaltyModal,
    selfOrder_onSelectBenefit,
    selfOrder_onRedeemPoints,
    selfOrder_onInitializeLoyalty,

    // Watchers - Lifecycle Management
    selfOrder_onWatchRouteChanges,
    selfOrder_onWatchCustomerChanges,
    selfOrder_onWatchBenefitChanges,

    // Initialization
    selfOrder_onInitialize,
    selfOrder_onInitializeRoute,
  };
};