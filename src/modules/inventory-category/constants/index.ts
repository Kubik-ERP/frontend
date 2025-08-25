import { IInventoryCategory } from '../interfaces';

export const VOUCHER_LIST_REQUEST = 'INVENTORY_CATEGORY_LIST_REQUEST';

export const INVENTORY_CATEGORY_BASE_ENDPOINT = '/inventory-categories';

export const INVERNTORY_CATEGORY_LIST_COLUMNS = [
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
];

export const INVENTORY_CATEGORY_LIST_DEFAULT_QUERY = {
  page: 1,
  pageSize: 10,
  search: null,
  orderBy: null,
  orderDirection: null,
};

export const INVENTORY_CATEGORY_FAKE_DATA: IInventoryCategory[] = [
  {
    id: '1',
    code: 'ELEC',
    name: 'Electronics',
    notes: 'Devices and gadgets',
    isHaveItems: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    code: 'FURN',
    name: 'Furniture',
    notes: 'Home and office furniture',
    isHaveItems: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    code: 'CLOTH',
    name: 'Clothing',
    notes: 'Apparel and accessories',
    isHaveItems: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
