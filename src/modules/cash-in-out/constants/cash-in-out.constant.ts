export const CASH_IN_OUT_LIST_COLUMNS: IColumnDataTable[] = [
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

export const CASH_IN_OUT_LIST_VALUES = [
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

export const CASH_IN_OUT_LIST_TYPES_OF_CASH_IN_OUT: IDropdownItem[] = [
  {
    label: 'Cash In',
    value: 'Cash In',
  },
  {
    label: 'Cash Out',
    value: 'Cash Out',
  },
];
