export interface IInventoryReport_stock {
  sku: string;
  itemName: string;
  category: string;
  stock: number;
  reorderLevel: number;
  minimumStock: number;
  unit: string;
  storageLocation: string;
}

export interface IInventoryReport_stockMovement {
  sku: string;
  itemName: string;
  movementType: string;
  qty: number;
  stockBefore: number;
  stockAfter: number;
  notes: string;
  storageLocation: string;
}
