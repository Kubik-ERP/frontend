export const FINANCIALREPORT_PROFITANDLOST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Description',
    sortable: false,
    value: 'description',
  },
  {
    label: 'Nominal',
    sortable: true,
    value: 'nominal',
  },
];

export const FINANCIALREPORT_DISCOUNT_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Invoice ID',
    sortable: true,
    value: 'name',
  },
  {
    label: 'Price',
    sortable: false,
    value: 'price',
  },
  {
    label: 'Discount',
    sortable: false,
    value: 'discount',
  },
];

export const FINANCIALREPORT_PAYMENTMETHOD_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Payment Method',
    sortable: false,
    value: 'paymentMethod',
  },
  {
    label: 'Transaction',
    sortable: false,
    value: 'transaction',
  },
  {
    label: 'Nominal',
    sortable: false,
    value: 'nominal',
  },
];

export const FINANCIALREPORT_TAXANDSERVICECHARGE_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Type',
    sortable: false,
    value: 'type',
  },
  // {
  //   label: 'Rate (%)',
  //   sortable: false,
  //   value: 'rate',
  // },
  {
    label: 'Subtotal Applied',
    sortable: false,
    value: 'subtotalApplied',
  },
  {
    label: 'Nominal',
    sortable: false,
    value: 'nominal',
  },
];

export const LOSSREPORT_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Date',
    sortable: true,
    value: 'date',
  },
  {
    label: 'SKU',
    sortable: false,
    value: 'sku',
  },
  {
    label: 'Item Name',
    sortable: false,
    value: 'itemName',
  },
  {
    label: 'Notes',
    sortable: false,
    value: 'notes',
  },
  {
    label: 'Qty Loss',
    sortable: true,
    value: 'qtyLoss',
  },
  {
    label: 'Unit Cost',
    sortable: true,
    value: 'unitCost',
  },
  {
    label: 'Total Loss',
    sortable: true,
    value: 'totalLoss',
  },
  {
    label: 'Reported By',
    sortable: false,
    value: 'reportedBy',
  },
];

export const SALESREPORT_SALESBYITEM_COLUMNS: IColumnDataTable[] = [
  // {
  //   label: 'Product ID',
  //   sortable: true,
  //   value: 'productId',
  // },
  {
    label: 'Item Name',
    sortable: false,
    value: 'itemName',
  },
  {
    label: 'Category',
    sortable: false,
    value: 'category',
  },
  {
    label: 'Qty Sold',
    sortable: true,
    value: 'qtySold',
  },
  {
    label: 'Unit Price',
    sortable: false,
    value: 'unitPrice',
  },
  {
    label: 'Gross Sales',
    sortable: true,
    value: 'grossSales',
  },
  {
    label: 'Discount',
    sortable: true,
    value: 'discount',
  },
  {
    label: 'Net Sales',
    sortable: true,
    value: 'netSales',
  },
  {
    label: 'Tax',
    sortable: true,
    value: 'tax',
  },
  {
    label: 'Total Sales',
    sortable: true,
    value: 'totalSales',
  },
];

export const SALESREPORT_SALESBYORDERTYPE_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Invoice ID',
    sortable: true,
    value: 'invoiceId',
  },
  {
    label: 'Order Type',
    sortable: false,
    value: 'orderType',
  },
  {
    label: 'Gross Sales',
    sortable: true,
    value: 'grossSales',
  },
  {
    label: 'Tax',
    sortable: true,
    value: 'tax',
  },
  {
    label: 'Discount',
    sortable: true,
    value: 'discount',
  },
  {
    label: 'Net Sales',
    sortable: true,
    value: 'netSales',
  },
];

export const SALESREPORT_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Name',
    sortable: true,
    value: 'group',
  },
  {
    label: 'Qty Sold',
    sortable: true,
    value: 'jumlahTerjual',
  },
  {
    label: 'Gross Sales',
    sortable: true,
    value: 'kotor',
  },
  {
    label: 'Tax',
    sortable: true,
    value: 'pajak',
  },
  {
    label: 'Service Charge',
    sortable: true,
    value: 'biayaLayanan',
  },
  {
    label: 'Discount',
    sortable: true,
    value: 'diskonItem',
  },
  {
    label: 'Nett Sales',
    sortable: true,
    value: 'totalPenjualan',
  },
  {
    label: 'Voucher Used',
    sortable: true,
    value: 'countPenggunaanVoucher',
  },
];

export const MARKETINGREPORT_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Voucher Name',
    sortable: false,
    value: 'voucherName',
  },
  {
    label: 'Promo Code',
    sortable: false,
    value: 'promoCode',
  },
  {
    label: 'Validity Period',
    sortable: true,
    value: 'validityPeriod',
  },
  {
    label: 'Status',
    sortable: true,
    value: 'status',
  },
  {
    label: 'Total Usage',
    sortable: false,
    value: 'totalUsage',
  },
  {
    label: 'Total Quota',
    sortable: false,
    value: 'totalQuota',
  },
  {
    label: 'Remaining Quota',
    sortable: false,
    value: 'remainingQuota',
  },
];

export const CUSTOMERREPORT_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Name',
    sortable: true,
    value: 'nama',
  },
  {
    label: 'Gender',
    sortable: true,
    value: 'gender',
  },
  {
    label: 'Total Sales',
    sortable: true,
    value: 'totalSales',
  },
  {
    label: 'Date Added',
    sortable: true,
    value: 'dateAdded',
  },
  {
    label: 'Outstanding',
    sortable: true,
    value: 'outstanding',
  },
  {
    label: 'Loyalty Points',
    sortable: true,
    value: 'loyaltyPoints',
  },
];

// export const CUSTOMERREPORT_COLUMNS: IColumnDataTable[] = [
//   {
//     label: 'Name',
//     sortable: true,
//     value: 'nama',
//   },
//   {
//     label: 'Gender',
//     sortable: true,
//     value: 'gender',
//   },
//   {
//     label: 'Total Sales',
//     sortable: true,
//     value: 'totalSales',
//   },
//   {
//     label: 'Date Added',
//     sortable: true,
//     value: 'dateAdded',
//   },
//   {
//     label: 'Outstanding',
//     sortable: true,
//     value: 'outstanding',
//   },
//   {
//     label: 'Loyalty Points',
//     sortable: true,
//     value: 'loyaltyPoints',
//   },
// ]