export * from './voucher-list.interface';
export * from './voucher-create.interface';

export type IVoucher = {
  id: string;
  name: string;
  promoCode: string;
  amount: number;
  minPrice: number;
  maxPrice: number;
  quota: number;
  startPeriod: string;
  endPeriod: string;
  isPercent: boolean;
  status: 'active' |  'expired' | 'upcoming'
  voucherHasProducts? : IVoucherHasProducts[]
  isApplyAllProducts: boolean,
  createdAt: string;
  updatedAt: string;
};

type IVoucherHasProducts = {
  voucherId: string;
  productsId: string;
  products: IProductVoucher
};

type IProductVoucher = {
  id: string;
  name: string;
  category: IVoucherProductCategory[];
  price: number;
  discountPrice: number;
}

type IVoucherProductCategory ={
  id: string,
  name: string
}


export type IVoucherListResponse = {
  statusCode: number;
  message?: string;
  data: {
    items: IVoucher[] | [];
    meta: IPageMeta;
  };
};

export type IVoucherActiveResponse = {
   statusCode: number;
  message?: string;
  data: IVoucher[] | []
}

export type IVoucherStateStore = {
  voucher_isLoading: boolean;
  voucher_lists: IVoucherListResponse;
};
