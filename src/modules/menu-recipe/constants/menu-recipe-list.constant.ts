export const MENU_RECIPE_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Recipe Name',
    sortable: false,
    value: 'recipeName',
  },
  {
    label: 'Output',
    sortable: false,
    value: 'output',
  },
  {
    label: 'Yield Target',
    sortable: false,
    value: 'yieldTarget',
  },
  {
    label: 'Cost /Portion',
    sortable: false,
    value: 'costPerPortion',
  },
  {
    label: 'Margin %',
    sortable: false,
    value: 'marginPercent',
  },
  {
    label: 'Last Update',
    sortable: false,
    value: 'updatedAt',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
  },
];

export const MENU_RECIPE_LIST_VALUES = [
  {
    id: '1',
    isBaseRecipe: true,
    recipeName: 'Rendang',
    output: 'Portion',
    yieldTarget: 100,
    costPerPortion: 18000,
    marginPercent: 45,
    updatedAt: '07/03/2025',
  },
  {
    id: '2',
    isBaseRecipe: false,
    recipeName: 'Soto Ayam',
    output: 'Portion',
    yieldTarget: 50,
    costPerPortion: 12000,
    marginPercent: 40,
    updatedAt: '06/03/2025',
  },
  {
    id: '3',
    isBaseRecipe: true,
    recipeName: 'Nasi Goreng',
    output: 'Portion',
    yieldTarget: 75,
    costPerPortion: 15000,
    marginPercent: 50,
    updatedAt: '05/03/2025',
  }
]