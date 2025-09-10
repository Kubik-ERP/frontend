export interface IInventoryCategoryImport {
  categoryCode: string;
  categoryName: string;
  description: string;
  status: string;
  errorMessages?: string;
}

export interface IInventoryCategotyImportData {
  batchId: string;
  failedData: IInventoryCategoryImport[];
  successData: IInventoryCategoryImport[];
  invalidRows: number;
  totalRows: number;
  validRows: number;
  mergedData: IInventoryCategoryImport[];
}

export interface IInventoryCategoryImportResponse {
  statusCode: number;
  message: string;
  data: IInventoryCategotyImportData;
}

export interface IInventoryCategoryImportProvided {
  inventoryCategoryImport_onSubmit: () => void;
  inventoryCategoryImport_onClose: () => void;
  inventoryCategoryImport_step: globalThis.Ref<number>;
  inventoryCategoryImport_isLoading: globalThis.Ref<boolean>;
  inventoryCategoryImport_values: globalThis.Ref<IInventoryCategoryImportResponse | undefined>;
  inventoryCategoryImport_handleDownloadTemplate: () => void;
  inventoryCategoryImport_handleDropFile: (acceptedFiles: File[]) => void;
  inventoryCategoryImport_handleUpload: () => void;
  inventoryCategoryImport_triggerUpload: () => void;
  inventoryCategoryImport_columns: IColumnDataTable[];
}
