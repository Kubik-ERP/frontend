export interface IVoucherReport {
  voucherName: string;
  promoCode: string;
  validityPeriod: string;
  status: 'Aktif' | 'Kedaluwarsa';
  totalQuota: number;
  totalUsage: number;
  remainingQuota: number;
}
