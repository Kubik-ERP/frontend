export const ITEMS_API_BASE_ENDPOINT = '/inventory-items';

export const ITEMS_LIST_REQUEST = 'ITEMS_LIST_REQUEST';

export const ITEMS_LIST_COLUMS: IColumnDataTable[] = [
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
    label: 'Category',
    sortable: false,
    value: 'categoryName',
  },
  {
    label: 'Brand',
    sortable: false,
    value: 'brandName',
  },
  {
    label: 'Unit',
    sortable: false,
    value: 'unit',
  },
  {
    label: 'Stock Quantity',
    sortable: true,
    value: 'stockQuantity',
  },
  {
    label: 'Reorder Level',
    sortable: true,
    value: 'reorderLevel',
  },
  {
    label: 'Minimum Stock',
    sortable: true,
    value: 'minimumStockQuantity',

  },
  {
    label: 'Price Per Unit',
    sortable: true,
    value: 'unitPrice',
  },
    {
    label: 'Expiry Date',
    sortable: true,
    value: 'expiryDate',
  },
  {
    label: 'Supplier',
    sortable: false,
    value: 'supplierId',
  },
  {
    label: 'Storage Location',
    sortable: false,
    value: 'storageLocationId',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
    width: '100px',
  },
];

export const ITEM_STOCK_ADJUSTMENT_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Date',
    sortable: false,
    value: 'date',
  },
  {
    label: 'Adjustment Type',
    sortable: false,
    value: 'action',
  },
  {
    label: 'Adjustment Quantity',
    sortable: false,
    value: 'adjustmentQuantity',
  },
  {
    label: 'New Stock Quantity',
    sortable: false,
    value: 'newQuantity',
  },
  {
    label: 'Notes',
    sortable: false,
    value: 'notes',
  },
  {
    label: '',
    sortable: false,
    value: 'aksi',
  }
]


