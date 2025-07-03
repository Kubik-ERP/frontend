export const LOYALTY_POINT_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Invoice ID',
    sortable: true,
    value: 'invoiceID',
  },
  {
    label: 'Purchase Date',
    sortable: true,
    value: 'purchaseDate',
  },
  {
    label: 'Type',
    sortable: false,
    value: 'type',
  },
  {
    label: 'Points',
    sortable: true,
    value: 'points',
  },
  {
    label: 'Expiry Date',
    sortable: true,
    value: 'expiryDate',
  },
  {
    label: 'Notes',
    sortable: false,
    value: 'notes',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
  },
];

export const LOYALTY_POINT_TYPES = [
  {
    value: 'Point Addition',
    label: 'Point Addition',
  },
  {
    value: 'Point Deduction',
    label: 'Point Deduction',
  }
];

export const LOYALTY_POINT_VALUES = [
  {
    invoiceID: '#202408010012',
    purchaseDate: '01/08/2024',
    type: 'Point Addition',
    points: 10,
    expiryDate: '01/08/2025',
    notes: 'Additional Points',
  },
  {
    invoiceID: '#202408010010',
    purchaseDate: '01/08/2024',
    type: 'Point Deduction',
    points: 5,
    expiryDate: '-',
    notes: '-',
  },
];
