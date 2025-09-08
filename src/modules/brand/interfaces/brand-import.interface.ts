export interface IBrandImportData{
    batchId: string;
    failedData:brand_importFailedSuccessData[];
    successData:brand_importFailedSuccessData[];
    invalidRows: number;
    totalRows: number;
    validRows: number;
    mergedData:brand_importFailedSuccessData[];
}

export interface brand_importFailedSuccessData{
    id: string;
    name: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
    rowNumber: number;
    status: string;
    errorMessages?: string
}

export interface IBrandImportResponse{
  statusCode: number;
  message: string;
  data: IBrandImportData
}

export interface IBrandImportProvided{
  brandImport_onSubmit: () => void;
  brandImport_onClose: () => void;
  brandImport_step: globalThis.Ref<number>;
  brandImport_isLoading: globalThis.Ref<boolean>;
  brandImport_values: globalThis.Ref<IBrandImportResponse | undefined>;
  brandImport_handleDownloadTemplate: () => void;
  brandImport_handleDropFile: (acceptedFiles: File[]) => void;
  brandImport_handleUpload: () => void;
  brandImport_triggerUpload: () => void;
  brandImport_columns: IColumnDataTable[]
}