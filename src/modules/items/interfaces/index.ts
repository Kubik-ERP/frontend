export interface IUnitConversion {
  unitName: string;
  unitSymbol: string;
  value: number;
}

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
  brand: string;
  priceGrosir: number;
  category: string;
  storageLocation: string;
  supplier: string;
  itemName: string;
  imageUrl?: string | null;
  conversions?: IUnitConversion[];
  markup: number;
  margin: number;
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
  users: {
    id: string;
    username: string;
    email: string;
    fullname: string;
  }
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
  expiryDate: Date | string;
  storageLocationId: string;
  pricePerUnit: number;
  supplierId: string;
  priceGrosir: number;
  imagePreview: string | null;
  imageFile?: File | null;
  conversions?: IUnitConversion[];
}


