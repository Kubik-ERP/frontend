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
  discountTotal: number;
  items: ICashierResponseCalulateEstimationItem[];
}

export interface ICashierResponseCalulateEstimation {
  data: ICashierResponseCalulateEstimationItem;
}

export interface ICashierResponseProcessCheckout {
  data: {
    orderId: string;
  };
}

export interface ICashierResponseMidtransQrisPayment {
  data: {
    statusCode: string;
    statusMessage: string;
    transactionId: string;
    orderId: string;
    merchantId: string;
    grossAmount: string;
    currency: string;
    paymentType: string;
    transactionTime: string;
    transactionStatus: string;
    fraudStatus: string;
    actions: {
      name: string;
      method: string;
      url: string;
    }[];
    acquirer: string;
    qrString: string;
    expiryTime: string;
  };
}

export interface ICashierResponseWebsocketMessage {
  orderId: string;
  message: string;
}

export interface ICashierCategoryHasProduct {
  categoriesId: string;
  productsId: string;
  products: ICashierProduct;
}

export interface ICashierCategory {
  id: string;
  category: string;
  description: string;
  image: string;
  categoriesHasProducts: ICashierCategoryHasProduct[];
}

export interface ICashierCategoriesData {
  categories: ICashierCategory[];
  total: number;
  page: number;
  lastPage: number;
}

export interface ICashierCategoriesHasProductResponse {
  data: {
    id: string;
    description: string;
    category: string;
    categoriesHasProducts: ICashierCategoryHasProduct[];
  };
}

export interface ICashierCategoriesResponse {
  data: ICashierCategoriesData;
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

export interface ICashierProduct {
  id: string;
  name: string;
  price: number;
  discountPrice: number;
  pictureUrl: string | null | '';
  isPercent: boolean;
  quantity: number | null;
  variantHasProducts: ICashierVariantHasProduct[] | null;
  categoriesHasProducts: ICashierCategoriesHasProduct[] | null;
}

export interface ICashierProductResponse {
  data: ICashierProduct[];
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
  code: string;
  number: string;
  dob: string;
  email: string;
  username: string;
  address: string;
  customersHasTag: ICashierCustomerHasTag[];
}

export interface ICashierCustomerResponse {
  data: {
    data: ICashierCustomer[];
    total: number;
    page: number;
    lastPage: number;
  };
}
