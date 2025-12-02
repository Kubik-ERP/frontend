export const COMMISSION_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Invoice ID',
    sortable: true,
    value: 'invoiceNumber',
  },
  {
    label: 'Paid Date',
    sortable: true,
    value: 'paidAt',
  },
  {
    label: 'Name',
    sortable: false,
    value: 'name',
  },
  {
    label: 'Type',
    sortable: false,
    value: 'sourceType',
  },
  {
    label: 'Commissions',
    sortable: true,
    value: 'commissionAmount',
  },
];

export const COMMISSION_TYPES = [
  {
    value: 'product',
    label: 'Product',
  },
  {
    value: 'voucher',
    label: 'Voucher',
  },
];
