import { useOutletStore } from "@/modules/outlet/store";

export const ITEMS_API_BASE_ENDPOINT = '/inventory-items';

export const ITEMS_LIST_REQUEST = 'ITEMS_LIST_REQUEST';

const store = useOutletStore();
const businessType = store.outlet_currentOutlet?.businessType;
export const ITEMS_LIST_COLUMS: IColumnDataTable[] = [
  {
    label: 'SKU',
    sortable: false,
    value: 'sku',
    translationKey: 'items.form.sku',
  },
  {
    label: 'Item Name',
    sortable: false,
    value: 'name',
    translationKey: 'items.form.name',
  },
  {
    label: 'Category',
    sortable: false,
    value: 'categoryName',
    translationKey: 'items.form.category',
  },
  {
    label: 'Brand',
    sortable: false,
    value: 'brandName',
    translationKey: 'items.form.brand',
  },
  // {
  //   label: 'Unit',
  //   sortable: false,
  //   value: 'unit',
  // },
  {
    label: 'Stock Quantity',
    sortable: true,
    value: 'stockQuantity',
    translationKey: 'items.form.stockQuantity',
  },
  // {
  //   label: 'Reorder Level',
  //   sortable: true,
  //   value: 'reorderLevel',
  // },
  {
    label: 'Minimum Stock',
    sortable: true,
    value: 'minimumStockQuantity',
    translationKey: 'items.form.minStockQuantity',

  },
  {
    label: 'Price Per Unit',
    sortable: true,
    value: 'unitPrice',
    translationKey: businessType === 'Restaurant' ? 'items.form.pricePerUnit' : 'items.form.priceRetail',
  },
  {
    label: 'Expiry Date',
    sortable: true,
    value: 'expiryDate',
    translationKey: 'items.form.expiryDate',
  },
  // {
  //   label: 'Supplier',
  //   sortable: false,
  //   value: 'supplierId',
  // },
  // {
  //   label: 'Storage Location',
  //   sortable: false,
  //   value: 'storageLocationId',
  // },
  {
    label: '',
    sortable: false,
    value: 'action',
    width: '100px',
  },
];
export const ITEMS_LIST_COLUMS_IMPORT: IColumnDataTable[] = [
  {
    label: 'Row Number',
    sortable: false,
    value: 'rowNumber',
  },
  {
    label: 'SKU',
    sortable: false,
    value: 'sku',
  },
  {
    label: 'Item Name',
    sortable: false,
    value: 'name',
  },
  {
    label: 'Category',
    sortable: false,
    value: 'category',
  },
  {
    label: 'Brand',
    sortable: false,
    value: 'brand',
  },
  {
    label: 'Unit',
    sortable: false,
    value: 'unit',
  },
  {
    label: 'Stock Quantity',
    sortable: true,
    value: 'stockQuantity',
  },
  {
    label: 'Reorder Level',
    sortable: true,
    value: 'reorderLevel',
  },
  {
    label: 'Minimum Stock',
    sortable: true,
    value: 'minimumStockQuantity',

  },
  {
    label: 'Price Per Unit',
    sortable: true,
    value: 'unitPrice',
  },
  {
    label: 'Expiry Date',
    sortable: true,
    value: 'expiryDate',
  },
  {
    label: 'Supplier',
    sortable: false,
    value: 'supplier',
  },
  {
    label: 'Storage Location',
    sortable: false,
    value: 'storageLocation',
  },
  {
    label: '',
    sortable: false,
    value: 'status',
  },
];

export const ITEM_STOCK_ADJUSTMENT_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Date',
    sortable: false,
    value: 'date',
  },
  {
    label: 'Adjustment Type',
    sortable: false,
    value: 'action',
  },
  {
    label: 'Adjustment Quantity',
    sortable: false,
    value: 'adjustmentQuantity',
  },
  {
    label: 'New Stock Quantity',
    sortable: false,
    value: 'newQuantity',
  },
  {
    label: 'Notes',
    sortable: false,
    value: 'notes',

  },
  {
    label: 'Adjusted By',
    sortable: false,
    value: 'username',
  },
  {
    label: '',
    sortable: false,
    value: 'aksi',
  }
]


