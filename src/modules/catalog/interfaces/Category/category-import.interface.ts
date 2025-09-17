export interface ICategoryImportFailedSuccessData {
  id: string;
  rowNumber: number;
  category: string;
  description?: string;
  imageUrl?: string;
  status: string;
  errorMessages?: string;
}

export interface ICategoryImportResponse {
  statusCode: number;
  message: string;
  data: ICategoryImportData;
}

export interface ICategoryImportData {
  batchId: string;
  failedData: ICategoryImportFailedSuccessData[];
  successData: ICategoryImportFailedSuccessData[];
  invalidRows: number;
  totalRows: number;
  validRows: number;
  mergedData: ICategoryImportFailedSuccessData[];
}

export interface ICategoryActionResponse{
  statusCode: number;
  message: string;
}

export interface ICategoryImportProvided {
  categoryImport_onSubmit: () => void;
  categoryImport_onClose: () => void;
  categoryImport_step: globalThis.Ref<number>;
  categoryImport_isLoading: globalThis.Ref<boolean>;
  categoryImport_values: globalThis.Ref<ICategoryImportResponse | undefined>;
  categoryImport_handleDownloadTemplate: () => void;
  categoryImport_handleDropFile: (acceptedFiles: File[]) => void;
  categoryImport_handleUpload: () => void;
  categoryImport_triggerUpload: () => void;
  categoryImport_columns: IColumnDataTable[];
}