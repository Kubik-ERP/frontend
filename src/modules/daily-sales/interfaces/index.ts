// export interface IDailySales {
//   cashierId: number;
//   createdAt: string;
//   customer: ICustomer;
//   customerId: string;
//   deleteAt: string | null;
//   discountAmount: number;
//   grandTotal: number;
//   id: string;
//   invoiceNumber: string;
//   orderType: string;
//   paidAt: string | null;
//   paymentMethodsId: string | null;
//   paymentStatus: string;
//   serviceChargeAmount: number;
//   serviceChargeId: string | null;
//   subtotal: number;
//   tableCode: string;
//   taxAmount: number | null;
//   taxId: string | null;
//   updatedAt: string;
//   voucherAmount: number | null;
// }

export interface IProduct {
  id:                    string;
  name:                  string;
  price:                 number;
  discountPrice:         number;
  pictureUrl:            string;
  isPercent:             boolean;
  storesId:              string;
  masterInventoryItemId: null;
  barcode:               null;
  categoriesHasProducts: ICategoriesHasProduct[];
}

export interface ICategoriesHasProduct {
  categoriesId: string;
  productsId:   string;
  categories:   ICategories;
}

export interface ICategories {
  id:                        string;
  category:                  string;
  description:               string;
  pictureUrl:                string;
  storesId:                  string;
  masterInventoryCategoryId: null;
}

export interface IProductVariant {
  id:    string;
  name:  string;
  price: number;
}

export interface IDailySalesItem {
  id: string;
  products: IProduct;
  productId: string;
  productPrice: number;
  variantId: string | null;
  notes: string;
  qty: number;
  invoiceId: string;
  variant: null | IProductVariant;
  variantPrice: number;
  productDiscount: number | null;
}

export interface IInvoiceBundlingItem {
  id: string;
  invoiceId: string;
  invoiceDetailId: string;
  productId: string;
  qty: number;
  createdAt: string;
  updatedAt: string;
  products: IProduct;
}

export interface ICatalogBundling {
  id: string;
  storeId: string;
  pictureUrl?: string;
  name: string;
  description: string;
  type: string;
  discount?: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface IDailySalesInvoiceDetail {
  id: string;
  productId: string;
  productPrice: number;
  variantId: string | null;
  notes: string;
  qty: number;
  invoiceId: string;
  variantPrice: number;
  productDiscount: number | null;
  products: IProduct;
  variant: null | IProductVariant;
  catalogBundling: ICatalogBundling | null;
  invoiceBundlingItems: IInvoiceBundlingItem[];
}

export interface IDailySalesUser {
  id: number;
  username: string | null;
  email: string;
  fullname: string;
  phone: string;
  ext: number;
  roleId: string;
  pictureUrl: string | null;
  isStaff: boolean;
}

export interface IDailySales {
  id: string;
  paymentMethodsId: null;
  customerId: string;
  discountAmount: number;
  tableCode: string;
  paymentStatus: string;
  createdAt: Date;
  updateAt: Date;
  deleteAt: null;
  subtotal: number;
  orderType: string;
  paidAt: null;
  taxId: null;
  serviceChargeId: null;
  taxAmount: number;
  serviceChargeAmount: number;
  grandTotal: number;
  cashierId: number;
  invoiceNumber: string;
  storeId: string;
  completeOrderAt: null;
  orderStatus: string;
  paymentAmount: number;
  changeAmount: number;
  voucherAmount: number;
  voucherId: null;
  totalProductDiscount: null;
  roundingSettingId: null;
  roundingAmount: null;
  customer: ICustomer;
  users: IDailySalesUser;
  invoiceDetails: IDailySalesInvoiceDetail[];
  paymentMethods: null;
  queue: number;
  items?: IDailySalesItem[];
}

export interface ICustomer {
  id: string;
  name: string;
  code: string;
  number: string;
  dob: null;
  email: string;
  username: null;
  address: string;
  gender: string;
  tag: null;
  point: null;
  storesId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export interface IDailySalesListResponse {
  data: {
    items: IDailySales[] | [];
    meta: IPageMeta;
  };
}

export interface IDailySalesStateStore {
  dailySales_isLoading: boolean;
  dailySales_invoiceLists: IDailySalesListResponse;
}
