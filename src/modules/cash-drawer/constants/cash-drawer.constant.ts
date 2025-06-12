// Key Http Requests
export const CASH_DRAWER_LIST_REQUEST = 'CASH_DRAWER_LIST_REQUEST';
export const CASH_DRAWER_OPEN_REQUEST = 'CASH_DRAWER_OPEN_REQUEST';

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
