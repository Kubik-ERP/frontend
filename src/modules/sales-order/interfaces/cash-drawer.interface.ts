// Interfaces
import type { Validation } from '@vuelidate/core';

export interface ICashDrawerFormData {
  balances: number[];
  notes: string;
  openBalance: number | null;
  staffName: string;
}

export interface ICashDrawerProvided {
  cashDrawer_formData: ICashDrawerFormData;
  cashDrawer_formValidations: globalThis.Ref<Validation>;
  cashDrawer_getClassOfStatus: (status: string) => string;
  cashDrawer_getIconOfTypeCashRegister: (type: string) => string;
  cashDrawer_listColumns: IColumnDataTable[];
  cashDrawer_listColumnsOfCashRegister: IColumnDataTable[];
  cashDrawer_listTypesOfCashRegister: IDropdownItem[];
  cashDrawer_listValues: never[];
  cashDrawer_listValuesOfCashRegister: never[];
  cashDrawer_onCloseRegister: () => void;
  cashDrawer_onOpenRegister: () => void;
}