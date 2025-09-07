export const PRODUCT_API_BASE_ENDPOINT = '/products';

export const PRODUCT_LIST_COLUMNS_IMPORT :IColumnDataTable[] = [
  {
    label: 'Row Number',
    sortable: false,
    value: 'rowNumber',
  },
  {
    label: 'Name',
    sortable: false,
    value: 'name',
  },
  {
    label: 'Category',
    sortable: false,
    value: 'category',
  },
  {
    label: 'Variant',
    sortable: false,
    value: 'variant',
  },
  {
    label: 'price',
    sortable: false,
    value: 'price',
  },
  {
    label: 'discountPrice',
    sortable: false,
    value: 'discountPrice',
  },
  {
    label: '',
    sortable: false,
    value: 'status',
  }
]