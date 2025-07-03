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
  accountStoreDetail_listColumnsOfOperationalHours: IColumnDataTable[];
  accountStoreDetail_listColumnsOfStoreFacilities: IColumnDataTable[];
  accountStoreDetail_listValuesOfOperationalHours: IOperationalDay[];
  accountStoreDetail_listValuesOfStoreFacilities: never[];
}
