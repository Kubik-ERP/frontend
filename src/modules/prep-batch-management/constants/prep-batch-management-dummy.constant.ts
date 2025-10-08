export const BATCH_LIST_VALUES = Array.from({ length: 10 }, (_, i) => ({
  batch: `Batch ${i + 1}`,
  batchDate: new Date(`2025-01-0${i + 1}`), // Wrap the date string in new Date()
  targetYield: '100',
  notes: Math.random() < 0.5 ? 'Notes' : '',
  batchStatus: ['Cancelled', 'Planned', 'In Progress', 'Posted'][Math.floor(Math.random() * 4)],
  updatedAt: new Date(`2025-01-0${i + 1}`), // Wrap the date string in new Date()
}));

const BATCH_DETAILS_RECIPE_VALUES = {
  batchName: 'Rendang Daging/Batch-25092025',
  recipeName: 'Rendang Daging',
  batchDate: new Date('2025-09-25'),
  batchStatus: 'In Progress',
  productLinked: 'Rendang Daging (#001)',
  productPrice: 24000,
  targetYield: 100,
  batchWaste: 2,
};

const BATCH_DETAILS_PRODUCTION_COST_VALUES = {
  costBatch: 28300000,
  costPortion: 14150,
  marginPerSellingPrice: 9850,
  marginPerSellingPercentage: 41,
};

const BATCH_DETAILS_INGRIDIENTS_VALUES = [
  {
    item: 'Bumbu Dasar Rendang',
    qty: 500,
    UOM: 'g',
    notes: '-',
    cost: 32000,
  },
  {
    item: 'Daun Kunyit',
    qty: 300,
    UOM: 'g',
    notes: null,
    cost: 1000,
  },
  {
    item: 'Daging Sapi',
    qty: 2,
    UOM: 'Kg',
    notes: '20 Potong',
    cost: 200000,
  },
  {
    item: 'Santan',
    qty: 5,
    UOM: 'L',
    notes: null,
    cost: 50000,
  },
];

export const BATCH_DETAILS_VALUES = {
  recipe: BATCH_DETAILS_RECIPE_VALUES,
  productionCost: BATCH_DETAILS_PRODUCTION_COST_VALUES,
  ingridients: BATCH_DETAILS_INGRIDIENTS_VALUES,
};
