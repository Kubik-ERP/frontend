export const MENU_RECIPE_CREATE_EDIT_LIST_INGREDIENTS_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Item',
    sortable: false,
    value: 'item',
  },
  {
    label: 'Qty',
    sortable: false,
    value: 'quantity',
  },
  {
    label: 'UOM',
    sortable: false,
    value: 'uom',
  },
  {
    label: 'Notes',
    sortable: false,
    value: 'notes',
  },
  {
    label: 'Cost',
    sortable: false,
    value: 'cost',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
  },
];

export const MENU_RECIPE_CREATE_EDIT_LIST_OUTPUT_UNITS: IDropdownItem[] = [
  {
    label: 'Kilogram (kg)',
    value: 'Kilogram (kg)',
  },
  {
    label: 'Gram (g)',
    value: 'Gram (g)',
  },
  {
    label: 'Milligram (mg)',
    value: 'Milligram (mg)',
  },
  {
    label: 'Liter (L)',
    value: 'Liter (L)',
  },
  {
    label: 'Milliliter (ml)',
    value: 'Milliliter (ml)',
  },
  {
    label: 'Piece (pcs)',
    value: 'Piece (pcs)',
  },
  {
    label: 'Pack (pck)',
    value: 'Pack (pck)',
  },
  {
    label: 'Bottle',
    value: 'Bottle',
  },
  {
    label: 'Can',
    value: 'Can',
  },
  {
    label: 'Sachet',
    value: 'Sachet',
  },
  {
    label: 'Dozen',
    value: 'Dozen',
  },
  {
    label: 'Portion',
    value: 'Portion',
  },
  {
    label: 'Slice',
    value: 'Slice',
  },
  {
    label: 'Cup',
    value: 'Cup',
  },
  {
    label: 'Table Spoon (Tbsp)',
    value: 'Table Spoon (Tbsp)',
  },
  {
    label: 'Tea Spoon (Tsp)',
    value: 'Tea Spoon (Tsp)',
  },
  {
    label: 'Serving',
    value: 'Serving',
  },
  {
    label: 'Batch',
    value: 'Batch',
  },
];

// Request constants for HTTP abort
export const MENU_RECIPE_CREATE_REQUEST = 'MENU_RECIPE_CREATE_REQUEST';
export const MENU_RECIPE_DETAIL_REQUEST = 'MENU_RECIPE_DETAIL_REQUEST';
export const MENU_RECIPE_UPDATE_REQUEST = 'MENU_RECIPE_UPDATE_REQUEST';
