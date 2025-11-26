// Vue
import type { ComputedRef, Reactive, Ref, WritableComputedRef } from 'vue';

// Vuelidate
import type { Validation } from '@vuelidate/core';

// PrimeVue
import type { MenuPassThroughAttributes, VirtualScrollerLazyEvent } from 'primevue';
import type { MenuItem } from 'primevue/menuitem';

// External
import type { ILoyaltyPointBenefit } from '@/modules/point-configuration/interfaces';

// Store interfaces (formerly from self-order-response.ts)
import type {
  ISelfOrderCategoriesData,
  ISelfOrderCategoriesHasProductResponse,
  ISelfOrderCustomer,
  ISelfOrderProductItem,
  ISelfOrderResponseCalulateEstimationItem,
  ISelfOrderResponseMidtransQrisPayment,
  ISelfOrderVariant,
} from './self-order-store.interface';

/**
 * ================================================================
 * STATE INTERFACES
 * ================================================================
 */

/**
 * @description Interface for Self Order Product State
 */
export interface ISelfOrderProductState {
  isLoadingProduct: boolean;
  isLoadingCategory: boolean;
  selectedCategory: string;
  searchProduct: string;
  listCategory: ISelfOrderCategoriesData[];
  listProductSearch: ISelfOrderProductItem[];
  listProductCategory: ISelfOrderCategoriesHasProductResponse[];
}

/**
 * @description Interface for Self Order Customer State
 */
export interface ISelfOrderCustomerState {
  isLoading: boolean;
  customerList: ISelfOrderCustomer[];
  page: number;
  limit: number;
  total: number;
  selectedCustomer: ISelfOrderCustomer | null;
}

/**
 * @description Interface for Self Order Selected Product
 */
export interface ISelfOrderSelected {
  type: string;
  product?: ISelfOrderProductItem;
  variant: ISelfOrderVariant;
  bundling?: ISelfOrderProductItem;
  bundlingId?: string;
  productId?: string;
  variantId?: string;
  quantity: number;
  notes: string;
}

/**
 * ================================================================
 * MODAL INTERFACES
 * ================================================================
 */

/**
 * @description Interface for Self Order Modal Add Product Item
 */
export interface ISelfOrderModalAddProductItem {
  quantity: number;
  variant: ISelfOrderVariant;
  notes: string;
}

/**
 * @description Interface for Self Order Modal Add Product
 */
export interface ISelfOrderModalAddProduct {
  show: boolean;
  isAddNotesActive: boolean;
  product: ISelfOrderProductItem | null;
  item: ISelfOrderModalAddProductItem;
}

/**
 * @description Interface for Self Order Modal Category
 */
export interface ISelfOrderModalCategory {
  show: boolean;
}

/**
 * @description Interface for Self Order Modal Add Edit Notes
 */
export interface ISelfOrderModalAddEdit {
  show: boolean;
  item: number | null;
  tempValue: string;
}

/**
 * @description Interface for Self Order Modal Order Type
 */
export interface ISelfOrderModalOrderType {
  show: boolean;
  selectedOrderType: string;
  data: ISelfOrderOrderType[];
}

/**
 * @description Interface for Self Order Modal Invoice Detail
 */
export interface ISelfOrderModalInvoiceDetail {
  show: boolean;
  value: number | null;
  form: {
    received_by: string;
    notes: string;
  };
}

/**
 * @description Interface for Self Order Modal Cancel Order
 */
export interface ISelfOrderModalCancelOrder {
  show: boolean;
}

/**
 * @description Interface for Self Order Modal Place Order Confirmation (QRIS)
 */
export interface ISelfOrderModalPlaceOrderConfirmation {
  show: boolean;
  showModalPayment: boolean;
  isLoading: boolean;
  data: Partial<ISelfOrderResponseMidtransQrisPayment['data']>;
}

/**
 * @description Interface for Self Order Modal Select Table
 */
export interface ISelfOrderModalSelectTable {
  show: boolean;
  selectedTable: string[];
  activeFloor: number;
  listFloor: ISelfOrderListFloor[];
  data: ISelfOrderListTable[];
}

/**
 * @description Interface for Self Order Modal Payment Method
 */
export interface ISelfOrderModalPaymentMethod {
  show: boolean;
  isLoading: boolean;
  selectedPaymentMethod: string;
  data: ISelfOrderPaymentMethod[];
}

