export interface ICashDrawerCashRegisterProvide {
  cashDrawerCashRegister_getIconOfTypeCashRegister: (type: string) => string;
  cashDrawerCashRegister_listColumns: IColumnDataTable[];
  cashDrawerCashRegister_listTypesOfCashRegister: IDropdownItem[];
  cashDrawerCashRegister_listValuesOfCashRegister: never[];
}
