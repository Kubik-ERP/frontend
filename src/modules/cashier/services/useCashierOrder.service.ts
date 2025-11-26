// Constants
import {
  CASHIER_PROVIDER,
  CASHIER_ORDER_TYPE,
  CASHIER_DUMMY_LIST_FLOOR,
  CASHIER_DUMMY_LIST_TABLE,
} from '../constants';

// Helpers
import { debounce } from '@/app/helpers/debounce.helper';

// Interfaces
import {
  ICashierCalulateEstimationData,
  ICashierListTable,
  ICashierOrderSummary,
  ICashierOrderSummaryData,
  ICashierOrderSummaryModalAddEdit,
  ICashierOrderSummaryModalCancelOrder,
  ICashierOrderSummaryModalInvoiceDetail,
  ICashierOrderSummaryModalOrderType,
  ICashierOrderSummaryModalPaymentMethod,
  ICashierOrderSummaryModalPlaceOrder,
  ICashierOrderSummaryModalPlaceOrderConfirmation,
  ICashierOrderSummaryModalSelectTable,
  ICashierOrderSummaryModalVoucher,
  ICashierVoucher,
} from '../interfaces/cashier-order-summary';

import { ICashierSelected, ICashierCustomerState } from '../interfaces';
import { ILoyaltyPointBenefit, IDiscount, IFreeItems } from '@/modules/point-configuration/interfaces';
import { IInvoiceDetail } from '@/modules/invoice/interfaces';
import { ICashierOrderProvided } from '../interfaces/cashier-order.interface';

// Router
import { useRouter, useRoute } from 'vue-router';

// Pinia helpers
import { storeToRefs } from 'pinia';

// Stores
import { useCashierStore } from '../store';
import { useInvoiceStore } from '@/modules/invoice/store';
import { useOutletStore } from '@/modules/outlet/store';

// Vue
import { computed, reactive, ref, watch, type Ref, type Reactive } from 'vue';

