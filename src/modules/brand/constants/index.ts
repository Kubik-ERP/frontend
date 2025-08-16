export const BRAND_API_BASE_ENDPOINT = '/brands';

export const BRAND_CONFIG_REQUEST = 'BRAND_LIST_REQUEST';

export const BRAND_LIST_COLUMNS = [
  {
    label: 'Name',
    sortable: false,
    value: 'brandName',
  },
  {
    label: 'Notes',
    sortable: false,
    value: 'notes',
  },
  {
    label: 'Created At',
    sortable: true,
    value: 'created_at',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
  },
];
