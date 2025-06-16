// Interfaces
import type { Validation } from '@vuelidate/core';

export interface ICashDrawerRequestQuery {
  endDate?: string | null;
  limit: number;
  page: number;
  startDate?: string | null;
  type?: number | null;
}

export interface ICashDrawerOpenFormData {
  balance: number | null;
  userId: number | null;
  notes?: string | null;
}

export interface ICashDrawerListProvided {
  cashDrawerList_columns: IColumnDataTable[];
  cashDrawerList_fetchListTransactions: () => Promise<unknown>;
  cashDrawerList_formDataOfOpenRegister: ICashDrawerOpenFormData;
  cashDrawerList_formValidationsOfOpenRegister: globalThis.Ref<Validation>;
  cashDrawerList_getClassOfStatus: (status: string) => string;
  cashDrawerList_isLoading: globalThis.Ref<boolean>;
  cashDrawerList_onCloseOpenRegisterDialog: () => void;
  cashDrawerList_onShowOpenRegisterDialog: () => void;
  cashDrawerList_queryParams: ICashDrawerRequestQuery;
  cashDrawerList_suggestionRegisterBalance: number[];
  cashDrawerList_values: never[];
}
