export interface IFinancialReport_profitAndLost {
  totalPenjualan: number;
  costOfGoodsSold: number;
  grossProfit: number;
  operatingExpense: number;
  netProfit: number;
}
export interface IFinancialReport_cashInOut {
  id: string;
  date: string;
  type: 'Cash In' | 'Cash Out';
  notes: string;
  nominal: number;
}
export interface IFinancialReport_paymentMethod {
  simpleWidget: {
    totalTransaksi: number;
    pendapatanKotor: number;
    totalRefund: number;
    totalPenggunaanVoucher: number;
    nettSummary: number;
  };
  paymentList: {
    reportData: Array<{
      paymentMethod: string;
      transaction: number | string;
      nominal: number;
    }>;
    totals: {
      transaction: number | string;
      nominal: number;
    };
  };
}
export interface IFinancialReport_taxServiceCharge {
  type: string;
  rate: number;
  subtotalApplied: number;
  nominal: number;
}
