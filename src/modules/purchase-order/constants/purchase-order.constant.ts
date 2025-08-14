export const PURCHASE_ORDER_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'PO Number',
    sortable: true,
    value: 'orderNumber',
  },
  {
    label: 'Supplier',
    sortable: true,
    value: 'supplierName',
  },
  {
    label: 'Order Date',
    sortable: true,
    value: 'orderDate',
  },
  {
    label: 'Delivery Date',
    sortable: true,
    value: 'deliveryDate',
  },
  {
    label: 'Order Status',
    sortable: true,
    value: 'orderStatus',
  },
  {
    label: 'Total Price',
    sortable: true,
    value: 'totalPrice',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
  },
];

export const PURCHASE_ORDER_LIST_VALUES = [
  {
    poNumber: 'PO-010',
    supplierName: 'PT Tiga Sedulur Djaja',
    orderDate: '07/03/2025',
    deliveryDate: null,
    orderStatus: 'Canceled',
    totalPrice: 100000,
  },
  {
    poNumber: 'PO-009',
    supplierName: 'Pabrik Gula Nusantara',
    orderDate: '06/03/2025',
    deliveryDate: null,
    orderStatus: 'Pending',
    totalPrice: 150000,
  },
  {
    poNumber: 'PO-006',
    supplierName: 'PT Ultrajaya Milk Industry',
    orderDate: '06/03/2025',
    deliveryDate: '08/03/2025',
    orderStatus: 'Confirmed',
    totalPrice: 200000,
  },
  {
    poNumber: 'PO-004',
    supplierName: 'PT David Roy Indonesia',
    orderDate: '05/03/2025',
    deliveryDate: '07/03/2025',
    orderStatus: 'Shipped',
    totalPrice: 120000,
  },
  {
    poNumber: 'PO-002',
    supplierName: 'Unilever Indonesia',
    orderDate: '03/03/2025',
    deliveryDate: '05/03/2025',
    orderStatus: 'Received',
    totalPrice: 80000,
  },
  {
    poNumber: 'PO-001',
    supplierName: 'Indofood Distributor',
    orderDate: '05/03/2025',
    deliveryDate: '06/03/2025',
    orderStatus: 'Paid',
    totalPrice: 50000,
  },
];

// Request constants
export const PURCHASE_ORDER_LIST_REQUEST = 'PURCHASE_ORDER_LIST_REQUEST';
export const PURCHASE_ORDER_CANCEL_REQUEST = 'PURCHASE_ORDER_CANCEL_REQUEST';
export const PURCHASE_ORDER_CONFIRM_REQUEST = 'PURCHASE_ORDER_CONFIRM_REQUEST';
export const PURCHASE_ORDER_SHIP_REQUEST = 'PURCHASE_ORDER_SHIP_REQUEST';
export const PURCHASE_ORDER_RECEIVE_REQUEST = 'PURCHASE_ORDER_RECEIVE_REQUEST';
export const PURCHASE_ORDER_PAY_REQUEST = 'PURCHASE_ORDER_PAY_REQUEST';
