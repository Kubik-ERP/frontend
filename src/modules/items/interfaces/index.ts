export interface IInventoryItems {
  id: string;
  name: string;
  brandId: string;
  barcode?: string;
  sku: string;
  categoryId: string;
  unit: string;
  notes: string;
  stockQuantity: number;
  reorderLevel: number;
  minimumStockQuantity: number;
  expiryDate: string;
  storageLocationId: string;
  pricePerUnit: number;
  supplierId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IInventoryItemsStockAdjustment {
  id: string;
  action: 'STOCK_IN' | 'STOCK_OUT';
  adjustmentQuantity: number;
  previousQuantity: number;
  newQuantity: number;
  notes: string;
  masterInventoryItemsId: string;
  storesId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IInventoryItemsStockAdjustmentPayload {
  action: string;
  adjustmentQuantity: number;
  notes: string;
}

export interface IInventoryItemsPayload {
  name: string;
  brandId: string;
  barcode?: string;
  sku: string;
  categoryId: string;
  unit: string;
  notes: string;
  stockQuantity: number;
  reorderLevel: number;
  minimumStockQuantity: number;
  expiryDate: string;
  storageLocationId: string;
  pricePerUnit: number;
  supplierId: string;
}


