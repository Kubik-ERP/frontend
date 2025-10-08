export const BATCH_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Batch',
    sortable: false,
    value: 'batch',
  },
  {
    label: 'Batch Date',
    sortable: false,
    value: 'batchDate',
  },
  {
    label: 'Target Yield',
    sortable: false,
    value: 'targetYield',
  },
  {
    label: 'Notes',
    sortable: false,
    value: 'notes',
  },
  {
    label: 'Batch Status',
    sortable: false,
    value: 'batchStatus',
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

export const BATCH_LIST_VALUES = Array.from({ length: 10 }, (_, i) => ({
  batch: `Batch ${i + 1}`,
  batchDate: new Date(`2025-01-0${i + 1}`), // Wrap the date string in new Date()
  targetYield: '100',
  notes: Math.random() < 0.5 ? 'Notes' : '',
  batchStatus: ['Cancelled', 'Planned', 'In Progress', 'Posted'][Math.floor(Math.random() * 4)],
  updatedAt: new Date(`2025-01-0${i + 1}`), // Wrap the date string in new Date()
}));
