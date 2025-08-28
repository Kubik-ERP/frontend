export const SUPPLIER_BASE_ENDPOINT = '/suppliers';

export const SUPPLIER_LIST_REQUEST = 'SUPPLIER_LIST_REQUEST';

export const SUPPLIER_LIST_COLUMNS: IColumnDataTable[] = [
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
    value: 'action',
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
    value: 'action',
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
