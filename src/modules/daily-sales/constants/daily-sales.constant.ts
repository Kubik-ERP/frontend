// Key Http Requests
export const DAILY_SALES_LIST_REQUEST = 'DAILY_SALES_LIST_REQUEST';

export const DAILY_SALES_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Invoice ID',
    sortable: true,
    value: 'invoiceNumber',
    width: '150px'
  },
  {
    label: 'Purchase Date',
    sortable: true,
    value: 'createdAt',
    width: '180px'
  },
  {
    label: 'Customer',
    sortable: false,
    value: 'customer',
    width: '170px'
  },
  {
    label: 'Table Number',
    sortable: false,
    value: 'tableCode',
    width: '130px'
  },
  {
    label: 'Total Price',
    sortable: false,
    value: 'grandTotal',
    width: '150px'
  },
  {
    label: 'Order Type',
    sortable: false,
    value: 'orderType',
    width: '140px'
  },
  {
    label: 'Payment Method',
    sortable: false,
    value: 'paymentMethod',
    width: '160px'
  },
  {
    label: 'Payment Status',
    sortable: false,
    value: 'paymentStatus',
    width: '150px'
  },
  {
    label: 'Order Status',
    sortable: false,
    value: 'orderStatus',
    width: '140px'
  },
  {
    label: 'Served By',
    sortable: false,
    value: 'servedBy',
    width: '150px'
  },
  {
    label: '',
    sortable: false,
    value: 'action',
    width: '100px'
  },
];

export const DAILY_SALES_LIST_TYPES_OF_ORDER_TYPE: IDropdownItem[] = [
  {
    label: 'Dine In',
    value: 'dine_in',
  },
  {
    label: 'Take Away',
    value: 'take_away',
  },
  {
    label: 'Self Order',
    value: 'self_order',
  },
];

export const DAILY_SALES_LIST_TYPES_OF_PAYMENT_STATUS: IDropdownItem[] = [
  {
    label: 'Paid',
    value: 'paid',
  },
  {
    label: 'Unpaid',
    value: 'unpaid',
  },
  {
    label: 'Cancelled',
    value: 'cancelled',
  },
  {
    label: 'Refunded',
    value: 'refunded',
  },
];

export const DAILY_SALES_LIST_TYPES_OF_ORDER_STATUS: IDropdownItem[] = [
  {
    label: 'Placed',
    value: 'placed',
  },
  {
    label: 'In Progress',
    value: 'in_progress',
  },
  {
    label: 'Waiting',
    value: 'waiting',
  },
  {
    label: 'Completed',
    value: 'completed',
  },
  {
    label: 'Served',
    value: 'served',
  },
  {
    label: 'Cancelled',
    value: 'cancelled',
  },
];
