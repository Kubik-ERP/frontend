export interface IStorageLocationImportFailedSuccessData {
  id: string;
  rowNumber: number;
  locationCode: string;
  locationName: string;
  description: string;
  status: string;
  errorMessages?: string;
}

export interface IStorageLocationImportResponse {
  statusCode: number;
  message: string;
  data: IStorageLocationImportData;
}

export interface IStorageLocationImportData {
  batchId: string;
  failedData: IStorageLocationImportFailedSuccessData[];
  successData: IStorageLocationImportFailedSuccessData[];
  invalidRows: number;
  totalRows: number;
  validRows: number;
  mergedData: IStorageLocationImportFailedSuccessData[];
}

export interface IStorageLocationImportProvided {
  storageLocationImport_onSubmit: () => void;
  storageLocationImport_onClose: () => void;
  storageLocationImport_step: globalThis.Ref<number>;
  storageLocationImport_isLoading: globalThis.Ref<boolean>;
  storageLocationImport_values: globalThis.Ref<IStorageLocationImportResponse | undefined>;
  storageLocationImport_handleDownloadTemplate: () => void;
  storageLocationImport_handleDropFile: (acceptedFiles: File[]) => void;
  storageLocationImport_handleUpload: () => void;
  storageLocationImport_triggerUpload: () => void;
  storageLocationImport_columns: IColumnDataTable[];
}
