// export interface IInventoryReport_stock {
//   sku: string;
//   itemName: string;
//   category: string;
//   stock: number;
//   reorderLevel: number;
//   minimumStock: number;
//   unit: string;
//   storageLocation: string;
// }

// export interface IInventoryReport_stockMovement {
//   sku: string;
//   itemName: string;
//   movementType: string;
//   qty: number;
//   stockBefore: number;
//   stockAfter: number;
//   notes: string;
//   storageLocation: string;
// }

export interface IInventoryReport_movementLedger {
  tanggal: string;
  itemName: string;
  adjustmentType: 'STOCK_IN' | 'STOCK_OUT';
  adjustmentQuantity: number;
  newStockQuantity: number;
  notes: string;
}

export interface IInventoryReport_currentStockOverview {
  totalOnHand: number;
  totalStockCost: number;
  averageStockCost: number;
  totalRetailPrice: number;
}

export interface IInventoryReport_poReceivingVariance {
  poId: string;
  item: string;
  qtyPO: number;
  qtyAktual: number;
  qtySelisih: number;
  itemPrice: number;
  varPrice: number;
}

export interface IInventoryReport_slowDeadStock {
  item: string;
  onHand: number;
  lastStockUpdated: string;
  daysIdle: number;
}

export interface IInventoryReport_itemPerformance {
  itemName: string;
  stockQty: number;
  totalStockValue: number;
  totalMovementsCount: number;
  totalQtyOut: number;
}
export interface IInventoryReport_itemPerformanceByCategory {
  category: string;
  itemCount: number;
  totalStockValue: number;
  totalMovementsCount: number;
  totalQtyOut: number;
}
export interface IInventoryReport_itemPerformanceByBrand {
  brand: string;
  itemCount: number;
  totalStockValue: number;
  totalMovementsCount: number;
  totalQtyOut: number;
}
