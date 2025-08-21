import type { Validation } from '@vuelidate/core';
import type { IOutlet, IOutletOperationalHour, IOutletTable, IOutletTableData } from '@/modules/outlet/interfaces';
import type { IAccountStoreTable } from './account-store-table-configuration.interface';

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
  accountStoreDetail_listValuesOfAssignedStaff: never[];
  accountStoreDetail_listValuesOfOperationalHours: IOperationalDay[];
  accountStoreDetail_listValuesOfStoreFacilities: never[];
  accountStoreDetail_onCloseDialogDetailTable: () => void;
  accountStoreDetail_onShowDialogDetailTable: (table: IAccountStoreTable) => void;
  accountStoreDetail_operationalHours: globalThis.Ref<IOutletOperationalHour[] | []>;
  accountStoreDetail_selectedFloor: globalThis.Ref<string>;
  accountStoreDetail_selectedOutlet: globalThis.Ref<IOutlet | null>;
  accountStoreDetail_selectedTable: globalThis.Ref<IAccountStoreTable | null>;
  accountStoreDetail_selectedTableLayout: globalThis.Ref<IOutletTable | undefined>;
  accountStoreDetail_storeTables: globalThis.Ref<IOutletTableData | null>;

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
}
