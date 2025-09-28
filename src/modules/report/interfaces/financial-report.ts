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
  reportData: {
    paymentMethod: string;
    transaction: number;
    nominal: number;
  }[];
  totals: {
    transaction: number;
    nominal: number;
  };
}
export interface IFinancialReport_taxServiceCharge {
  type: string;
  rate: number;
  subtotalApplied: number;
  nominal: number;
}
