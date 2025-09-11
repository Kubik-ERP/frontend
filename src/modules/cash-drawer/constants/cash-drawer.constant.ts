// Key Http Requests
export const CASH_DRAWER_DETAILS_REQUEST = 'CASH_DRAWER_DETAILS_REQUEST';
export const CASH_DRAWER_LIST_REQUEST = 'CASH_DRAWER_LIST_REQUEST';
export const CASH_DRAWER_OPEN_REQUEST = 'CASH_DRAWER_OPEN_REQUEST';
export const CASH_DRAWER_TRANSACTION_REQUEST = 'CASH_DRAWER_TRANSACTION_REQUEST';

export const CASH_DRAWER_LIST_SUGGESTION_REGISTER_BALANCE: number[] = [5000, 10000, 20000, 50000, 100000];
export const CASH_DRAWER_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Date',
    translationKey: 'cash-drawer.date',
    sortable: true,
    value: 'createdAt',
  },
  {
    label: 'Staff Name',
    translationKey: 'cash-drawer.staff-name',
    sortable: true,
    value: 'staffName',
  },
  {
    label: 'Expected Balance',
    translationKey: 'cash-drawer.expected-balance',
    sortable: true,
    value: 'expectedBalance',
  },
  {
    label: 'Actual Balance',
    translationKey: 'cash-drawer.actual-balance',
    sortable: true,
    value: 'actualBalance',
  },
  {
    label: 'Status',
    translationKey: 'cash-drawer.status',
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
    translationKey: 'cash-drawer.date',
    sortable: true,
    value: 'createdAt',
  },
  {
    label: 'Type',
    translationKey: 'cash-drawer.type',
    sortable: true,
    value: 'type',
  },
  {
    label: 'Notes',
    translationKey: 'cash-drawer.notes',
    sortable: true,
    value: 'notes',
  },
  {
    label: 'Cash In (+)',
    translationKey: 'cash-drawer.cash-in',
    sortable: true,
    value: 'amountIn',
  },
  {
    label: 'Cash Out (-)',
    translationKey: 'cash-drawer.cash-out',
    sortable: true,
    value: 'amountOut',
  },
  {
    label: 'Ending Balance',
    translationKey: 'cash-drawer.ending-balance',
    sortable: true,
    value: 'finalAmount',
  },
  {
    label: 'Cashier',
    translationKey: 'cash-drawer.cashier',
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
    translationKey: 'cash-drawer.cash-in',
    value: 1,
  },
  {
    label: 'Cash Out',
    translationKey: 'cash-drawer.cash-out',
    value: 3,
  },
  {
    label: 'Cash Refund',
    translationKey: 'cash-drawer.cash-refund',
    value: 4,
  },
  {
    label: 'Opening Balance',
    translationKey: 'cash-drawer.opening-balance',
    value: 0,
  },
  {
    label: 'Sale',
    translationKey: 'cash-drawer.sale',
    value: 2,
  },
  {
    label: 'Closing',
    translationKey: 'cash-drawer.closing',
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
