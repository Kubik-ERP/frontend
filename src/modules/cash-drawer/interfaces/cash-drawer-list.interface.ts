// Interfaces
import type { Validation } from '@vuelidate/core';
import { ICashDrawerData } from './index';

export interface ICashDrawerListRequestQuery {
  endDate?: string | null;
  limit: number;
  page: number;
  startDate?: string | null;
  type?: number | null;
}

export interface ICashDrawerListOpenRegisterFormData {
  balance: number | null;
  userId: number | null;
  notes?: string | null;
}

export interface ICashDrawerListProvided {
  cashDrawerList_columns: IColumnDataTable[];
  cashDrawerList_fetchListTransactions: () => Promise<unknown>;
  cashDrawerList_formDataOfOpenRegister: ICashDrawerListOpenRegisterFormData;
  cashDrawerList_formValidationsOfOpenRegister: globalThis.Ref<Validation>;
  cashDrawerList_getClassOfStatus: (status: string) => string;
  cashDrawerList_isLoading: globalThis.Ref<boolean>;
  cashDrawerList_onChangePage: (page: number) => void;
  cashDrawerList_onCloseOpenRegisterDialog: () => void;
  cashDrawerList_onShowOpenRegisterDialog: () => void;
  cashDrawerList_onSubmitOpenRegisterForm: () => Promise<void>;
  cashDrawerList_queryParams: ICashDrawerListRequestQuery;
  cashDrawerList_suggestionRegisterBalance: number[];
  cashDrawerList_values: globalThis.Ref<ICashDrawerData | null>;
}
