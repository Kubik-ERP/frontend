export const MENU_RECIPE_DETAIL_LIST_INGREDIENTS_COLUMNS: IColumnDataTable[] = [
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

// export const MENU_RECIPE_DETAIL_DATA: IMenuRecipe = {
//   id: '1',
//   baseRecipe: true,
//   recipeName: 'Rendang',
//   outputUnit: 'Portion',
//   targetYield: 100,
//   productId: '1',
//   ingredients: [
//     {
//       itemId: '1',
//       item: 'Bumbu Dasar Rendang',
//       quantity: 500,
//       uom: 'GRAM (g)',
//       notes: null,
//       cost: 32000,
//     },
//     {
//       itemId: '2',
//       item: 'Daun Kunyit',
//       quantity: 500,
//       uom: 'GRAM (g)',
//       notes: null,
//       cost: 1000,
//     },
//   ],
// };

// Request constants for HTTP abort
export const MENU_RECIPE_DETAIL_FETCH_REQUEST = 'MENU_RECIPE_DETAIL_FETCH_REQUEST';
export const MENU_RECIPE_DETAIL_DELETE_REQUEST = 'MENU_RECIPE_DETAIL_DELETE_REQUEST';
export const MENU_RECIPE_DETAIL_FETCH_VERSIONS_REQUEST = 'MENU_RECIPE_DETAIL_FETCH_VERSIONS_REQUEST';
export const MENU_RECIPE_DETAIL_FETCH_VERSION_DETAIL_REQUEST = 'MENU_RECIPE_DETAIL_FETCH_VERSION_DETAIL_REQUEST';
