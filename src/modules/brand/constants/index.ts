export const BRAND_API_BASE_ENDPOINT = '/brands';

export const BRAND_CONFIG_REQUEST = 'BRAND_LIST_REQUEST';

export const BRAND_LIST_COLUMNS = [
  {
    label: 'Brand Code',
    sortable: false,
    value: 'code',
    translationKey: 'brand.table.code',
  },
  {
    label: 'Name',
    sortable: false,
    value: 'brandName',
    translationKey: 'brand.table.name',
  },
  {
    label: 'Notes',
    sortable: false,
    value: 'notes',
    translationKey: 'brand.table.description',
  },
  {
    label: 'Created At',
    sortable: true,
    value: 'created_at',
    translationKey: 'brand.table.createdAt',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
    width: '100px',
    translationKey: 'brand.table.actions',
  },
];
export const BRAND_LIST_COLUMNS_IMPORT = [
  {
    label: 'code',
    sortable: false,
    value: 'code',
  },
  {
    label: 'Name',
    sortable: false,
    value: 'name',
  },
  {
    label: 'Notes',
    sortable: false,
    value: 'notes',
  },
  {
    label: 'Status',
    sortable: false,
    value: 'status',
  },
];
