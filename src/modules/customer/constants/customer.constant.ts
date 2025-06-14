export const SALES_INVOICE_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Invoice ID',
    sortable: true,
    value: 'invoiceID',
  },
  {
    label: 'Purchase Date',
    sortable: true,
    value: 'purchaseDate',
  },
  {
    label: 'Table Number',
    sortable: true,
    value: 'tableNumber',
  },
  {
    label: 'Total Price',
    sortable: true,
    value: 'totalPrice',
  },
  {
    label: 'Status',
    sortable: true,
    value: 'status',
  },
  {
    label: 'Order Type',
    sortable: true,
    value: 'orderType',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
  },
];

export const SALES_INVOICE_ITEMS_OF_SPLIT_BUTTON: ISplitButton[] = [
  {
    iconName: 'eye-visible',
    label: 'Preview',
  },
];

export const SALES_INVOICE_VALUES = [
  {
    invoiceID: '#202408010010',
    purchaseDate: '01/08/2024',
    tableNumber: 'A1, A2',
    totalPrice: 100000,
    status: 'Paid',
    orderType: 'Dine In',
  },
  {
    invoiceID: '#202408010009',
    purchaseDate: '01/08/2024',
    tableNumber: 'A1',
    totalPrice: 100000,
    status: 'Paid',
    orderType: 'Dine In',
  },
];