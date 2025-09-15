// Key Http Requests
export const CASH_DRAWER_DETAILS_REQUEST = 'CASH_DRAWER_DETAILS_REQUEST';
export const CASH_DRAWER_LIST_REQUEST = 'CASH_DRAWER_LIST_REQUEST';
export const CASH_DRAWER_OPEN_REQUEST = 'CASH_DRAWER_OPEN_REQUEST';
export const CASH_DRAWER_TRANSACTION_REQUEST = 'CASH_DRAWER_TRANSACTION_REQUEST';
export const CASH_DRAWER_STATUS_REQUEST = 'CASH_DRAWER_STATUS_REQUEST';

export const CASH_DRAWER_LIST_SUGGESTION_REGISTER_BALANCE: number[] = [5000, 10000, 20000, 50000, 100000];
export const CASH_DRAWER_LIST_COLUMNS: IColumnDataTable[] = [
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
  },
];

export const CASH_DRAWER_LIST_COLUMNS_OF_CASH_REGISTER: IColumnDataTable[] = [
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
    label: 'Notes',
    sortable: true,
    value: 'notes',
  },
  {
    label: 'Cash In (+)',
    sortable: true,
    value: 'amountIn',
  },
  {
    label: 'Cash Out (-)',
    sortable: true,
    value: 'amountOut',
  },
  {
    label: 'Ending Balance',
    sortable: true,
    value: 'finalAmount',
  },
  {
    label: 'Cashier',
    sortable: true,
    value: 'cashierName',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
  },
];

export const CASH_DRAWER_LIST_TYPES_OF_CASH_REGISTER: IDropdownItem[] = [
  {
    label: 'Cash In',
    value: 1,
  },
  {
    label: 'Cash Out',
    value: 3,
  },
  {
    label: 'Cash Refund',
    value: 4,
  },
  {
    label: 'Opening Balance',
    value: 0,
  },
  {
    label: 'Sale',
    value: 2,
  },
  {
    label: 'Closing',
    value: 5,
  },
];

export const CASH_DRAWER_LIST_VALUES_OF_CASH_REGISTER = [
  {
    createdAt: '01/08/2024 11:18 AM',
    type: 'Sale',
    notes: 'Transaction #202503080004',
    cashIn: 100000,
    cashOut: 0,
    endingBalance: 700000,
    cashierName: 'Samantha',
  },
  {
    createdAt: '01/08/2024 11:20 AM',
    type: 'Cash Refund',
    notes: 'Refund for order #202503080002',
    cashIn: 0,
    cashOut: 100000,
    endingBalance: 600000,
    cashierName: 'Samantha',
  },
  {
    createdAt: '01/08/2024 11:22 AM',
    type: 'Cash Out',
    notes: 'Supplies',
    cashIn: 0,
    cashOut: 200000,
    endingBalance: 400000,
    cashierName: 'Samantha',
  },
  {
    createdAt: '01/08/2024 11:25 AM',
    type: 'Cash In',
    notes: 'Added small change',
    cashIn: 100000,
    cashOut: 0,
    endingBalance: 500000,
    cashierName: 'Samantha',
  },
  {
    createdAt: '01/08/2024 11:30 AM',
    type: 'Opening Balance',
    notes: 'Initial cash balance for the day',
    cashIn: 500000,
    cashOut: 0,
    endingBalance: 500000,
    cashierName: 'Samantha',
  },
];
