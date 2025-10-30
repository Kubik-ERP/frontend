export interface IDailySalesListRequestQuery {
  createdAtFrom: Date | null;
  createdAtTo: Date | null;
  invoiceNumber: string | null;
  orderStatus: string | null;
  orderType: string | null;
  page: number;
  pageSize: number;
  paymentStatus: string | null;
  orderBy: string | null;
  orderDirection: 0 | 1 | -1 | string | undefined | null;
}

export interface IDailySales {
  cashierId: number;
  createdAt: string;
  customer: ICustomer;
  customerId: string;
  deleteAt: string | null;
  discountAmount: number;
  grandTotal: number;
  id: string;
  invoiceDetails: IInvoiceDetail[];
  invoiceNumber: string;
  orderType: string;
  orderStatus: string;
  paidAt: string | null;
  paymentMethodsId: string | null;
  paymentStatus: string;
  queue?: string | number;
  serviceChargeAmount: number;
  serviceChargeId: string | null;
  subtotal: number;
  tableCode: string;
  taxAmount: number | null;
  taxId: string | null;
  updatedAt: string;
}

export interface IInvoiceDetail {
  id: string;
  productId: string;
  productPrice: number;
  variantId: null;
  notes: string;
  qty: number;
  invoiceId: string;
  variantPrice: number;
  productDiscount: number;
  catalogBundlingId: null;
  benefitFreeItemsId: null;
  products: Products;
  variant: null;
  catalogBundling: ICatalogBundling | null;
  invoiceBundlingItems: IInvoiceBundlingItems[] | [];
}

export interface IInvoiceBundlingItems {
  id: string;
  invoiceId: string;
  invoiceDetailId: string;
  productId: string;
  qty: number;
  createdAt: Date;
  updatedAt: Date;
  products: IProducts;
}

export interface IProducts {
  id: string;
  name: string;
  price: number;
  discountPrice: number;
  pictureUrl: string;
  isPercent: boolean;
  storesId: string;
  masterInventoryItemId: null;
  barcode: null;
  stockQuantity: number;
}

export interface ICatalogBundling {
  id: string;
  storeId: string;
  name: string;
  description: string;
  type: string;
  discount: null;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  pictureUrl: string;
}

export interface Products {
  id: string;
  name: string;
  price: number;
  discountPrice: number;
  pictureUrl: string;
  isPercent: boolean;
  storesId: string;
  masterInventoryItemId: null;
  barcode: null;
  stockQuantity: number;
  categoriesHasProducts: CategoriesHasProduct[];
}

export interface CategoriesHasProduct {
  categoriesId: string;
  productsId: string;
  categories: Categories;
}

export interface Categories {
  id: string;
  category: string;
  description: string;
  pictureUrl: string;
  storesId: string;
  masterInventoryCategoryId: null;
}

export interface IDailySalesListResponse {
  data: {
    items: IDailySales[] | [];
    meta: IPageMeta;
    queueStatusCounts: {
      inProgress: number;
      placed: number;
    };
  };
}

export interface IQueueStateStore {
  queue_isLoading: boolean;
  dailySales_invoiceLists: IDailySalesListResponse;
}

export interface IQueueListRequestBody {
  orderStatus: string;
}

export interface IQueueListResponse {
  data: {
    success: boolean;
    message: string;
  };
}

export * from './queue-provided.interface';
