export const INVENTORYREPORT_MOVEMENTLEDGER_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Date',
    sortable: true,
    value: 'tanggal',
  },
  {
    label: 'Item Name',
    sortable: false,
    value: 'itemName',
  },
  {
    label: 'Adjustment Type',
    sortable: false,
    value: 'adjustmentType',
  },
  {
    label: 'Adjustment Quantity',
    sortable: true,
    value: 'adjustmentQuantity',
  },
  {
    label: 'New Stock Quantity',
    sortable: true,
    value: 'newStockQuantity',
  },
  {
    label: 'Notes',
    sortable: false,
    value: 'notes',
  },
];

export const INVENTORYREPORT_CURRENTSTOCKOVERVIEW_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Description',
    sortable: false,
    value: 'description',
  },
  {
    label: 'Value',
    sortable: true,
    value: 'value',
  },
];

export const INVENTORYREPORT_PORECEIVINGVARIANCE_COLUMNS: IColumnDataTable[] = [
  {
    label: 'PO ID',
    sortable: true,
    value: 'poId',
  },
  {
    label: 'Item',
    sortable: false,
    value: 'item',
  },
  {
    label: 'Qty PO',
    sortable: true,
    value: 'qtyPO',
  },
  {
    label: 'Qty Aktual',
    sortable: true,
    value: 'qtyAktual',
  },
  {
    label: 'Qty Selisih',
    sortable: true,
    value: 'qtySelisih',
  },
  {
    label: 'Item Price',
    sortable: false,
    value: 'itemPrice',
  },
  {
    label: 'Variation Price',
    sortable: false,
    value: 'var-price',
  },
];

export const INVENTORYREPORT_SLOWDEADSTOCK_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Item',
    sortable: false,
    value: 'item',
  },
  {
    label: 'On Hand',
    sortable: true,
    value: 'onHand',
  },
  {
    label: 'Last Stock Updated',
    sortable: true,
    value: 'lastStockUpdated',
  },
  {
    label: 'Days Idle',
    sortable: true,
    value: 'daysIdle',
  },
];

export const INVENTORYREPORT_ITEMPERFORMANCE_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Item Name',
    sortable: false,
    value: 'itemName'
  },
  {
    label: 'Stock Quantity',
    sortable: true,
    value: 'stockQty'
  },
  {
    label: 'Total Stock Value',
    sortable: true,
    value: 'totalStockValue'
  },
  {
    label: 'Total Movements Count',
    sortable: true,
    value: 'totalMovementsCount'
  },
  {
    label: 'Total Quantity Out',
    sortable: true,
    value: 'totalQtyOut'
  }
]
export const INVENTORYREPORT_ITEMPERFORMANCEBYCATEGORY_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Category',
    sortable: false,
    value: 'category'
  },
  {
    label: 'Item Count',
    sortable: true,
    value: 'itemCount'
  },
  {
    label: 'Total Stock Value',
    sortable: true,
    value: 'totalStockValue'
  },
  {
    label: 'Total Movements Count',
    sortable: true,
    value: 'totalMovementsCount'
  },
  {
    label: 'Total Quantity Out',
    sortable: true,
    value: 'totalQtyOut'
  }
]
export const INVENTORYREPORT_ITEMPERFORMANCEBYBRAND_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Brand',
    sortable: false,
    value: 'brand'
  },
  {
    label: 'Item Count',
    sortable: true,
    value: 'itemCount'
  },
  {
    label: 'Total Stock Value',
    sortable: true,
    value: 'totalStockValue'
  },
  {
    label: 'Total Movements Count',
    sortable: true,
    value: 'totalMovementsCount'
  },
  {
    label: 'Total Quantity Out',
    sortable: true,
    value: 'totalQtyOut'
  }
]