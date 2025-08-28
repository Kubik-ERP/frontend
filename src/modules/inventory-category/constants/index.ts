export const VOUCHER_LIST_REQUEST = 'INVENTORY_CATEGORY_LIST_REQUEST';

export const INVENTORY_CATEGORY_BASE_ENDPOINT = '/inventory-categories';

export const INVERNTORY_CATEGORY_LIST_COLUMNS = [
  {
    label: 'Category code',
    sortable: false,
    value: 'code',
  },
  {
    label: 'Category Name',
    sortable: false,
    value: 'name',
  },
  {
    label: 'Description',
    sortable: false,
    value: 'notes',
  },
  {
    label: 'Created At',
    sortable: true,
    value: 'createdAt',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
  },
]

export const INVENTORY_CATEGORY_LIST_COLUMNS_IMPORT = [
  {
    label: 'Category code',
    sortable: false,
    value: 'code',
  },
  {
    label: 'Category Name',
    sortable: false,
    value: 'name',
  },
  {
    label: 'Description',
    sortable: false,
    value: 'notes',
  },
  {
    label: '',
    sortable: false,
    value: 'status',
  },
]

export const INVENTORY_CATEGORY_LIST_DEFAULT_QUERY = {
  page: 1,
  pageSize: 10,
  search: null,
  orderBy: null,
  orderDirection: null,
};

