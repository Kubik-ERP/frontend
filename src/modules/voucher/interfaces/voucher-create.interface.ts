import { Ref } from "vue";
import { IProduct } from "@/modules/catalog-product/interfaces";
import type { Validation } from '@vuelidate/core';

/**
 * @description  Voucher type
 */
export interface IVoucher {
  id: string;
  name: string;
  amount: number;
  minPrice?: number;
  promoCode: string;
  startPeriod: string;  // "YYYY-MM-DD"
  endPeriod: string;    // "YYYY-MM-DD"
  status: string;
  quota?: number;
  isPercent: boolean;
  hasProducts: {
    type: "all" | "specific";
    products: string[];
  };
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Create Request
 */

export interface IVoucherCreateRequest {
  name: string;
  amount: number;
  minPrice?: number;
  promoCode: string;
  startPeriod: string; // "YYYY-MM-DD"
  endPeriod: string;   // "YYYY-MM-DD"
  status: string;
  quota?: number;
  isPercent: boolean;
  hasProducts: {
    type: "all" | "specific";
    products: string[];
  };
}

export interface IVoucherCreateResponse {
  statusCode: number;
  message: string;
  data: IVoucher;
}

export interface IVoucherDetailsResponse {
  voucher: IVoucher;
}

/* ===========================
   3️⃣ Form Data untuk Vue
   =========================== */

export interface IVoucherFormData {
  name: string;
  code: string;
  amount: number;
  minPrice?: number;
  startDate: string;
  endDate: string;
  status: string;
  quota?: number;
  is_percentage: boolean; // mapping ke isPercent di API
  products: string[];     // list id product jika "specific"
  maxDiscountPrice?: number; // untuk voucher diskon maksimal
  type: "all" | "specific";
}

/* ===========================
   4️⃣ Utility Mapping
   =========================== */

export const mapFormToVoucherPayload = (
  form: IVoucherFormData
): IVoucherCreateRequest => {
  return {
    name: form.name,
    amount: form.amount,
    minPrice: form.minPrice,
    promoCode: form.code,
    startPeriod: form.startDate,
    endPeriod: form.endDate,
    status: form.status,
    quota: form.quota,
    isPercent: form.is_percentage,
    hasProducts: {
      type: form.type,
      products: form.products,
    },
  };
};


/* ===========================
   5️⃣ Provided Type untuk Store / Composable
   =========================== */

export interface IVoucherCreateProvided {
  voucherFormData: Ref<IVoucherFormData>;
  voucherFormDataValidations: globalThis.Ref<Validation>
  voucherFormIsLoading: Ref<boolean>;
  voucherFormOnCancel: () => void;
  voucherFormOnSubmit: () => Promise<void>;
  voucherFormReset: () => void;
  voucherFormFetchData: () => Promise<void>;
  voucherProductList: Ref<IProduct[]>;
  voucherFormIsValid: Ref<boolean>;
}
