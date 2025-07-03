export const SALES_INVOICE_LIST_REQUEST = 'SALES_INVOICE_LIST_REQUEST';

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
    sortable: false,
    value: 'tableNumber',
  },
  {
    label: 'Total Price',
    sortable: true,
    value: 'totalPrice',
  },
  {
    label: 'Status',
    sortable: false,
    value: 'status',
  },
  {
    label: 'Order Type',
    sortable: false,
    value: 'orderType',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
  },
];


export const SALES_INVOICE_VALUES = [
  {
    invoiceID: '#202408010012',
    purchaseDate: '01/08/2024',
    tableNumber: 'A1, A2',
    totalPrice: 100000,
    status: 'Refunded',
    orderType: 'Takeaway',
  },
  {
    invoiceID: '#202408010011',
    purchaseDate: '01/08/2024',
    tableNumber: 'A1, A2',
    totalPrice: 100000,
    status: 'Paid',
    orderType: 'Takeaway',
  },
  {
    invoiceID: '#202408010010',
    purchaseDate: '01/08/2024',
    tableNumber: 'A1, A2',
    totalPrice: 100000,
    status: 'Unpaid',
    orderType: 'Dine In',
  },
  {
    invoiceID: '#202408010009',
    purchaseDate: '01/08/2024',
    tableNumber: 'A1',
    totalPrice: 100000,
    status: 'Cancelled',
    orderType: 'Dine In',
  },
];

export const SALES_INVOICE_ORDER_TYPE = [
  {
    label: 'Dine In',
    value: 'Dine In',
  },
  {
    label: 'Takeaway',
    value: 'Takeaway',
  },
  {
    label: 'Delivery',
    value: 'Delivery',
  },
];

export const SALES_INVOICE_PAYMENT_STATUS = [
  {
    label: 'Unpaid',
    value: 'Unpaid',
  },
  {
    label: 'Paid',
    value: 'Paid',
  },
  {
    label: 'Refunded',
    value: 'Refunded',
  },
  {
    label: 'Cancelled',
    value: 'Cancelled',
  },
];