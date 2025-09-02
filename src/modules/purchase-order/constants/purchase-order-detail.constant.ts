export const PURCHASE_ORDER_DETAIL_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'SKU',
    sortable: false,
    value: 'sku',
  },
  {
    label: 'Item Name',
    sortable: false,
    value: 'name',
  },
  {
    label: 'Brand',
    sortable: false,
    value: 'brandName',
  },
  {
    label: 'Quantity',
    sortable: false,
    value: 'quantity',
  },
  {
    label: 'Unit',
    sortable: false,
    value: 'unit',
  },
  {
    label: 'Unit Price',
    sortable: false,
    value: 'unitPrice',
  },
  {
    label: 'Sub Total Price',
    sortable: false,
    value: 'totalPrice',
  },
];

// Request constants for HTTP abort functionality
export const PURCHASE_ORDER_DETAIL_REQUEST = 'PURCHASE_ORDER_DETAIL_REQUEST';
export const PURCHASE_ORDER_DETAIL_CONFIRM_REQUEST = 'PURCHASE_ORDER_DETAIL_CONFIRM_REQUEST';
export const PURCHASE_ORDER_DETAIL_CANCEL_REQUEST = 'PURCHASE_ORDER_DETAIL_CANCEL_REQUEST';
export const PURCHASE_ORDER_DETAIL_SHIP_REQUEST = 'PURCHASE_ORDER_DETAIL_SHIP_REQUEST';
export const PURCHASE_ORDER_DETAIL_RECEIVE_REQUEST = 'PURCHASE_ORDER_DETAIL_RECEIVE_REQUEST';
export const PURCHASE_ORDER_DETAIL_PAY_REQUEST = 'PURCHASE_ORDER_DETAIL_PAY_REQUEST';