export const useCashierOrderService = (): ICashierOrderProvided => {
  /**
   * @description Destructure all the data and methods what we need
   */
  // Router
  const router = useRouter();
  const route = useRoute();

  /**
   * @description Injected variables
   */
  const store = useCashierStore();
  const storeOutlet = useOutletStore();
  const storeInvoice = useInvoiceStore();
  const { cashierProduct_selectedProduct } = storeToRefs(store);

  /**
   * @description Check if the current outlet business type is retail
   */
  const cashierOrder_isRetailBusinessType = computed(
    () => storeOutlet.outlet_currentOutlet?.businessType === 'Retail',
  );

  const mapInvoiceDetailVariant = (detail: IInvoiceDetail) =>
    detail.variant
      ? reactive<ICashierSelected['variant']>({
          id: detail.variant.id,
          name: detail.variant.name,
          price: detail.variant.price,
        })
      : reactive<ICashierSelected['variant']>({
          id: detail.variantId ?? '',
          name: '',
          price: detail.variantPrice ?? 0,
        });

  const mapInvoiceDetailProduct = (detail: IInvoiceDetail) =>
    reactive({
      id: detail.productId ?? detail.catalogBundling?.id ?? '',
      name: detail.products?.name ?? detail.catalogBundling?.name ?? '',
      price: detail.products?.price ?? detail.productPrice ?? detail.catalogBundling?.price ?? 0,
      discountPrice: detail.products?.discountPrice ?? detail.catalogBundling?.price ?? detail.productPrice ?? 0,
      pictureUrl: detail.products?.pictureUrl ?? detail.catalogBundling?.pictureUrl ?? '',
      isPercent: detail.products?.isPercent ?? false,
      quantity: null,
      variantHasProducts: null,
      categoriesHasProducts: null,
      description: detail.catalogBundling?.description,
      discount: detail.catalogBundling?.discount as unknown as number | null,
      type: detail.catalogBundling?.type,
      bundlingType: detail.catalogBundling?.type,
      products: (detail.invoiceBundlingItems ?? []).map(item => ({
        product_id: item.productId,
        quantity: item.qty,
        name: item.products?.name ?? '',
        price: item.products?.price ?? 0,
      })),
      variant: detail.variant
        ? [
            {
              id: detail.variant.id,
              name: detail.variant.name,
              price: detail.variant.price,
              productsId: detail.productId ?? '',
            },
          ]
        : [],
    });

  const mapInvoiceDetailToSelected = (detail: IInvoiceDetail): ICashierSelected => {
    const variant = mapInvoiceDetailVariant(detail);
    const product = mapInvoiceDetailProduct(detail);

    if (detail.catalogBundling) {
      return {
        type: 'bundling',
        product,
        bundling: product,
        bundlingId: detail.catalogBundling.id,
        productId: detail.catalogBundling.id,
        variant,
        variantId: variant.id,
        quantity: detail.qty,
        notes: detail.notes ?? '',
      };
    }

    return {
      type: detail.productPrice == 0 ? 'redeem' : 'single',
      product: {
        ...product,
        price: detail.productPrice,
      },
      variant,
      productId: detail.productId ?? '',
      variantId: variant.id,
      quantity: detail.qty,
      notes: detail.notes ?? '',
    };
  };

  /**
   * @description Reactive data binding
   */
  const cashierOrder_isShowQuickOverview = ref<boolean>(false);

  const cashierOrder_modalOrderSummary = ref({
    show: false,
  });

  // Reactive data binding
  const cashierOrder_modalOrderType = ref<ICashierOrderSummaryModalOrderType>({
    show: false,
    selectedOrderType: 'dine_in',
    data: CASHIER_ORDER_TYPE.filter(item => item.code !== 'self_order'),
  });

  const cashierOrder_selectedLoyaltyBenefitId = ref<string | null>(null);
  const cashierOrder_selectedLoyaltyBenefit = ref<ILoyaltyPointBenefit | null>(null);

  const cashierOrder_setSelectedLoyaltyBenefit = (benefit: ILoyaltyPointBenefit | null) => {
    cashierOrder_selectedLoyaltyBenefitId.value = benefit?.id ?? null;
    cashierOrder_selectedLoyaltyBenefit.value = benefit;
  };

  // Modal for invoice detail
  const cashierOrder_modalInvoiceDetail = ref<ICashierOrderSummaryModalInvoiceDetail>({
    show: false,
    value: null,
    form: {
      received_by: '',
      notes: '',
    },
  });

  // Modal for cancel order
  const cashierOrder_modalCancelOrder = ref<ICashierOrderSummaryModalCancelOrder>({
    show: false,
  });

  /**
   * @description Handle cancel order action
   * @returns void
   */
  const cashierOrder_handleCancelOrder = (
    cashierPayment_modalPaymentMethod: Ref<ICashierOrderSummaryModalPaymentMethod>,
    cashierCustomer_customerState: Ref<ICashierCustomerState>,
    cashierOrder_modalSelectTable: Ref<ICashierOrderSummaryModalSelectTable>,
    cashierCustomer_modalVoucher: Ref<ICashierOrderSummaryModalVoucher>,
  ) => {
    cashierOrder_summary.value.product = [];
    cashierOrder_summary.value.orderType = 'dine_in';
    cashierPayment_modalPaymentMethod.value.selectedPaymentMethod = '';
    cashierCustomer_customerState.value.selectedCustomer = null;
    cashierOrder_modalSelectTable.value.selectedTable = [];
    cashierCustomer_modalVoucher.value.form = { voucherId: '', voucher_code: '' };
    cashierOrder_selectedLoyaltyBenefitId.value = null;
    cashierOrder_selectedLoyaltyBenefit.value = null;
    cashierProduct_selectedProduct.value = [];
    cashierOrder_modalCancelOrder.value.show = false;
  };

  const cashierOrder_calculateEstimation = ref<ICashierCalulateEstimationData>({
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

  // Modal for selecting table
  const cashierOrder_modalSelectTable = ref<ICashierOrderSummaryModalSelectTable>({
    show: false,
    selectedTable: [],
    activeFloor: 1,
    listFloor: CASHIER_DUMMY_LIST_FLOOR,
    data: CASHIER_DUMMY_LIST_TABLE as ICashierListTable[],
  });

  /**
   * @description Handle table selection toggle
   * @param {string} table - The table to toggle selection for
   * @returns void
   */
  const cashierOrder_handleToggleSelectTable = (table: string) => {
    const index = cashierOrder_modalSelectTable.value.selectedTable.indexOf(table);

    if (index === -1) {
      cashierOrder_modalSelectTable.value.selectedTable.push(table);
    } else {
      cashierOrder_modalSelectTable.value.selectedTable.splice(index, 1);
    }
  };

  /**
   * @description Handle table selection
   * @returns void
   */
  const cashierOrder_handleSelectTable = () => {};

  // Computed property to get active floor tables
  const cashierOrder_getListActiveFloor = computed(() => {
    const activeFloor = cashierOrder_modalSelectTable.value.data.filter(
      data => data.floor === cashierOrder_modalSelectTable.value.activeFloor,
    );

    return activeFloor;
  });

  watch(
    () => cashierProduct_selectedProduct.value,
    () => {
      localStorage.setItem('shoppingCart', JSON.stringify(cashierProduct_selectedProduct.value));
    },
    { deep: true },
  );

  /**
   * @description Handle voucher selection
   * @returns void
   */
  const cashierOrder_data = ref<ICashierOrderSummaryData>({
    customerName: '',
    orderId: '1234',
    orderType: '',
    tableNumber: '',
    voucherId: '',
    paymentMethod: '',
    isExpanded: true,
    isExpandedVisible: false,
  });

  /**
   * @description Debounce function to handle watch changes
   */
  const debouncedHandleWatchChanges = debounce(() => {
    // Customer and table selections are now optional
    // Only check if order type is selected to determine if form should be collapsed
    if (cashierOrder_modalOrderType.value.selectedOrderType) {
      cashierOrder_data.value.isExpanded = false;
      cashierOrder_data.value.isExpandedVisible = true;
    } else {
      cashierOrder_data.value.isExpanded = true;
      cashierOrder_data.value.isExpandedVisible = false;
    }
  }, 500);

  // watch for changes if orderType is filled change isExpanded to false
  watch(
    () => [cashierOrder_modalOrderType.value.selectedOrderType],
    () => {
      debouncedHandleWatchChanges();
    },
    { immediate: true, deep: true },
  );

  /**
   * @description Handle isExpanded toggle
   */
  const cashierOrder_handleIsExpandedToggle = () => {
    cashierOrder_data.value.isExpanded = !cashierOrder_data.value.isExpanded;
  };

  const cashierOrder_modalAddEditNotes = ref<ICashierOrderSummaryModalAddEdit>({
    show: false,
    item: null,
    tempValue: '',
  });

  /**
   * @description Handle add/edit notes action
   * @returns void
   */
  watch(
    () => cashierOrder_modalAddEditNotes.value.show,
    value => {
      if (!value) {
        cashierOrder_modalAddEditNotes.value.item = null;
      }
    },
  );

  // Computed property to summarize order details
  const cashierOrder_summary = computed(() => {
    const summary: ICashierOrderSummary = {
      provider: CASHIER_PROVIDER,
      orderType: cashierOrder_isRetailBusinessType.value
        ? 'take_away' // Default order type for retail business
        : cashierOrder_modalOrderType.value.selectedOrderType,
      invoiceDetail: {
        receivedBy: cashierOrder_modalInvoiceDetail.value.form.received_by,
        notes: cashierOrder_modalInvoiceDetail.value.form.notes,
      },
      paymentMethod: cashierOrder_data.value.paymentMethod,
      tableCode: cashierOrder_isRetailBusinessType.value
        ? '' // No table code needed for retail business
        : cashierOrder_modalSelectTable.value.selectedTable.toString(),
      selectedVoucher: '', // Will be set from cashierCustomer service
      customerName: '', // Will be set from cashierCustomer service
      product: cashierProduct_selectedProduct.value,
    };

    return summary;
  });

  const cashierOrder_modalPlaceOrderDetail = ref<ICashierOrderSummaryModalPlaceOrderConfirmation>({
    show: false,
    isLoading: false,
    showModalPayment: false,
    data: {},
  });

  /**
   * @description Check if the "Place Order" button should be disabled
   * @returns boolean
   */
  const cashierOrder_isButtonPlaceOrderDisabled = computed(() => {
    // Customer selection is now optional for all business types
    // Table selection is now optional for all order types

    const isDisabled =
      cashierOrder_modalOrderType.value.selectedOrderType === '' ||
      cashierProduct_selectedProduct.value.length === 0;

    return isDisabled;
  });

  /**
   * @description Handle calculation of estimation
   * @returns void
   */
  const cashierOrder_handleCalculateEstimation = async (
    recalculating = false,
    voucherId?: string,
    customerId?: string | undefined,
    getVoucherActive?: () => Promise<void>,
    voucherData?: Ref<ICashierVoucher[]>,
    cashierCustomer_modalVoucher?: Ref<ICashierOrderSummaryModalVoucher>,
  ) => {
    cashierOrder_calculateEstimation.value.isLoading = true;

    try {
      const response = await store.cashierProduct_calculateEstimation(
        {
          voucherId: voucherId || null,
          customerId: customerId ?? undefined,
          products: cashierOrder_summary.value.product,
          orderType: cashierOrder_summary.value.orderType,
          redeemLoyalty: cashierOrder_selectedLoyaltyBenefitId.value
            ? { loyalty_points_benefit_id: cashierOrder_selectedLoyaltyBenefitId.value }
            : undefined,
        },
        route,
      );

      cashierOrder_calculateEstimation.value.data = response.data;

      if (!recalculating && getVoucherActive && voucherData && cashierCustomer_modalVoucher) {
        await getVoucherActive();

        const availableVouchers = voucherData.value.filter((v: ICashierVoucher) => v.available);

        if (availableVouchers.length > 0) {
          availableVouchers.sort((a: ICashierVoucher, b: ICashierVoucher) => {
            // Sort by stock (quota) ascending
            if (a.stock !== b.stock) {
              return a.stock - b.stock;
            }

            // Then sort by discount amount descending
            const subTotal = cashierOrder_calculateEstimation.value.data.subTotal;

            const discountA =
              a.type === 'percentage' ? Math.min((subTotal * a.discount) / 100, a.maxDiscount) : a.discount;

            const discountB =
              b.type === 'percentage' ? Math.min((subTotal * b.discount) / 100, b.maxDiscount) : b.discount;

            return discountB - discountA;
          });

          const bestVoucher = availableVouchers[0];

          if (bestVoucher && !cashierCustomer_modalVoucher.value.form.voucherId) {
            cashierCustomer_modalVoucher.value.form.voucherId = bestVoucher.id;
            cashierCustomer_modalVoucher.value.form.voucher_code = bestVoucher.code;
            await cashierOrder_handleCalculateEstimation(true, voucherId, customerId);
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
      cashierOrder_calculateEstimation.value.isLoading = false;
    }
  };

  const cashierOrder_isLoadingUnpaidOrder = ref(false);

  /**
   * @description Handle saving unpaid order
   * @returns void
   */
  const cashierOrder_handleSaveUnpaidOrder = async (
    cashierPayment_modalPaymentMethod: Ref<ICashierOrderSummaryModalPaymentMethod>,
    cashierCustomer_modalVoucher: Ref<ICashierOrderSummaryModalVoucher>,
    cashierCustomer_customerState: Ref<ICashierCustomerState>,
  ) => {
    cashierOrder_isLoadingUnpaidOrder.value = true;

    try {
      const params = {
        products: cashierOrder_summary.value.product,
        orderType: cashierOrder_summary.value.orderType,
        paymentMethodId: cashierPayment_modalPaymentMethod.value.selectedPaymentMethod,
        voucherId: cashierCustomer_modalVoucher.value.form.voucherId,
        customerId: cashierCustomer_customerState.value.selectedCustomer?.id ?? null,
        tableCode: cashierOrder_isRetailBusinessType.value ? '' : cashierOrder_summary.value.tableCode,
        storeId: storeOutlet.outlet_currentOutlet?.id || '',
        rounding_amount: cashierOrder_calculateEstimation.value.data.roundingAdjustment || 0,
        redeemLoyalty: cashierOrder_selectedLoyaltyBenefitId.value
          ? { loyalty_points_benefit_id: cashierOrder_selectedLoyaltyBenefitId.value }
          : undefined,
      };

      const response = await store.cashierProduct_paymentProcess(params, route);

      store.cashierProduct_selectedProduct = [];

      // Validate that we received an orderId from the API
      if (!response.data?.orderId) {
        throw new Error('Order saved but no order ID was returned from the server');
      }

      router.push({
        name: 'invoice',
        params: {
          invoiceId: response.data.orderId,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      cashierOrder_isLoadingUnpaidOrder.value = false;
    }
  };

  const cashierOrder_modalPlaceOrderConfirmation = ref<ICashierOrderSummaryModalPlaceOrder>({
    show: false,
    form: {
      payment_method: '',
      amount: 0,
      notes: '',
    },
  });

  /**
   * @description Handle place order confirmation
   * @returns void
   */
  const cashierOrder_handlePlaceOrderConfirmation = async (
    cashierPayment_modalPaymentMethod?: Ref<ICashierOrderSummaryModalPaymentMethod>,
    cashierOrder_handlePlaceOrderDetail?: () => Promise<void>,
  ) => {
    const getSelectedPaymentMethod = cashierPayment_modalPaymentMethod?.value?.data?.find(
      (f: ICashierOrderSummaryModalPaymentMethod['data'][0]) => f.id === cashierPayment_modalPaymentMethod?.value?.selectedPaymentMethod,
    )?.name;

    switch (getSelectedPaymentMethod?.toUpperCase()) {
      case 'CASH':
        cashierOrder_modalPlaceOrderDetail.value.show = true;
        break;
      case 'QRIS':
        if (cashierOrder_handlePlaceOrderDetail) {
          await cashierOrder_handlePlaceOrderDetail();
        }
        cashierOrder_modalPlaceOrderConfirmation.value.show = false;
        break;
      case 'DEBIT':
        cashierOrder_modalPlaceOrderDetail.value.show = true;
        break;
      case 'CREDIT':
        cashierOrder_modalPlaceOrderDetail.value.show = true;
        break;
      case 'PAY AT CASHIER':
        // Will be handled by passing cashierOrder_handleSaveUnpaidOrder
        break;
      default:
        console.error('Invalid payment method selected');
        break;
    }
  };

  /**
   * @description Handle placing order detail
   * @returns void
   */
  const cashierOrder_handlePlaceOrderDetail = async (
    cashierPayment_modalPaymentMethod?: Ref<ICashierOrderSummaryModalPaymentMethod>,
    cashierPayment_paymentForm?: Reactive<{ paymentAmount: number }>,
    cashierCustomer_modalVoucher?: Ref<ICashierOrderSummaryModalVoucher>,
    cashierCustomer_customerState?: Ref<ICashierCustomerState>,
  ) => {
    const getSelectedPaymentMethod = cashierPayment_modalPaymentMethod?.value?.data?.find(
      (f: ICashierOrderSummaryModalPaymentMethod['data'][0]) => f.id === cashierPayment_modalPaymentMethod?.value?.selectedPaymentMethod,
    )?.name;

    cashierOrder_modalPlaceOrderDetail.value.show = false;
    cashierOrder_modalPlaceOrderDetail.value.isLoading = true;

    const provider =
      getSelectedPaymentMethod?.toUpperCase() === 'CASH' ? 'cash' : cashierOrder_summary.value.provider;

    try {
      const params = {
        products: cashierOrder_summary.value.product,
        orderType: cashierOrder_summary.value.orderType,
        provider: provider,
        paymentMethodId: cashierPayment_modalPaymentMethod?.value?.selectedPaymentMethod ?? '',
        customerId: cashierCustomer_customerState?.value?.selectedCustomer?.id ?? null,
        tableCode: cashierOrder_isRetailBusinessType.value ? '' : cashierOrder_summary.value.tableCode,
        storeId: storeOutlet.outlet_currentOutlet?.id || '',
        paymentAmount: cashierPayment_paymentForm?.paymentAmount || null,
        voucherId: cashierCustomer_modalVoucher?.value?.form?.voucherId || null,
        rounding_amount: cashierOrder_calculateEstimation.value.data.roundingAdjustment || 0,
        redeemLoyalty: cashierOrder_selectedLoyaltyBenefitId.value
          ? { loyalty_points_benefit_id: cashierOrder_selectedLoyaltyBenefitId.value }
          : undefined,
      };

      const response = await store.cashierProduct_paymentInstant(params, route);

      cashierOrder_modalPlaceOrderDetail.value.data = response.data;

      if (getSelectedPaymentMethod?.toUpperCase() === 'CASH') {
        // Validate that we received an invoiceId from the API
        if (!response.data?.invoiceId) {
          throw new Error('Payment succeeded but no invoice ID was returned from the server');
        }

        router.push({
          name: 'invoice',
          params: {
            invoiceId: response.data.invoiceId,
          },
          query: {
            ...route.query,
          },
        });

        localStorage.removeItem('shoppingCart');
      } else {
        cashierOrder_modalPlaceOrderDetail.value.showModalPayment = true;
      }
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      cashierOrder_modalPlaceOrderDetail.value.isLoading = false;
    }
  };

  const cashierOrder_handleEditOrder = async () => {
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

  const cashierOrder_fetchInvoiceDetail = async (
    invoiceId: string,
    cashierCustomer_customerState: Ref<ICashierCustomerState>,
    cashierPayment_modalPaymentMethod: Ref<ICashierOrderSummaryModalPaymentMethod>,
  ) => {
    try {
      if (!invoiceId) {
        throw new Error('No invoice ID provided to fetch invoice detail');
      }
      const response = await storeInvoice.invoice_fetchInvoiceById(invoiceId, route);

      if (response.data) {
        if (response.data.customer) {
          cashierCustomer_customerState.value.selectedCustomer = {
            id: response.data.customerId,
            name: response.data.customer.name,
            code: response.data.customer.code,
            number: response.data.customer.number,
            email: response.data.customer.email,
            address: response.data.customer.address,
            dob: response.data.customer.dob,
            username: response.data.customer.username,
            customersHasTag: null,
          };
        }

        cashierOrder_modalOrderType.value.selectedOrderType = response.data.orderType;

        cashierOrder_modalSelectTable.value.selectedTable = response.data.tableCode.split(',');

        cashierPayment_modalPaymentMethod.value.selectedPaymentMethod = response.data.paymentMethodsId || '';

        cashierProduct_selectedProduct.value = response.data.invoiceDetails.map(mapInvoiceDetailToSelected);
        //   .filter((detail: ICashierSelected) => detail.type != 'redeem')

        if (response.data.loyaltyPointsBenefit) {
          const benefitData = response.data.loyaltyPointsBenefit;
          let discountFreeItems: IDiscount | IFreeItems[];

          if (benefitData.type === 'discount') {
            discountFreeItems = {
              value: benefitData.discountValue ?? 0,
              unit: benefitData.isPercent ? '%' : 'Rp',
              isPercent: benefitData.isPercent ?? false,
            };
          } else {
            discountFreeItems =
              benefitData.benefitFreeItems?.map(item => ({
                id: item.id ?? undefined,
                name: item.products?.name ?? '',
                quantity: item.quantity ?? 0,
              })) ?? [];
          }

          cashierOrder_setSelectedLoyaltyBenefit({
            id: benefitData.id,
            type: benefitData.type,
            benefitName: benefitData.benefitName,
            pointNeeds: benefitData.pointsNeeds ?? 0,
            discountFreeItems,
          });
        } else {
          cashierOrder_setSelectedLoyaltyBenefit(null);
        }
      } else {
        console.error('No invoice data found');
      }
    } catch (error) {
      console.error(error);
      router.push({
        name: 'cashier',
      });

      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Initialize route-based setup
   */
  const cashierOrder_initializeRoute = (
    cashierCustomer_customerState: Ref<ICashierCustomerState>,
    cashierPayment_modalPaymentMethod: Ref<ICashierOrderSummaryModalPaymentMethod>,
    cashierPayment_handleFetchPaymentMethod: () => Promise<void>,
  ) => {
    if (route.name === 'cashier-order-edit') {
      const invoiceId = route.params.invoiceId as string;
      if (invoiceId) {
        cashierOrder_fetchInvoiceDetail(invoiceId, cashierCustomer_customerState, cashierPayment_modalPaymentMethod);

        cashierPayment_handleFetchPaymentMethod();
      } else {
        console.error('No invoice ID provided in route parameters');
      }
    } else {
      cashierProduct_selectedProduct.value = [];
      cashierOrder_modalOrderType.value.selectedOrderType = 'dine_in';
      cashierOrder_modalSelectTable.value.selectedTable = [];
      cashierPayment_modalPaymentMethod.value.selectedPaymentMethod = '';
      cashierCustomer_customerState.value.selectedCustomer = null;
      cashierOrder_selectedLoyaltyBenefitId.value = null;
      cashierOrder_selectedLoyaltyBenefit.value = null;
    }
  };

  return {
    cashierOrder_calculateEstimation,
    cashierOrder_data,
    cashierOrder_getListActiveFloor,
    cashierOrder_handleCalculateEstimation,
    cashierOrder_handleCancelOrder,
    cashierOrder_handleEditOrder,
    cashierOrder_handleIsExpandedToggle,
    cashierOrder_handlePlaceOrderConfirmation,
    cashierOrder_handlePlaceOrderDetail,
    cashierOrder_handleSaveUnpaidOrder,
    cashierOrder_handleSelectTable,
    cashierOrder_handleToggleSelectTable,
    cashierOrder_initializeRoute,
    cashierOrder_isButtonPlaceOrderDisabled,
    cashierOrder_isLoadingUnpaidOrder,
    cashierOrder_isRetailBusinessType,
    cashierOrder_isShowQuickOverview,
    cashierOrder_modalAddEditNotes,
    cashierOrder_modalCancelOrder,
    cashierOrder_modalInvoiceDetail,
    cashierOrder_modalOrderSummary,
    cashierOrder_modalOrderType,
    cashierOrder_modalPlaceOrderConfirmation,
    cashierOrder_modalPlaceOrderDetail,
    cashierOrder_modalSelectTable,
    cashierOrder_selectedLoyaltyBenefit,
    cashierOrder_selectedLoyaltyBenefitId,
    cashierOrder_setSelectedLoyaltyBenefit,
    cashierOrder_summary,
  } as unknown as ICashierOrderProvided;
};