/**
 * @description Interface for Self Order Modal Add Customer
 */
export interface ISelfOrderModalAddCustomer {
  show: boolean;
}

/**
 * @description Interface for Self Order Modal Register Customer (for checkout)
 */
export interface ISelfOrderModalRegisterCustomer {
  show: boolean;
}

/**
 * @description Interface for Self Order Modal Place Order
 */
export interface ISelfOrderModalPlaceOrder {
  show: boolean;
  form: {
    payment_method: string;
    amount: number;
    notes: string;
  };
}

/**
 * @description Interface for Self Order Modal Voucher
 */
export interface ISelfOrderModalVoucher {
  show: boolean;
  form: {
    voucherId: string;
    voucher_code: string;
  };
  search: string;
  data: ISelfOrderVoucher[];
}

/**
 * ================================================================
 * DATA INTERFACES
 * ================================================================
 */

/**
 * @description Interface for Self Order Type
 */
export interface ISelfOrderOrderType {
  code: string;
  label: string;
  available: boolean;
}

/**
 * @description Interface for Self Order Voucher
 */
export interface ISelfOrderVoucher {
  id: string;
  code: string;
  label: string;
  available: boolean;
  discount: number;
  minPurchase: number;
  maxDiscount: number;
  validUntil: string;
  validFrom: string;
  type: string;
  stock: number;
}

/**
 * @description Interface for Self Order Payment Method
 */
export interface ISelfOrderPaymentMethod {
  id: string;
  name: string;
  iconName: string;
  sortNo: number;
  isAvailable: boolean;
}

/**
 * @description Interface for Self Order Payment Method Response
 */
export interface ISelfOrderPaymentMethodResponse {
  data: ISelfOrderPaymentMethod[];
}

/**
 * @description Interface for Self Order List Table
 */
export interface ISelfOrderListTable {
  value: string;
  label: string;
  available: boolean;
  totalSeat: number;
  floor: number;
  statusTable: 'available' | 'occupied' | 'reserved';
}

/**
 * @description Interface for Self Order List Floor
 */
export interface ISelfOrderListFloor {
  value: string;
  label: string;
  available: boolean;
}

/**
 * @description Interface for Self Order Data
 */
export interface ISelfOrderData {
  customerName: string;
  orderId: string;
  orderType: string;
  tableNumber: string;
  voucherId: string;
  paymentMethod: string;
  isExpanded: boolean;
  isExpandedVisible: boolean;
}

/**
 * @description Interface for Self Order Calculation Data
 */
export interface ISelfOrderCalulateEstimationData {
  isLoading: boolean;
  data: ISelfOrderResponseCalulateEstimationItem;
}

/**
 * @description Interface for Self Order Summary
 */
export interface ISelfOrderSummary {
  provider: string;
  orderType: string;
  invoiceDetail: {
    receivedBy: string;
    notes: string;
  };
  paymentMethod: string;
  tableCode: string;
  selectedVoucher: string;
  customerName: string;
  product: ISelfOrderSelected[];
}

/**
 * @description Interface for Self Order Response Add Customer
 */
export interface ISelfOrderResponseAddCustomer {
  data: ISelfOrderCustomer;
  message: string;
  statusCode: number;
}

/**
 * @description Interface for Self Order Display User (from localStorage)
 */
export interface ISelfOrderDisplayUser {
  name: string;
  code: string | null;
  number: string | null;
  email: string | null;
  isGuest: boolean;
}

/**
 * ================================================================
 * PROVIDED INTERFACE (COMBINED)
 * ================================================================
 */

/**
 * @description Main interface for SelfOrderUI - combines all functionality
 * Semua property menggunakan prefix selfOrder_ untuk konsistensi
 */
export interface ISelfOrderProvided {
  // ============================================================
  // STATE - Product
  // ============================================================
  selfOrder_productState: Ref<ISelfOrderProductState>;
  selfOrder_selectedProduct: Ref<ISelfOrderSelected[]>;
  selfOrder_selectedView: Ref<'image' | 'grid' | 'inline'>;
  selfOrder_selectedProductQty: WritableComputedRef<number>;

  // ============================================================
  // STATE - Customer
  // ============================================================
  selfOrder_customerState: Ref<ISelfOrderCustomerState>;

