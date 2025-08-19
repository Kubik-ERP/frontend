// Interfaces
import type { Validation } from '@vuelidate/core';
import { ICashInOutData } from '.';

export interface ICashInOutListRequestQuery {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  startDate: string | null;
  endDate: string | null;
}
export interface ICashInOutListFormData {
  amount: number;
  notes: string;
  title: string;
  type: string;
}

export interface ICashInOutListProvided {
  cashInOutList_fetchListTransactions: () => Promise<unknown>;
  cashInOutList_formData: ICashInOutListFormData;
  cashInOutList_formValidations: globalThis.Ref<Validation>;
  cashInOutList_isLoading: globalThis.Ref<boolean>;
  cashInOutList_listColumns: IColumnDataTable[];
  cashInOutList_listTypes: IDropdownItem[];

  cashInOutList_listValues: globalThis.Ref<ICashInOutData>;
  cashInOutList_onClose: () => void;
  cashInOutList_onCreate: () => void;
  cashInOutList_queryParams: ICashInOutListRequestQuery;
}
