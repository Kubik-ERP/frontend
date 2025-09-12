export const VOUCHER_LIST_REQUEST = 'VOUCHER_LIST_REQUEST';

export const VOUCHER_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Title',
    sortable: false,
    value: 'name',
    translationKey: 'voucher.main.table.title',
  },
  {
    label: 'Promo Code',
    sortable: false,
    value: 'promoCode',
    translationKey: 'voucher.main.table.promoCode',
  },
  {
    label: 'Validity Period',
    sortable: true,
    value: 'validityPeriod',
    translationKey: 'voucher.main.table.validityPariode',
  },
  {
    label: 'Status',
    sortable: false,
    value: 'status',
    translationKey: 'voucher.main.table.status',
  },
  {
    label: 'Last Updated',
    sortable: true,
    value: 'updatedAt',
    translationKey: 'voucher.main.table.lastUpdated',
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
