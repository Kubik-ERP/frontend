import type { Validation } from '@vuelidate/core';

export interface IStockOpnameStore {
  stockOpname_isLoading: boolean;
  stockOpname_detail: IStockOpname_detail;
  stockOpname_lists: IStockOpname_list;
}
export interface IMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
export interface IStockOpname_list {
  items: IStockOpname[];
  meta: IMeta;
}

export interface IStockOpname {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  code: string;
  storeId: string;
  status: string;
  performedBy: number;
  users: {
    fullname: string;
  };
  totalItemChecked: number;
  stockMismatches: number;
}

export interface IStockOpname_detailItems {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  stockOpnameId: string;
  masterInventoryItemId: string;
  masterInventoryItems: {
    id: string;
    name: string;
    sku: string;
  };
  expectedQuantity: number;
  actualQuantity: number;
  notes: string;
  diffQuantity: number;
}

export interface IStockOpname_detail {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  code: string;
  storeId: string;
  status: string;
  performedBy: number;
  stockOpnameItems: Array<IStockOpname_detailItems>;
  users: {
    fullname: string;
  };
}

export interface IStockOpnameListRequestQuery {
  page: number;
  pageSize: number;
}

export interface IStockOpnameFormData {
  publishNow: boolean;
  items: {
    masterInventoryItemId: string;
    actualQuantity: number;
    notes: string;
  }[];
}

export interface IStockOpnameProvided {
  stockOpnameRecordColumns: IColumnDataTable[];
  stockOpnameCreateEditColumns: IColumnDataTable[];
  stockOpname_onChangePage: (page: number) => void;
  stockOpname_isLoading: globalThis.Ref<boolean>;
  stockOpname_detail: globalThis.Ref<IStockOpname_detail>;
  stockOpname_lists: globalThis.Ref<IStockOpname_list>;
  statusClass: (status: string) => string;

  stockOpname_fetchList: () => Promise<void>;
  stockOpname_fetchDetail: (id: string) => Promise<void>;
  stockOpname_queryParams: IStockOpnameListRequestQuery;

  stockOpname_formData: IStockOpnameFormData;
  stockOpname_onShowNotesDialog: (item: IStockOpname_detailItems) => void;
  stockOpname_onCloseNotesDialog: () => void;
  stockOpname_onSubmitCreateEdit: (publishNow: boolean, stockOpname_id: string) => Promise<void>;
  stockOpname_onSubmitNotesDialog: () => void;
  notesBuffer: globalThis.Ref<string>;
  notesBufferValidation: globalThis.Ref<Validation>;
  stockOpname_onShowDialogDeleteIssue: (id: string) => void;
  stockOpname_onShowDialogIssueRecord: (id: string) => void;
  stockOpname_onShowDialogVerifyRecord: (id: string) => void;
}
