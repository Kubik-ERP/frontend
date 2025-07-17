export const DAILY_SALES_LIST_REQUEST = 'QUEUE_LIST_REQUEST'

export const QUEUE_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: '#',
    sortable: true,
    value: 'index',
  },
  {
    label: 'Invoice ID',
    sortable: true,
    value: 'orderNumber',
  },
  {
    label: 'Purchase Date',
    sortable: true,
    value: 'createdAt',
  },
  {
    label: 'Customer',
    sortable: false,
    value: 'customer',
  },
  {
    label: 'Table Number',
    sortable: false,
    value: 'tableNumber',
  },
  {
    label: 'Order Type',
    sortable: false,
    value: 'orderType',
  },
  {
    label: 'Order Status',
    sortable: false,
    value: 'orderStatus',
  },
  {
    label: 'Duration',
    sortable: false,
    value: 'duration',
  },
];

export const ORDER_TYPE_LIST = [
  {
    label: 'Dine In',
    value: 'dine_in',
  },
  {
    label: 'Takeaway',
    value: 'take_away',
  },
  {
    label: 'Self Order',
    value: 'self_order',
  },

]

export const ORDER_STATUS_LIST = [
  {
    label: 'Placed',
    value: 'placed',
  },
  {
    label: 'In Progress',
    value: 'in_progress',
  },
  {
    label: 'Served',
    value: 'served',
  },
  {
    label: 'Complete',
    value: 'completed',
  },
  {
    label: 'Cancelled',
    value: 'cancelled',
  },
];

export const QUEUE_LIST_VALUES = [
  {
    orderNumber: '#202408010010',
    purchaseDate: '01/08/2024',
    customer: 'Bessie Cooper',
    tableNumber: 'A1, A2',
    orderType: 'Dine In',
    orderStatus: 'Served',
    duration: '21:30',
  },
  {
    orderNumber: '#202408010009',
    purchaseDate: '01/08/2024',
    customer: 'Esther Howard',
    tableNumber: '-',
    orderType: 'Takeaway',
    orderStatus: 'Complete',
    duration: '10:00',
  },
  {
    orderNumber: '#202408010008',
    purchaseDate: '01/08/2024',
    customer: 'Brooklyn Simmons',
    tableNumber: 'A3',
    orderType: 'Self Order',
    orderStatus: 'Complete',
    duration: '-',
  },
  {
    orderNumber: '#202408010007',
    purchaseDate: '01/08/2024',
    customer: 'Cameron Williamson',
    tableNumber: 'A4',
    orderType: 'Self Order',
    orderStatus: 'Complete',
    duration: '-',
  },
  {
    orderNumber: '#202408010006',
    purchaseDate: '01/08/2024',
    customer: 'Leslie Alexander',
    tableNumber: 'A5',
    orderType: 'Dine In',
    orderStatus: 'In Progress',
    duration: '-',
  },
  {
    orderNumber: '#202408010005',
    purchaseDate: '01/08/2024',
    customer: 'Guy Hawkins',
    tableNumber: 'B1, B9, B10',
    orderType: 'Dine In',
    orderStatus: 'In Progress',
    duration: '08:10',
  },
  {
    orderNumber: '#202408010004',
    purchaseDate: '01/08/2024',
    customer: 'Floyd Miles',
    tableNumber: 'B2',
    orderType: 'Dine In',
    orderStatus: 'Served',
    duration: '10:15',
  },
  {
    orderNumber: '#202408010003',
    purchaseDate: '01/08/2024',
    customer: 'Marvin McKinney',
    tableNumber: '-',
    orderType: 'Takeaway',
    orderStatus: 'Canceled',
    duration: '-',
  },
  {
    orderNumber: '#202408010002',
    purchaseDate: '01/08/2024',
    customer: 'Robert Fox',
    tableNumber: '-',
    orderType: 'Takeaway',
    orderStatus: 'Served',
    duration: '15:55',
  },
  {
    orderNumber: '#202408010001',
    purchaseDate: '01/08/2024',
    customer: 'Jacob Jones',
    tableNumber: 'B5',
    orderType: 'Dine In',
    orderStatus: 'Canceled',
    duration: '-',
  },
];
