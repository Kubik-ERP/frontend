export const WASTE_LOG_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Batch ID',
    sortable: true,
    value: 'batchId',
  },
  {
    label: 'Store',
    sortable: true,
    value: 'storeName',
  },
  {
    label: 'Items Count',
    sortable: false,
    value: 'itemsCount',
  },
  {
    label: 'Created At',
    sortable: true,
    value: 'createdAt',
  },
  {
    label: 'Updated At',
    sortable: true,
    value: 'updatedAt',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
  },
];

export const WASTE_LOG_LIST_VALUES = [
  {
    id: '1',
    item: 'Bumbu Dasar Rendang',
    batch: 'BDR-001',
    quantity: 2,
    uom: 'Kilogram (kg)',
    category: 'Bumbu Dasar',
    notes: 'Expired',
    updatedAt: '07/03/2025',
  },
  {
    id: '2',
    item: 'Daun Kunyit',
    batch: 'DK-002',
    quantity: 500,
    uom: 'Gram (g)',
    category: 'Sayuran',
    notes: 'Moldy',
    updatedAt: '06/03/2025',
  },
  {
    id: '3',
    item: 'Santan Kelapa',
    batch: 'SK-003',
    quantity: 1,
    uom: 'Liter (L)',
    category: 'Bahan Cair',
    notes: 'Spoiled',
    updatedAt: '05/03/2025',
  },
];
