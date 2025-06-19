// Interfaces
import type { Validation } from '@vuelidate/core';

export interface ICashInOutListFormData {
  amount: number;
  notes: string;
  title: string;
  type: string;
}

export interface ICashInOutListProvided {
  cashInOutList_formData: ICashInOutListFormData;
  cashInOutList_formValidations: globalThis.Ref<Validation>;
  cashInOutList_listColumns: IColumnDataTable[];
  cashInOutList_listTypes: IDropdownItem[];
  cashInOutList_listValues: never[];
  cashInOutList_onClose: () => void;
  cashInOutList_onCreate: () => void;
}
