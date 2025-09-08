export interface IInventoryItemImport{
  batchId: string;
  failedData: inventoryItems_importFailedSuccessData[];
  successData: inventoryItems_importFailedSuccessData[];
  invalidRows: number;
  totalRows: number;
  validRows: number;
  mergedData: inventoryItems_importFailedSuccessData[];
}

export interface inventoryItems_importFailedSuccessData{
  id: string;
  name: string;
  barcode?: string;
  sku: string;
  unit: string;
  notes: string;
  stockQuantity: number;
  reorderLevel: number;
  minimumStockQuantity: number;
  expiryDate: string;
  storageLocationId: string;
  pricePerUnit: number;
  createdAt: string;
  updatedAt: string;
  brand: string;
  category: string;
  storageLocation: string;
  supplier: string;
  itemName: string;
  rowNumber: number;
  status: string;
  errorMessages?: string
}

export interface IInventoryItemImportResponse{
  statusCode: number;
  message: string;
  data: IInventoryItemImport;
}

export interface IInventoryItemImportProvided{
    inventoryItem_onSubmit: () => void;
    inventoryItem_onClose: () => void;
    inventoryItem_step: globalThis.Ref<number>;
    inventoryItem_isLoading: globalThis.Ref<boolean>;
    inventoryItem_values: globalThis.Ref<IInventoryItemImportResponse | undefined>;
    inventoryItem_handleDownloadTemplate: () => void;
    inventoryItem_handleDropFile: (acceptedFiles: File[]) => void;
    inventoryItem_handleUpload: () => void;
    inventoryItem_triggerUpload: () => void;
    inventoryItem_columns: IColumnDataTable[]
}
