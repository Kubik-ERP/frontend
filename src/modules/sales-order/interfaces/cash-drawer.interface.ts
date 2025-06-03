// Interfaces
import type { Validation } from '@vuelidate/core';

export interface ICashDrawerFormData {
  balances: number[];
  openBalance: number | null;
  staffName: string;
}

export interface ICashDrawerProvided {
  cashDrawer_formData: ICashDrawerFormData;
  cashDrawer_formValidations: globalThis.Ref<Validation>;
  cashDrawer_getClassOfStatus: (status: string) => string;
  cashDrawer_listColumns: IColumnDataTable[];
  cashDrawer_listValues: never[];
}