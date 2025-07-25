import type { IOutletOperationalHour, IOutletTable } from '@/modules/outlet/interfaces';

interface IHourSlot {
  open: string;
  close: string;
}

export interface IOperationalDay {
  day: string;
  hours: IHourSlot[];
}

export interface IAccountStoreDetailProvided {
  accountStoreDetail_activeTab: globalThis.Ref<string>;
  accountStoreDetail_fetchOutletListOperationalHours: () => Promise<void>;
  accountStoreDetail_isLoadingOfOutlet: globalThis.Ref<boolean>;
  accountStoreDetail_listAvailableFloor: globalThis.Ref<IDropdownItem[]>;
  accountStoreDetail_listTabs: ITabs[];
  accountStoreDetail_listColumnsOfAssignedStaff: IColumnDataTable[];
  accountStoreDetail_listColumnsOfOperationalHours: IColumnDataTable[];
  accountStoreDetail_listColumnsOfStoreFacilities: IColumnDataTable[];
  accountStoreDetail_listValuesOfAssignedStaff: never[];
  accountStoreDetail_listValuesOfOperationalHours: IOperationalDay[];
  accountStoreDetail_listValuesOfStoreFacilities: never[];
  accountStoreDetail_operationalHours: globalThis.Ref<IOutletOperationalHour[] | []>;
  accountStoreDetail_selectedFloor: globalThis.Ref<string>;
  accountStoreDetail_storeTables: globalThis.Ref<IOutletTable[] | []>;
}
