export const STAFFREPORT_COMMISSION_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Staff Name',
    sortable: false,
    value: 'staffName',
  },
  {
    label: 'Total Invoices',
    sortable: true,
    value: 'totalInvoices',
  },
  {
    label: 'Total Items Sold',
    sortable: true,
    value: 'totalItemsSold',
  },
  {
    label: 'Total Revenue',
    sortable: true,
    value: 'totalRevenue',
  },
  {
    label: 'Total Vouchers Used',
    sortable: true,
    value: 'totalVouchersUsed',
  },
  {
    label: 'Total Item Commission',
    sortable: true,
    value: 'totalItemCommission',
  },
  {
    label: 'Total Voucher Commission',
    sortable: true,
    value: 'totalVoucherCommission',
  },
  {
    label: 'Grand Total Commission',
    sortable: true,
    value: 'grandTotalCommission',
  },
];

export const STAFFREPORT_INDIVIDUAL_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Invoice Number',
    sortable: true,
    value: 'invoiceNumber',
  },
  {
    label: 'Date',
    sortable: true,
    value: 'date',
  },
  {
    label: 'Customer',
    sortable: false,
    value: 'customer',
  },
  {
    label: 'Grand Total',
    sortable: true,
    value: 'grandTotal',
  },
  {
    label: 'Items Count',
    sortable: true,
    value: 'itemsCount',
  },
  {
    label: 'Total Commission',
    sortable: true,
    value: 'totalCommission',
  },
];

export const STAFFREPORT_COMMISSIONBYITEM_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Item Name',
    sortable: false,
    value: 'itemName',
  },
  {
    label: 'Item Price',
    sortable: true,
    value: 'itemPrice',
  },
  {
    label: 'Total Commission Accumulated',
    sortable: true,
    value: 'totalCommissionAccumulated',
  },
  {
    label: 'Average Commission Ratio',
    sortable: true,
    value: 'averageCommissionRatio',
  },
];

export const STAFFREPORT_COMMISSIONBYVOUCHER_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Voucher Name',
    sortable: false,
    value: 'voucherName',
  },
  {
    label: 'Total Commission',
    sortable: true,
    value: 'totalCommission',
  },
];
