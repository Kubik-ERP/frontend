export interface ISupplierImport {
  id: string;
  code: string;
  supplierName: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  address: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  taxIdentificationNumber?: string;
  status: string;
  errorMessages?: string;
  rowNumber: number;
}


export interface ISupplierActionResponse {
  statusCode: number;
  message: string;
  data: ISupplierImport;
}

export interface ISupplierImportResponse {
  statusCode: number;
  message: string;
  data: ISupplierImportResponseData;
}

export interface ISupplierImportResponseData {
  batchId: string;
  failedData: ISupplierImport[];
  successData: ISupplierImport[];
  invalidRows: number;
  totalRows: number;
  validRows: number;
  mergedData: ISupplierImport[];
}

export interface ISupplierImportProvided {
  supplierImport_onSubmit: () => void;
  supplierImport_onClose: () => void;
  supplierImport_step: globalThis.Ref<number>;
  supplierImport_isLoading: globalThis.Ref<boolean>;
  supplierImport_values: globalThis.Ref<ISupplierImportResponse | undefined>;
  supplierImport_handleDownloadTemplate: () => void;
  supplierImport_handleDropFile: (acceptedFiles: File[]) => void;
  supplierImport_handleUpload: () => void;
  supplierImport_triggerUpload: () => void;
  supplierImport_columns: IColumnDataTable[];
}
