/**
 * ================================================================
 * STORE STATE INTERFACES
 * ================================================================
 */

/**
 * @description Interface for Self Order Store State
 */
export interface ISelfOrderStoreState {
  selfOrder_isLoading: boolean;
  selfOrderInvalid_isLoading: boolean;
  selfOrderLogin_isLoading: boolean;
  selfOrderRegister_isLoading: boolean;
}

/**
 * @description Interface for Self Order Verify Payload
 */
export interface ISelfOrderVerifyPayload {
  storeId: string;
  tablesName: string;
}

/**
 * @description Interface for Self Order Verify Response
 */
export interface ISelfOrderVerifyResponse {
  message: string;
  valid: boolean;
}

/**
 * ================================================================
 * API RESPONSE INTERFACES (merged from self-order-response.ts)
 * ================================================================
 */

/**
 * @description Interface for calculation estimation detail
 */
export interface ISelfOrderResponseCalulateEstimationDetail {
  productId: string;
  variantId: string;
  productPrice: number;
  variantPrice: number;
  qty: number;
  discountAmount: number;
  subtotal: number;
}

/**
 * @description Interface for calculation estimation item
 */
export interface ISelfOrderResponseCalulateEstimationItem {
  total: number;
  subTotal: number;
  discountTotal: number;
  grandTotal: number;
  totalRedeemDiscount?: number;
  totalPointsEarn?: number;
  serviceCharge: number | null;
  serviceChargeInclude: boolean;
  tax: number | null;
  taxInclude: boolean;
  roundingAdjustment: number | null;
  totalProductDiscount: number | null;
  items: ISelfOrderResponseCalulateEstimationItem[];
  voucherAmount: number;
}

/**
 * @description Interface for calculation estimation response
 */
export interface ISelfOrderResponseCalulateEstimation {
  data: ISelfOrderResponseCalulateEstimationItem;
}

/**
 * @description Interface for process checkout response
 */
export interface ISelfOrderResponseProcessCheckout {
  data: {
    orderId: string;
  };
}

/**
 * @description Interface for Midtrans action
 */
export interface IMidtransAction {
  name: string;
  method: string;
  url: string;
}

/**
 * @description Interface for Midtrans QRIS payment data
 */
export interface IMidtransQrisPaymentData {
  statusCode: string;
  statusMessage: string;
  transactionId: string;
  invoiceId: string;
  orderId: string;
  merchantId: string;
  grossAmount: string;
  currency: string;
  paymentType: string;
  transactionTime: string;
  transactionStatus: string;
  fraudStatus: string;
  actions: IMidtransAction[];
  acquirer: string;
  qrString: string;
  expiryTime: string;
  qrImage?: string | null;
}

/**
 * @description Interface for Midtrans QRIS payment response
 */
export interface ISelfOrderResponseMidtransQrisPayment {
  data: IMidtransQrisPaymentData;
}

/**
 * @description Interface for websocket message
 */
export interface ISelfOrderResponseWebsocketMessage {
  orderId: string;
  message: string;
}

/**
 * @description Interface for categories data
 */
export interface ISelfOrderCategoriesData {
  id: string;
  category: string;
  description: string;
  pictureUrl: string;
  totalItems: number;
}

/**
 * @description Interface for product variant
 */
export interface ISelfOrderProductVariant {
  id: string;
  productsId: string;
  name: string;
  price: number;
}

/**
 * @description Interface for product item
 */
export interface ISelfOrderProductItem {
  id: string;
  name: string;
  price: number;
  discountPrice: number;
  pictureUrl: string;
  isPercent: boolean;
  barcode?: string;
  stockQuantity?: number;
  variant: ISelfOrderProductVariant[];

  // product bundling props
  description?: string;
  discount?: number | null;
  type?: string;
  bundlingType?: string;

  products?: {
    product_id: string;
    quantity: number;
    name: string;
    price: number;
  }[];
}

/**
 * @description Interface for categories with products
 */
export interface ISelfOrderCategoriesHasProductResponse {
  id: string;
  category: string;
  description: string;
  items: ISelfOrderProductItem[];
}

/**
 * @description Interface for categories with products response data
 */
export interface ISelfOrderCategoriesHasProductResponseData {
  data: ISelfOrderCategoriesHasProductResponse[];
}

/**
 * @description Interface for categories response
 */
export interface ISelfOrderCategoriesResponse {
  data: ISelfOrderCategoriesData[];
}

/**
 * @description Interface for product variant
 */
export interface ISelfOrderVariant {
  id: string;
  name: string;
  price: number;
}

/**
 * @description Interface for variant with product
 */
export interface ISelfOrderVariantHasProduct {
  variantId: string;
  productsId: string;
  variant: ISelfOrderVariant;
}

/**
 * @description Interface for categories
 */
export interface ISelfOrderCategories {
  id: string;
  category: string;
  description: string;
}

/**
 * @description Interface for categories with product relation
 */
export interface ISelfOrderCategoriesHasProduct {
  categoriesId: string;
  productsId: string;
  categories: ISelfOrderCategories;
}

/**
 * @description Interface for customer tag
 */
export interface ISelfOrderCustomerTag {
  id: string;
  name: string;
}

/**
 * @description Interface for customer with tag relation
 */
export interface ISelfOrderCustomerHasTag {
  customerId: string;
  tagId: string;
  tag: ISelfOrderCustomerTag;
}

/**
 * @description Interface for customer
 */
export interface ISelfOrderCustomer {
  id: string;
  name: string;
  code: string | null;
  number: string | null;
  dob: string | null;
  email: string | null;
  username: string | null;
  address: string | null;
  customersHasTag: ISelfOrderCustomerHasTag[] | null;
}

/**
 * @description Interface for customer response
 */
export interface ISelfOrderCustomerResponse {
  data: {
    data: ISelfOrderCustomer[];
    total: number;
    page: number;
    lastPage: number;
  };
}

/**
 * @description Interface for product barcode response
 */
export interface ISelfOrderProductBarcodeResponse {
  data: ISelfOrderProductItem;
}
