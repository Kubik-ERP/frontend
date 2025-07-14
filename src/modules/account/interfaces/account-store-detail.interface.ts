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
  accountStoreDetail_listTabs: ITabs[];
  accountStoreDetail_listColumnsOfAssignedStaff: IColumnDataTable[];
  accountStoreDetail_listColumnsOfOperationalHours: IColumnDataTable[];
  accountStoreDetail_listColumnsOfStoreFacilities: IColumnDataTable[];
  accountStoreDetail_listValuesOfAssignedStaff: never[];
  accountStoreDetail_listValuesOfOperationalHours: IOperationalDay[];
  accountStoreDetail_listValuesOfStoreFacilities: never[];
}
