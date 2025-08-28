export interface IInventoryItemImport{
  sku: string;
  name: string;
  category: string;
  brand:string;
  unit: string;
  stockQuantity: number;
  reorderLevel: number;
  minimumStockQuantity: number;
  expiryDate: string;
  pricePerUnit: number;
  supplier: string;
  storageLocation: string;
  status: string;
}

export interface IInventoryItemImportResponse{
  statusCode: number;
  message: string;
  data: {
    items: IInventoryItemImport[];
    meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  }
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