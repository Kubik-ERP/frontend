export interface IStorageLocationImport{
  code: string;
  name: string;
  notes: string;
  status: string;
}

export interface IStorageLocationImportResponse{
  statusCode: number;
  message: string;
  data: {
    items: IStorageLocationImport[];
    meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface IStorageLocationImportProvided{
  storageLocationImport_onSubmit: () => void;
  storageLocationImport_onClose: () => void;
  storageLocationImport_step: globalThis.Ref<number>;
  storageLocationImport_isLoading: globalThis.Ref<boolean>;
  storageLocationImport_values: globalThis.Ref<IStorageLocationImportResponse | undefined>;
  storageLocationImport_handleDownloadTemplate: () => void;
  storageLocationImport_handleDropFile: (acceptedFiles: File[]) => void;
  storageLocationImport_handleUpload: () => void;
  storageLocationImport_triggerUpload: () => void;
  storageLocationImport_columns: IColumnDataTable[]
}