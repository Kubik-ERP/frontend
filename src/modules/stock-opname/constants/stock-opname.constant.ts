export const STOCK_OPNAME_RECORD_COLUMNS: IColumnDataTable[] = [
  {
    label: '#',
    sortable: false,
    value: 'index',
  },
  {
    label: 'Stock Opname Record',
    sortable: false,
    value: 'code',
  },
  {
    label: 'Issue Date',
    sortable: false,
    value: 'issueDate',
  },
  {
    label: 'Total Item Checked',
    sortable: false,
    value: 'totalItemChecked',
  },
  {
    label: 'Stock Mismatches',
    sortable: false,
    value: 'stockMismatches',
  },
  {
    label: 'Status',
    sortable: false,
    value: 'status',
  },
  {
    label: 'Performed By',
    sortable: false,
    value: 'performedBy',
  },
  {
    label: 'Last Update',
    sortable: false,
    value: 'lastUpdate',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
  },
];

export const STOCK_OPNAME_CREATE_EDIT_COLUMNS: IColumnDataTable[] = [
  {
    label: 'SKU',
    value: 'sku',
    sortable: false,
  },
  {
    label: 'Item Name',
    value: 'name',
    sortable: false,
  },
  {
    label: 'Expected Quantity',
    value: 'expectedQuantity',
    sortable: false,
  },
  {
    label: 'Actual Quantity',
    value: 'actualQuantity',
    sortable: false,
  },
  {
    label: 'Difference',
    value: 'diffQuantity',
    sortable: false,
  },
  {
    label: 'Notes',
    value: 'notes',
    sortable: false,
  },
  {
    label: '',
    value: 'action',
    sortable: false,
  },
];
