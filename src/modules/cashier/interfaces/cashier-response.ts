export interface ICashierResponseCalulateEstimationDetail {
  productId: string;
  variantId: string;
  productPrice: number;
  variantPrice: number;
  qty: number;
  discountAmount: number;
  subtotal: number;
}

export interface ICashierResponseCalulateEstimationItem {
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
  items: ICashierResponseCalulateEstimationItem[];
  voucherAmount: number;
}

export interface ICashierResponseCalulateEstimation {
  data: ICashierResponseCalulateEstimationItem;
}

export interface ICashierResponseProcessCheckout {
  data: {
    orderId: string;
  };
}

export interface IMidtransAction {
  name: string;
  method: string;
  url: string;
}

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

export interface ICashierResponseMidtransQrisPayment {
  data: IMidtransQrisPaymentData;
}

export interface ICashierResponseWebsocketMessage {
  orderId: string;
  message: string;
}

export interface ICashierCategoriesData {
  id: string;
  category: string;
  description: string;
  pictureUrl: string;
  totalItems: number;
}

export interface IProductVariant {
  id: string;
  productsId: string;
  name: string;
  price: number;
}

export interface IProductItem {
  id: string;
  name: string;
  price: number;
  discountPrice: number;
  pictureUrl: string;
  isPercent: boolean;
  barcode?: string;
  stockQuantity?: number;
  variant: IProductVariant[];

  // product bundling props, i merge it because time constraints
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

export interface ICashierCategoriesHasProductResponse {
  id: string;
  category: string;
  description: string;
  items: IProductItem[];
}

export interface ICashierCategoriesHasProductResponseData {
  data: ICashierCategoriesHasProductResponse[];
}

export interface ICashierCategoriesResponse {
  data: ICashierCategoriesData[];
}

export interface ICashierVariant {
  id: string;
  name: string;
  price: number;
}

export interface ICashierVariantHasProduct {
  variantId: string;
  productsId: string;
  variant: ICashierVariant;
}

export interface ICashierCategories {
  id: string;
  category: string;
  description: string;
}

export interface ICashierCategoriesHasProduct {
  categoriesId: string;
  productsId: string;
  categories: ICashierCategories;
}

export interface ICashierCustomerTag {
  id: string;
  name: string;
}

export interface ICashierCustomerHasTag {
  customerId: string;
  tagId: string;
  tag: ICashierCustomerTag;
}

export interface ICashierCustomer {
  id: string;
  name: string;
  code: string | null;
  number: string | null;
  dob: string | null;
  email: string | null;
  username: string | null;
  address: string | null;
  customersHasTag: ICashierCustomerHasTag[] | null;
}

export interface ICashierCustomerResponse {
  data: {
    data: ICashierCustomer[];
    total: number;
    page: number;
    lastPage: number;
  };
}

export interface ICashierProductBarcodeResponse {
  data: IProductItem;
}
