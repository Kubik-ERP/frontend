// Key Http Requests
export const DAILY_SALES_LIST_REQUEST = 'DAILY_SALES_LIST_REQUEST';

export const DAILY_SALES_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Invoice ID',
    sortable: true,
    value: 'id',
  },
  {
    label: 'Purchase Date',
    sortable: true,
    value: 'createdAt',
  },
  {
    label: 'Customer',
    sortable: true,
    value: 'customer',
  },
  {
    label: 'Table Number',
    sortable: true,
    value: 'tableCode',
  },
  {
    label: 'Total Price',
    sortable: true,
    value: 'grandTotal',
  },
  {
    label: 'Order Type',
    sortable: true,
    value: 'orderType',
  },
  {
    label: 'Payment Status',
    sortable: true,
    value: 'paymentStatus',
  },
  {
    label: 'Order Status',
    sortable: true,
    value: 'orderStatus',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
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
    label: 'In Progress',
    value: 'in_progress',
  },
  {
    label: 'Waiting',
    value: 'waiting',
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
