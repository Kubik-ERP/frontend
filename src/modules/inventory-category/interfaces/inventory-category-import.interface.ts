export interface IInventoryCategoryImport{
  code: string;
  name: string;
  notes: string;
  status: string;
}

export interface IInventoryCategoryImportResponse{
  statusCode: number;
  message: string;
  data: {
    items: IInventoryCategoryImport[];
    meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface IInventoryCategoryImportProvided{
  inventoryCategoryImport_onSubmit: () => void;
  inventoryCategoryImport_onClose: () => void;
  inventoryCategoryImport_step: globalThis.Ref<number>;
  inventoryCategoryImport_isLoading: globalThis.Ref<boolean>;
  inventoryCategoryImport_values: globalThis.Ref<IInventoryCategoryImportResponse | undefined>;
  inventoryCategoryImport_handleDownloadTemplate: () => void;
  inventoryCategoryImport_handleDropFile: (acceptedFiles: File[]) => void;
  inventoryCategoryImport_handleUpload: () => void;
  inventoryCategoryImport_triggerUpload: () => void;
  inventoryCategoryImport_columns: IColumnDataTable[]
}