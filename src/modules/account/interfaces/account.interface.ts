// Interfaces
import type { IOutlet, IOutletProfile } from '@/modules/outlet/interfaces';
import type { Validation } from '@vuelidate/core';

export interface IAccountBankAccountFormData {
  bank_id?: string | null;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface IAccountProvided {
  account_bankAccountFormData: IAccountBankAccountFormData;
  account_bankAccountFormValidations: globalThis.Ref<Validation>;
  account_fetchOutletProfile: () => Promise<void>;
  account_fetchUserBanks: () => Promise<void>;
  account_isLoadingOfOutlet: globalThis.Ref<boolean>;
  account_listColumns: IColumnDataTable[];
  account_onCloseDialogSetUpBank: () => void;
  account_onDirectToDetailOutlet: (outlet: IOutlet) => void;
  account_onEditBankAccount: () => void;
  account_onSetUpBankAccount: () => void;
  account_onSubmitBankAccount: () => Promise<void>;
  account_profile: globalThis.Ref<IOutletProfile | null>;
}
