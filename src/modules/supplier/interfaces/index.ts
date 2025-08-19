import { IInventoryItems } from "@/modules/items/interfaces";

export interface ISupplierStateStore {
  supplier_isLoading: boolean;
  supplier_supplierLists: ISupplierListResponse;
  supplier_itemLists: ISupplierItemListResponse;
  supplier_supplierDetail: ISupplierDetailResponse | null;
}

export interface ISupplierItem {
  id: string;
  supplierName: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  address: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  taxIdentificationNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISupplierListResponse {
  statusCode: number;
  message: string;
  data: {
    items: ISupplierItem[];
    meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ISupplierItemListResponse {
  statusCode: number;
  message: string;
  data: {
    items: IInventoryItems[];
    meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ISupplierDetailResponse {
  data: ISupplierItem;
}

export interface ISupplierCreatePayload {
  supplierName: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  address: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  taxIdentificationNumber?: string;
}

export interface ISupplierUpdatePayload {
  supplierName: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  address: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  taxIdentificationNumber?: string;
}
