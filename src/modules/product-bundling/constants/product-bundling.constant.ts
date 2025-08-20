import type { IProductBundlingList } from '../interfaces';

export const PRICE_TYPE_OPTION = [
  { value: 'total items', label: 'Total' },
  { value: 'custom', label: 'Custom' },
  { value: 'discount', label: 'Discount' },
];

export const PRODUCT_BUNDLING_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Name',
    sortable: true,
    value: 'name',
  },
  {
    label: 'Description',
    sortable: true,
    value: 'description',
  },
  {
    label: 'Type',
    sortable: true,
    value: 'type',
  },
  {
    label: 'Price',
    sortable: true,
    value: 'price',
  },
  // {
  //   label: 'Created At',
  //   sortable: true,
  //   value: 'created_at',
  // },
  // {
  //   label: 'Updated At',
  //   sortable: true,
  //   value: 'updated_at',
  // },
  {
    label: '',
    sortable: false,
    value: 'action',
  },
];

export const PRODUCT_BUNDLING_LIST: IProductBundlingList = {
  data: Array.from({ length: 10 }, (_, i) => ({
    id: (i + 1).toString(),
    name: `PB ${i + 1}`,
    description: `This is description of product bundling ${i + 1}`,
    type: ['total items', 'custom', 'discount'][i % 3],
    price: i * 10000,
    created_at: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString(),
    updated_at: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString(),
  })),
  meta: {
    page: 1,
    pageSize: 10,
    total: 10,
    totalPages: 1,
  },
};
