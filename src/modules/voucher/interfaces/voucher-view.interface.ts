import { IVoucher } from ".";

export type IVoucherViewResponse = {
  statusCode: number;
  message?: string;
  data: IVoucher
};

export interface IVoucherViewProvided {
  voucherView_isLoading: globalThis.Ref<boolean>;
  voucherView_voucher: globalThis.Ref<IVoucherViewResponse | null>;
  voucherView_fetchVoucher: (voucherId: string) => Promise<void>;
  voucherView_handleEdit: (voucherId: string) => void;
}
