import type { Validation } from '@vuelidate/core';
import type { IOutlet, IOutletOperationalHour, IOutletTable } from '@/modules/outlet/interfaces';
import type { IAccountStoreTable } from './account-store-table-configuration.interface';
import { IStaffMemberListResponse } from '@/modules/staff-member/interfaces';

interface IHourSlot {
  open: string;
  close: string;
}

export interface IOperationalDay {
  day: string;
  hours: IHourSlot[];
}

export interface IStoreFacilities {
  data: IStoreFacility[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface IStoreFacility {
  id: string;
  storeId: string;
  facility: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface IStoreFacilityFormData {
  id?: string | null;
  facility: string;
  description: string;
}

export interface IStoreFacility_queryParams {
  page: number;
  limit: number;
}

export interface IStoreAssignedStaff {
  id: string;
  name: string;
  title: string;
}

export interface IAcountStaffMemberListRequestQuery {
  page: number;
  limit: number;
  search?: string | null;
  'X-STORE-ID': string;
}

export interface IStoreAssignedStaffFormData {
  employeeId: string;
  type: 'ASSIGN';
}

export interface IStoreAssignedStaffActionResponse {
  statusCode: number;
  message: string;
  data: string;
}

export interface IAccountStoreDetailProvided {
  accountStoreDetail_activeTab: globalThis.Ref<string>;
  accountStoreDetail_fetchOutletListOperationalHours: () => Promise<void>;
  accountStoreDetail_fetchOutletStoreTable: () => Promise<void>;
  accountStoreDetail_isLoadingOfOutlet: globalThis.Ref<boolean>;
  accountStoreDetail_listAvailableFloor: globalThis.Ref<IDropdownItem[]>;
  accountStoreDetail_listTabs: ITabs[];
  accountStoreDetail_listColumnsOfAssignedStaff: IColumnDataTable[];
  accountStoreDetail_listColumnsOfOperationalHours: IColumnDataTable[];
  accountStoreDetail_listColumnsOfStoreFacilities: IColumnDataTable[];
  accountStoreDetail_listValuesOfAssignedStaff: globalThis.Ref<IStaffMemberListResponse>;
  accountStoreDetail_listValuesOfOperationalHours: IOperationalDay[];
  accountStoreDetail_listValuesOfStoreFacilities: never[];
  accountStoreDetail_onCloseDialogDetailTable: () => void;
  accountStoreDetail_onShowDialogDetailTable: (table: IAccountStoreTable) => void;
  accountStoreDetail_operationalHours: globalThis.Ref<IOutletOperationalHour[] | []>;
  accountStoreDetail_selectedFloor: globalThis.Ref<string>;
  accountStoreDetail_selectedOutlet: globalThis.Ref<IOutlet | null>;
  accountStoreDetail_selectedTable: globalThis.Ref<IAccountStoreTable | null>;
  accountStoreDetail_selectedTableLayout: globalThis.Ref<IOutletTable | undefined>;
  accountStoreDetail_storeTables: globalThis.Ref<IOutletTable[] | null>;

  // facilty
  account_storeFacilities: globalThis.Ref<IStoreFacilities>;
  accountStoreDetail_formData: IStoreFacilityFormData;
  accountStoreDetail_formValidations: globalThis.Ref<Validation>;
  accountStoreDetail_onChangePage: (page: number) => void;
  account_storeFacilities_isLoading: globalThis.Ref<boolean>;

  accountStoreDetail_fetchAccountStoreFacilities: () => Promise<void>;
  accountStoreDetail_createAccountStoreFacilities: () => Promise<void>;
  accountStoreDetail_updateAccountStoreFacilities: (id: string) => Promise<void>;
  accountStoreDetail_deleteAccountStoreFacilities: (id: string) => Promise<void>;

  accountStoreDetail_onShowDialogCreateEdit: (facility: IStoreFacility | null) => void;
  accountStoreDetail_onCloseDialogCreateEdit: () => void;
  accoutnStoreDetail_onSubmitDialogCreateEdit: () => Promise<void>;
  accountStoreDetail_onDeleteDialogConfirmation: (id: string) => void;
  accountStoreDetail_onDownloadTableQRCode: () => void;

  // staff
  accountStoreDetail_onAddStaff: () => void;
  accountStoreDetail_onCloseAddStaff: () => void;
  accountDetail_fetchAssignedStaff: () => Promise<void>;
  accountDetail_listAssignedStaff: globalThis.Ref<IStoreAssignedStaff[]>;
  accountDetail_listAssignedQueryParams: IAcountStaffMemberListRequestQuery;
  accountDetail_AssignedStaff_isLoading: globalThis.Ref<boolean>;
  accountDetail_AssignedStaff_formData: globalThis.Ref<IStoreAssignedStaffFormData>;
  accountDetail_AssignedStaff_formValidations: globalThis.Ref<Validation>;
  accountDetail_AssignedStaff_onSubmit: () => Promise<void>;
  // accountDetail_listAvailableStaff: globalThis.Ref<IStaffMember[]>;
}
