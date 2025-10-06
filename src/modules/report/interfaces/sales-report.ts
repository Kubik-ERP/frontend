export interface ISalesReport_salesByItem {
  productId: string;
  itemName: string;
  category: string;
  qtySold: number;
  unitPrice: number;
  grossSales: number;
  discount: number;
  netSales: number;
  tax: number;
  totalSales: number;
}

export interface ISalesReport_salesByOrderType {
  invoiceId: string;
  orderType: string;
  grossSales: number;
  tax: number;
  discount: number;
  netSales: number;
}

interface ISummary {
  group: string;
  jumlahTerjual: number;
  kotor: number;
  diskonItem: number;
  refund: number;
  pajak: number;
  biayaLayanan: number;
  totalPenjualan: number;
  countPenggunaanVoucher: number;
}

export interface ISalesReport {
  overallSummary: ISummary;
  groupedSummary: ISummary[];
}
