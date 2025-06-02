// Interfaces
import type { Validation } from '@vuelidate/core';

export interface ICashInOutFormData {
  amount: number;
  notes: string;
  title: string;
  type: string;
}

export interface ICashInOutProvided {
  cashInOut_formData: ICashInOutFormData;
  cashInOut_formValidations: globalThis.Ref<Validation>;
  cashInOut_listColumns: IColumnDataTable[];
  cashInOut_listItemsOfSplitButton: ISplitButton[];
  cashInOut_listTypes: IDropdownItem[];
  cashInOut_listValues: never[];
  cashInOut_onClose: () => void;
  cashInOut_onCreate: () => void;
}
