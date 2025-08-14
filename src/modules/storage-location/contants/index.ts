export const STORAGE_LOCATION_API_BASE_ENDPOINT = '/storage-locations';
export const STORAGE_LOCATION_LIST_REQUEST = 'STORAGE_LOCATION_LIST_REQUEST';

export const STORAGE_LOCATION_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Name',
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
    value: 'created_at',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
    width: '100px',
  },
];
