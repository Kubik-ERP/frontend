// Components
import SalesOrderCashDrawer from '../components/SalesOrderCashDrawer.vue';
import SalesOrderCashInOut from '../components/SalesOrderCashInOut.vue';
import SalesOrderDailySales from '../components/SalesOrderDailySales.vue';
import SalesOrderVoucher from '../components/SalesOrderVoucher.vue';

export const LIST_COLUMNS_OF_CASH_DRAWER: IColumnDataTable[] = [
  {
    label: 'Date',
    sortable: true,
    value: 'createdAt',
  },
  {
    label: 'Staff Name',
    sortable: true,
    value: 'staffName',
  },
  {
    label: 'Expected Balance',
    sortable: true,
    value: 'expectedBalance',
  },
  {
    label: 'Actual Balance',
    sortable: true,
    value: 'actualBalance',
  },
  {
    label: 'Status',
    sortable: true,
    value: 'status',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
  }
]

export const LIST_COLUMNS_OF_CASH_IN_OUT: IColumnDataTable[] = [
  {
    label: 'Date',
    sortable: true,
    value: 'createdAt',
  },
  {
    label: 'Type',
    sortable: true,
    value: 'type',
  },
  {
    label: 'Title',
    sortable: true,
    value: 'title',
  },
  {
    label: 'Notes',
    sortable: true,
    value: 'notes',
  },
  {
    label: 'Amount',
    sortable: true,
    value: 'amount',
  },
  {
    label: '',
    sortable: false,
    value: 'createdBy',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
  },
];

export const LIST_COLUMNS_OF_DAILY_SALES: IColumnDataTable[] = [
  {
    label: 'Invoice ID',
    sortable: true,
    value: 'invoiceId',
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
    value: 'tableNumber',
  },
  {
    label: 'Total Price',
    sortable: true,
    value: 'price',
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

export const LIST_ITEMS_OF_SPLIT_BUTTON: ISplitButton[] = [
  {
    iconName: 'edit',
    label: 'Edit',
  },
  {
    iconName: 'delete',
    label: 'Delete',
  },
];

export const LIST_TABS_SALES_ORDER: ITabs[] = [
  {
    component: SalesOrderDailySales,
    label: 'Daily Sales',
    value: 'daily-sales',
  },
  {
    component: SalesOrderVoucher,
    label: 'Voucher',
    value: 'voucher',
  },
  {
    component: SalesOrderCashDrawer,
    label: 'Cash Drawer',
    value: 'cash-drawer',
  },
  {
    component: SalesOrderCashInOut,
    label: 'Cash In/Out',
    value: 'cash-in-out',
  },
];

export const LIST_TYPES_OF_CASH_IN_OUT: IDropdownItem[] = [
  {
    label: 'Cash In',
    value: 'Cash In',
  },
  {
    label: 'Cash Out',
    value: 'Cash Out',
  },
];

export const LIST_TYPES_OF_ORDER_TYPE: IDropdownItem[] = [
  {
    label: 'Dine In',
    value: 'Dine In',
  },
  {
    label: 'Takeaway',
    value: 'Takeaway',
  },
  {
    label: 'Self Order',
    value: 'Self Order',
  },
];

export const LIST_TYPES_OF_PAYMENT_STATUS: IDropdownItem[] = [
  {
    label: 'Paid',
    value: 'Paid',
  },
  {
    label: 'Unpaid',
    value: 'Unpaid',
  },
  {
    label: 'Cancelled',
    value: 'Cancelled',
  },
  {
    label: 'Refunded',
    value: 'Refunded',
  },
];

export const LIST_TYPES_OF_ORDER_STATUS: IDropdownItem[] = [
  {
    label: 'In Progress',
    value: 'In Progress',
  },
  {
    label: 'Waiting',
    value: 'Waiting',
  },
  {
    label: 'Served',
    value: 'Served',
  },
  {
    label: 'Cancelled',
    value: 'Cancelled',
  },
];

export const LIST_VALUES_OF_CASH_DRAWER = [
  {
    createdAt: '01/08/2024',
    staffName: 'Bessie Cooper',
    expectedBalance: 100000,
    actualBalance: null,
    status: 'Open',
  },
  {
    createdAt: '01/08/2024',
    staffName: 'Esther Howard',
    expectedBalance: 1200000,
    actualBalance: 1150000,
    status: 'Open',
  },
  {
    createdAt: '01/08/2024',
    staffName: 'Eleanor Pena',
    expectedBalance: 500000,
    actualBalance: 500000,
    status: 'Close',
  },
  {
    createdAt: '01/08/2024',
    staffName: 'Jacob Jones',
    expectedBalance: 800000,
    actualBalance: null,
    status: 'Open',
  },
]

export const LIST_VALUES_OF_CASH_IN_OUT = [
  {
    type: 'Cash Out',
    title: 'Electricity Bill',
    notes: 'Electricity bill for the month of January',
    amount: 100000,
    createdAt: '01/08/2024 10:00 AM',
    createdBy: 'John Doe',
  },
  {
    type: 'Cash In',
    title: 'Added small change',
    notes: 'Added small change to the cash register',
    amount: 50000,
    createdAt: '01/08/2024 10:00 AM',
    createdBy: 'John Doe',
  },
];

export const LIST_VALUES_OF_DAILY_SALES = [
  {
    invoiceId: '#202408010010',
    createdAt: '01/08/2024',
    customer: 'Bessie Cooper',
    tableNumber: 'A1, A2',
    price: 100000,
    orderType: 'Dine In',
    paymentStatus: 'Paid',
    orderStatus: 'Waiting',
  },
  {
    invoiceId: '#202408010009',
    createdAt: '01/08/2024',
    customer: 'Esther Howard',
    tableNumber: 'A2',
    price: 200000,
    orderType: 'Takeaway',
    paymentStatus: 'Unpaid',
    orderStatus: 'In Progress',
  },
  {
    invoiceId: '#202408010008',
    createdAt: '01/08/2024',
    customer: 'Eleanor Pena',
    tableNumber: 'A1',
    price: 150000,
    orderType: 'Self Order',
    paymentStatus: 'Cancelled',
    orderStatus: 'Served',
  },
  {
    invoiceId: '#202408010007',
    createdAt: '01/08/2024',
    customer: 'Jacob Jones',
    tableNumber: 'B1, B9, B10',
    price: 300000,
    orderType: 'Dine In',
    paymentStatus: 'Paid',
    orderStatus: 'Cancelled',
  },
];