  // ============================================================
  // STATE - Order Data
  // ============================================================
  selfOrder_data: Ref<ISelfOrderData>;
  selfOrder_calculateEstimation: Ref<ISelfOrderCalulateEstimationData>;
  selfOrder_summary: ComputedRef<ISelfOrderSummary>;
  selfOrder_isLoadingUnpaidOrder: Ref<boolean>;

  // ============================================================
  // STATE - Loyalty
  // ============================================================
  selfOrder_selectedLoyaltyBenefitId: Ref<string | null>;
  selfOrder_selectedLoyaltyBenefit: Ref<ILoyaltyPointBenefit | null>;
  selfOrder_selectedBenefit: Ref<ILoyaltyPointBenefit | null>;
  selfOrder_showLoyaltyModal: Ref<boolean>;

  // ============================================================
  // STATE - Self Order Display User
  // ============================================================
  selfOrder_displayUser: Ref<ISelfOrderDisplayUser>;
  selfOrder_isSelfOrderRoute: ComputedRef<boolean>;
  selfOrder_phoneDisplay: ComputedRef<string | null>;
  selfOrder_loyaltyButtonText: ComputedRef<string>;

  // ============================================================
  // STATE - UI
  // ============================================================
  selfOrder_isShowQuickOverview: Ref<boolean>;
  selfOrder_menuOrder: Ref<MenuPassThroughAttributes>;
  selfOrder_menuOrderItem: Ref<MenuItem[]>;
  selfOrder_paymentForm: Reactive<{ paymentAmount: number }>;
  selfOrder_paymentAmountFormValidation: Ref<Validation>;

  // ============================================================
  // MODALS - Product
  // ============================================================
  selfOrder_modalAddEditItem: Ref<ISelfOrderModalAddProduct>;
  selfOrder_modalCategory: Ref<ISelfOrderModalCategory>;

  // ============================================================
  // MODALS - Order Summary
  // ============================================================
  selfOrder_modalAddCustomer: Ref<ISelfOrderModalAddCustomer>;
  selfOrder_modalRegisterCustomer: Ref<ISelfOrderModalRegisterCustomer>;
  selfOrder_modalMenuOrderItem: Ref<{ show: boolean }>;
  selfOrder_modalOrderSummary: Ref<{ show: boolean }>;
  selfOrder_modalAddEditNotes: Ref<ISelfOrderModalAddEdit>;
  selfOrder_modalOrderType: Ref<ISelfOrderModalOrderType>;
  selfOrder_modalInvoiceDetail: Ref<ISelfOrderModalInvoiceDetail>;
  selfOrder_modalCancelOrder: Ref<ISelfOrderModalCancelOrder>;
  selfOrder_modalPaymentMethod: Ref<ISelfOrderModalPaymentMethod>;
  selfOrder_modalVoucher: Ref<ISelfOrderModalVoucher>;
  selfOrder_modalSelectTable: Ref<ISelfOrderModalSelectTable>;
  selfOrder_modalPlaceOrderConfirmation: Ref<ISelfOrderModalPlaceOrder>;
  selfOrder_modalPlaceOrderDetail: Ref<ISelfOrderModalPlaceOrderConfirmation>;

  // ============================================================
  // COMPUTED
  // ============================================================
  selfOrder_getListActiveFloor: ComputedRef<ISelfOrderListTable[]>;
  selfOrder_isButtonPlaceOrderDisabled: ComputedRef<boolean>;
  selfOrder_hasCustomerManagementPermission: ComputedRef<boolean>;
  selfOrder_isRetailBusinessType: ComputedRef<boolean>;
  selfOrder_isProductActive: (product: ISelfOrderProductItem) => boolean;
  isProductActive: (product: ISelfOrderProductItem) => boolean;

  // ============================================================
  // ACTIONS - Product
  // ============================================================
  selfOrder_onSelectCategory: (category: string) => void;
  selfOrder_handleSelectCategory: (category: string) => void;
  selfOrder_onSelectProduct: (product?: ISelfOrderProductItem, item?: ISelfOrderModalAddProductItem) => void;
  selfOrder_handleSelectProduct: (product?: ISelfOrderProductItem, item?: ISelfOrderModalAddProductItem) => void;
  selfOrder_onSearchData: () => Promise<void>;
  selfOrder_onBarcodeScanned: (barcode: string) => Promise<void>;
  selfOrder_handleBarcodeScanned: (barcode: string) => Promise<void>;
  selfOrder_onFetchCategory: () => Promise<void>;
  selfOrder_onFetchProductCategory: () => Promise<void>;
  selfOrder_onChangeQuantity: (type: 'increase' | 'decrease') => void;
  selfOrder_handleQuantity: (type: 'increase' | 'decrease') => void;
  selfOrder_onOpenModalAddProduct: (product: ISelfOrderProductItem) => void;
  selfOrder_handleOpenModalAddProduct: (product: ISelfOrderProductItem) => void;

