export interface IStaffReport_Commission {
  dashboard: IStaffReport_Commission_Dashboard;
  table: IStaffReport_Commission_Table[];
}

interface IStaffReport_Commission_Dashboard {
  totalStaff: number;
  totalInvoices: number;
  totalRevenue: number;
  totalItemCommission: number;
  totalVoucherCommission: number;
  grandTotalCommission: number;
}

interface IStaffReport_Commission_Table {
  staffName: string;
  totalInvoices: number;
  totalItemsSold: number;
  totalRevenue: number;
  totalVouchersUsed: number;
  totalItemCommission: number;
  totalVoucherCommission: number;
  grandTotalCommission: number;
}

interface IStaffReport_Individual_Dashboard {
  totalInvoicesServed: number;
  totalItemsSold: number;
  totalVouchersUsed: number;
  totalItemCommission: number;
  totalVoucherCommission: number;
  grandTotalCommission: number;
}

interface IStaffReport_Individual_Table {
  invoiceNumber: string;
  date: string;
  customer: string;
  grandTotal: number;
  itemsCount: number;
  totalCommission: number;
}

export interface IStaffReport_Individual {
  dashboard: IStaffReport_Individual_Dashboard;
  table: IStaffReport_Individual_Table[];
}

export interface IStaffReport_CommissionByItem {
  dashboard: null;
  table: IStaffReport_CommissionByItem_Data[];
}

interface IStaffReport_CommissionByItem_Data {
  itemName: string;
  itemPrice: number;
  totalCommissionAccumulated: number;
  averageCommissionRatio: number;
}

export interface IStaffReport_CommissionByVoucher {
  dashboard: null;
  table: IStaffReport_CommissionByVoucher_Data[];
}

interface IStaffReport_CommissionByVoucher_Data {
  voucherName: string;
  totalCommission: number;
}
