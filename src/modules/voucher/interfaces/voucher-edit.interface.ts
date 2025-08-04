import { IVoucher } from ".";

export interface IVoucherEditRequest {
  name: string;
  promoCode: string;
  amount: number;
  minPrice: number;
  maxPrice: number;
  startPeriod: string;
  endPeriod: string;
  status: 'active' | 'expired' | 'upcoming';
  quota: number;
  isPercent: boolean;
  hasProducts: {
    type: 'all' | 'specific';
    products: string[];
  };
}



export type IVoucherEditResponse = {
  statusCode: number;
  message: string;
  data: IVoucher
}

export const mapFormToVoucherPayload = (
  form: IVoucherEditRequest
): IVoucherEditRequest => {
  return {
    name: form.name,
    amount: form.amount,
    minPrice: form.minPrice,
    maxPrice: form.maxPrice,
    promoCode: form.promoCode,
    startPeriod: form.startPeriod ? form.startPeriod.replace(/-/g, "/") : "",
    endPeriod: form.endPeriod ? form.endPeriod.replace(/-/g, "/") : "",
    status: form.status,
    quota: form.quota,
    isPercent: form.isPercent,
    hasProducts: {
      type: form.hasProducts.type,
      products: form.hasProducts.products,
    },
  };
};

export type IVoucherEditProvided = {
    voucherEdit_formData: globalThis.Ref<IVoucherEditRequest>
    voucherEdit_isLoading: globalThis.Ref<boolean>;
    voucherEdit_Response: globalThis.Ref<IVoucherEditResponse | null>;
    voucherEdit_ResponseUpdate: globalThis.Ref<IVoucherEditResponse | null>;
    voucherEdit_fetchVoucher: (voucherId: string) => Promise<void>;
    voucherEdit_handleUpdate: (voucherId: string) => void;
    voucherEdit_handleCancel: () => void;
}