  // ============================================================
  // ACTIONS - Customer
  // ============================================================
  selfOrder_onSearchCustomer: (search: string) => void;
  selfOrder_onScrollFetchMoreCustomers: (event: VirtualScrollerLazyEvent) => void;
  selfOrder_onModalAddCustomer: (response: ISelfOrderResponseAddCustomer | null) => void;

  // ============================================================
  // ACTIONS - Order
  // ============================================================
  selfOrder_onToggleExpanded: () => void;
  selfOrder_onSaveUnpaidOrder: () => Promise<void>;
  selfOrder_handleSaveUnpaidOrder: () => Promise<void>;
  selfOrder_onSelectVoucher: (code: string) => void;
  selfOrder_handleVoucher: (code: string) => void;
  selfOrder_onFetchPaymentMethod: () => Promise<void>;
  selfOrder_onPaymentMethod: () => Promise<void>;
  selfOrder_handlePaymentMethod: () => Promise<void>;
  selfOrder_onInvoiceDetail: () => void;
  selfOrder_handleInvoiceDetail: () => void;
  selfOrder_onCancelOrder: () => void;
  selfOrder_handleCancelOrder: () => void;
  selfOrder_onSelectTable: () => void;
  selfOrder_handleSelectTable: () => void;
  selfOrder_onPlaceOrderConfirmation: () => Promise<void>;
  selfOrder_handlePlaceOrderConfirmation: () => Promise<void>;
  selfOrder_onPlaceOrderDetail: () => Promise<void>;
  selfOrder_handlePlaceOrderDetail: () => Promise<void>;
  selfOrder_onToggleSelectTable: (table: string) => void;
  selfOrder_handleToggleSelectTable: (table: string) => void;
  selfOrder_onSimulatePayment: (invoiceId: string) => Promise<void>;
  selfOrder_onEditOrder: () => Promise<void>;
  selfOrder_handleEditOrder: () => Promise<void>;
  selfOrder_onSetLoyaltyBenefit: (benefit: ILoyaltyPointBenefit | null) => void;

  // ============================================================
  // ACTIONS - Self Order User Management (from component)
  // ============================================================
  selfOrder_onSetDisplayUserAsGuest: (name?: string) => void;
  selfOrder_onSetDisplayUserFromCustomer: (customer: ISelfOrderCustomer) => void;
  selfOrder_onSyncUserFromStorage: () => void;
  selfOrder_onSignInAsGuest: () => void;
  selfOrder_onNavigateToLogin: () => void;
  selfOrder_onOpenRegisterCustomerModal: () => void;
  selfOrder_onCloseRegisterCustomerModal: () => void;

  // ============================================================
  // ACTIONS - Loyalty Management (from component)
  // ============================================================
  selfOrder_onRequestCustomerLoyaltyPoint: (customerId: string) => Promise<void>;
  selfOrder_onOpenLoyaltyModal: () => Promise<void>;
  selfOrder_onCloseLoyaltyModal: () => void;
  selfOrder_onSelectBenefit: (benefit: ILoyaltyPointBenefit) => void;
  selfOrder_onRedeemPoints: () => void;
  selfOrder_onInitializeLoyalty: () => Promise<void>;

  // ============================================================
  // WATCHERS - Lifecycle Management (from component)
  // ============================================================
  selfOrder_onWatchRouteChanges: () => void;
  selfOrder_onWatchCustomerChanges: () => void;
  selfOrder_onWatchBenefitChanges: () => void;

  // ============================================================
  // ACTIONS - Quick Overview Dialogs
  // ============================================================
  selfOrder_onCloseDialogStockOverview: () => void;
  selfOrder_onOpenDialogStockOverview: () => Promise<void>;

  // ============================================================
  // INITIALIZATION
  // ============================================================
  selfOrder_onInitialize: () => Promise<void>;
  selfOrder_onInitializeRoute: () => void;
}
