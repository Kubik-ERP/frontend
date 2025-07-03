// Interfaces
import type { Validation } from '@vuelidate/core';

export interface IAccountBankAccountFormData {
  bankName: string;
  accountNumber: number | null;
  accountHolderName: string;
}

export interface IAccountProvided {
  account_bankAccountFormData: IAccountBankAccountFormData;
  account_bankAccountFormValidations: globalThis.Ref<Validation>;
  account_listColumns: IColumnDataTable[];
  account_onCloseDialogSetUpBank: () => void;
  account_onSetUpBankAccount: () => void;
}
