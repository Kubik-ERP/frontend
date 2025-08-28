import { IBrandImport } from '../interfaces/brand-import.interface';

export const BRAND_API_BASE_ENDPOINT = '/brands';

export const BRAND_CONFIG_REQUEST = 'BRAND_LIST_REQUEST';

export const BRAND_LIST_COLUMNS = [
  {
    label: 'Brand Code',
    sortable: false,
    value: 'code',
  },
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

export const IMPORT_BRAND_DUMMY_DATA: IBrandImport[] = [
  {
    code: 'BRAND_01',
    name: 'Brand 01',
    description: 'description',
    status: 'success',
  },
  {
    code: 'BRAND_02',
    name: 'Brand 02',
    description: 'description',
    status: 'success',
  },
  {
    code: 'BRAND_03',
    name: 'Brand 03',
    description: 'description',
    status: 'failed',
  },
  {
    code: 'BRAND_04',
    name: 'Brand 04',
    description: 'description',
    status: 'failed',
  },
  {
    code: 'BRAND_05',
    name: 'Brand 05',
    description: 'description',
    status: 'success',
  },
  {
    code: 'BRAND_06',
    name: 'Brand 06',
    description: 'description',
    status: 'success',
  },
  {
    code: 'BRAND_07',
    name: 'Brand 07',
    description: 'description',
    status: 'success',
  },
  {
    code: 'BRAND_08',
    name: 'Brand 08',
    description: 'description',
    status: 'success',
  },
  {
    code: 'BRAND_09',
    name: 'Brand 09',
    description: 'description',
    status: 'success',
  },
  {
    code: 'BRAND_10',
    name: 'Brand 10',
    description: 'description',
    status: 'success',
  },
  {
    code: 'BRAND_11',
    name: 'Brand 11',
    description: 'description',
    status: 'success',
  },
];
