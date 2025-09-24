export interface IProductImportFailedSuccessData {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  status: string;
  category: {
    id: string;
    name: string;
  }
  errorMessages?: string;
}

export interface IProductImportResponse {
  statusCode: number;
  message: string;
  data: IProductImportData;
}

export interface IProductImportData {
  batchId: string;
  failedData: IProductImportFailedSuccessData[];
  successData: IProductImportFailedSuccessData[];
  invalidRows: number;
  totalRows: number;
  validRows: number;
  mergedData: IProductImportFailedSuccessData[];
}

export interface IProductActionResponse{
  statusCode: number;
  message: string;
}

export interface IProductImportProvided {
  productImport_onSubmit: () => void;
  productImport_onClose: () => void;
  productImport_step: globalThis.Ref<number>;
  productImport_isLoading: globalThis.Ref<boolean>;
  productImport_values: globalThis.Ref<IProductImportResponse | undefined>;
  productImport_handleDownloadTemplate: () => void;
  productImport_handleDropFile: (acceptedFiles: File[]) => void;
  productImport_handleUpload: () => void;
  productImport_triggerUpload: () => void;
  productImport_columns: IColumnDataTable[];
}
