import type { IOutlet, IOutletOperationalHour, IOutletTable } from '@/modules/outlet/interfaces';
import { IAccountStoreTable } from './account-store-table-configuration.interface';

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
  accountStoreDetail_onCloseDialogDetailTable: () => void;
  accountStoreDetail_onShowDialogDetailTable: (table: IAccountStoreTable) => void;
  accountStoreDetail_operationalHours: globalThis.Ref<IOutletOperationalHour[] | []>;
  accountStoreDetail_selectedFloor: globalThis.Ref<string>;
  accountStoreDetail_selectedOutlet: globalThis.Ref<IOutlet | null>;
  accountStoreDetail_selectedTable: globalThis.Ref<IAccountStoreTable | null>;
  accountStoreDetail_selectedTableLayout: globalThis.Ref<IOutletTable | undefined>;
  accountStoreDetail_storeTables: globalThis.Ref<IOutletTable[] | []>;
}
