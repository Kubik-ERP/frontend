export const SUPPLIER_BASE_ENDPOINT = '/suppliers';

export const SUPPLIER_LIST_REQUEST = 'SUPPLIER_LIST_REQUEST';

export const SUPPLIER_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Supplier Code',
    sortable: true,
    value: 'code',
    translationKey: 'supplier.table.code',
  },
  {
    label: 'Supplier Name',
    sortable: true,
    value: 'supplierName',
    translationKey: 'supplier.table.name',
  },
  {
    label: 'Contact Person',
    sortable: false,
    value: 'contactPerson',
    translationKey: 'supplier.table.contact',
  },
  {
    label: 'Phone Number',
    sortable: false,
    value: 'phoneNumber',
    translationKey: 'supplier.table.phone',
  },
  {
    label: 'Email',
    sortable: false,
    value: 'email',
    translationKey: 'supplier.table.email',
  },
  {
    label: 'Address',
    sortable: false,
    value: 'address',
    translationKey: 'supplier.table.address',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
    translationKey: 'supplier.table.actions',
  },
];
export const SUPPLIER_LIST_COLUMNS_IMPORT: IColumnDataTable[] = [
  {
    label: 'Supplier Code',
    sortable: true,
    value: 'code',
  },
  {
    label: 'Supplier Name',
    sortable: true,
    value: 'supplierName',
  },
  {
    label: 'Contact Person',
    sortable: false,
    value: 'contactPerson',
  },
  {
    label: 'Phone Number',
    sortable: false,
    value: 'phoneNumber',
  },
  {
    label: 'Email',
    sortable: false,
    value: 'email',
  },
  {
    label: 'Address',
    sortable: false,
    value: 'address',
  },
  {
    label: '',
    sortable: false,
    value: 'status',
  },
];

export const SUPPLIER_LIST_TABLE_ITEMS_COLUMNS: IColumnDataTable[] = [
  {
    label: 'SKU',
    sortable: true,
    value: 'sku',
  },
  {
    label: 'Item Name',
    sortable: false,
    value: 'itemName',
  },
  {
    label: 'Category',
    sortable: false,
    value: 'category',
  },
  {
    label: 'Brand',
    sortable: false,
    value: 'brand',
  },
  {
    label: 'Price / unit',
    sortable: false,
    value: 'pricePerUnit'
  },
  {
    label: 'expiry date',
    sortable: false,
    value: 'expiryDate'
  },
  {
    label: 'order Date',
    sortable: false,
    value: 'createdAt'
  }
]
