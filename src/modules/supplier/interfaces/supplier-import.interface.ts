export interface ISupplierImport {
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
}

export interface ISupplierImportResponse {
  statusCode: number;
  message: string;
  data: {
    items: ISupplierImport[];
    meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
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
