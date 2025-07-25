import type { ICashDrawerItem, ICashDrawerTransactionData } from './index';
import type { Validation } from '@vuelidate/core';

export interface ICashDrawerCashRegisterFormDataOfTransaction {
  amount: number | null;
  notes: string | null;
}

export interface ICashDrawerCashRegisterFormDataOfCloseTransaction
  extends Omit<ICashDrawerCashRegisterFormDataOfTransaction, 'amount'> {
  balance: number | null;
}

export interface ICashDrawerCashRegisterQueryParamsOfTransaction {
  page: number;
  limit: number;
  type: number | null;
  startDate: string | null;
  endDate: string | null;
}

export interface ICashDrawerCashRegisterProvide {
  cashDrawerCashRegister_detail: globalThis.Ref<ICashDrawerItem | null>;
  cashDrawerCashRegister_fetchCashDrawerDetails: () => Promise<unknown>;
  cashDrawerCashRegister_fetchTrasanctions: () => Promise<unknown>;
  cashDrawerCashRegister_formDataOfCloseTransaction: ICashDrawerCashRegisterFormDataOfCloseTransaction;
  cashDrawerCashRegister_formDataOfTransaction: ICashDrawerCashRegisterFormDataOfTransaction;
  cashDrawerCashRegister_formValidationsOfTransaction: globalThis.Ref<Validation>;
  cashDrawerCashRegister_formValidationsOfCloseTransaction: globalThis.Ref<Validation>;
  cashDrawerCashRegister_getIconOfTypeCashRegister: (type: number) => string;
  cashDrawerCashRegister_getValueOfTypeCashRegister: (type: number) => string;
  cashDrawerCashRegister_isLoading: globalThis.Ref<boolean>;
  cashDrawerCashRegister_isOpenCashRegisterSummary: globalThis.Ref<boolean>;
  cashDrawerCashRegister_listColumns: IColumnDataTable[];
  cashDrawerCashRegister_listTypesOfCashRegister: IDropdownItem[];
  cashDrawerCashRegister_listValuesOfCashRegister: globalThis.Ref<ICashDrawerTransactionData>;
  cashDrawerCashRegister_onCloseDialogAddTransaction: () => void;
  cashDrawerCashRegister_onCloseDialogCloseTransaction: () => void;
  cashDrawerCashRegister_onExportToPdf: (element: HTMLElement) => void;
  cashDrawerCashRegister_onOpenDialogAddTransaction: (type: 'in' | 'out') => void;
  cashDrawerCashRegister_onOpenDialogCloseTransaction: () => void;
  cashDrawerCashRegister_onSubmitAddTransaction: () => Promise<void>;
  cashDrawerCashRegister_onSubmitCloseTransaction: () => Promise<void>;
  cashDrawerCashRegister_queryParamsOfTransaction: ICashDrawerCashRegisterQueryParamsOfTransaction;
  cashDrawerCashRegister_suggestionRegisterBalance: number[];
  cashDrawerCashRegister_typeOfTransaction: globalThis.Ref<'in' | 'out'>;
  cashDrawerCashRegister_toggleCashRegisterSummary: () => void;
}
