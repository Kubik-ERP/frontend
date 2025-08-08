export const VOUCHER_LIST_REQUEST = 'VOUCHER_LIST_REQUEST';

export const VOUCHER_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Title',
    sortable: false,
    value: 'name',
  },
  {
    label: 'Promo Code',
    sortable: false,
    value: 'promoCode',
  },
  {
    label: 'Validity Period',
    sortable: true,
    value: 'validityPeriod',
  },
  {
    label: 'Status',
    sortable: false,
    value: 'status',
  },
  {
    label: 'Last Updated',
    sortable: true,
    value: 'updatedAt',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
  },
]

export const PRODUCT_SELECTED_LIST_COLUMNS: IColumnDataTable[] = [
  {
    value: 'name',
    label: 'Name',
    sortable: false,
  },
  {
    value: 'category',
    label: 'Category',
    sortable: false,
  },
  {
    value: 'price',
    label: 'Price',
    sortable: false,
  },
]
