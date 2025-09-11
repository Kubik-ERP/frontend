export const STORAGE_LOCATION_API_BASE_ENDPOINT = '/storage-locations';
export const STORAGE_LOCATION_LIST_REQUEST = 'STORAGE_LOCATION_LIST_REQUEST';

export const STORAGE_LOCATION_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Storage Code',
    sortable: false,
    value: 'code',
    translationKey: 'storageLocation.table.code',
  },
  {
    label: 'Name',
    sortable: false,
    value: 'name',
    translationKey: 'storageLocation.table.name',
  },
  {
    label: 'Description',
    sortable: false,
    value: 'notes',
    translationKey: 'storageLocation.table.notes',
  },
  {
    label: 'Created At',
    sortable: true,
    value: 'created_at',
    translationKey: 'storageLocation.table.createdAt',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
    width: '100px',
    translationKey: 'storageLocation.table.actions',
  },
];
export const STORAGE_LOCATION_LIST_COLUMNS_IMPORT: IColumnDataTable[] = [
  {
    label: 'Code',
    sortable: false,
    value: 'code',
  },
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
    label: '',
    sortable: false,
    value: 'status',
  },
];
