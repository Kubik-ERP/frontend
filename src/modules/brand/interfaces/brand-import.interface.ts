export interface IBrandImport{
  code: string;
  name: string;
  description: string;
  status: string;
}

export interface IBrandImportResponse{
  statusCode: number;
  message: string;
  data: {
    items: IBrandImport[];
    meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
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