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
