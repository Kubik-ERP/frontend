// Interfaces
import type { Validation } from '@vuelidate/core';

export interface ISettingPaymentMethod {
  id: number;
  name: string;
  iconName: string;
  isAvailable: boolean;
  sortNo: number;
}

export interface ISettingPaymentMethodFormData {
  name: string;
  iconName: string;
  isAvailable: boolean;
  sortNo: number;
}

export interface ISettingPaymentMethodProvided {
  settingPaymentMethod_fetchListPaymentMethods: () => Promise<void>;
  settingPaymentMethod_formData: ISettingPaymentMethodFormData;
  settingPaymentMethod_formValidations: globalThis.Ref<Validation>;
  settingPaymentMethod_isLoading: globalThis.Ref<boolean>;
  settingPaymentMethod_listColumns: IColumnDataTable[];
  settingPaymentMethod_listValues: globalThis.Ref<ISettingPaymentMethodFormData[]>;
  settingPaymentMethod_onClose: () => void;
  settingPaymentMethod_onCreateOrEdit: (id?: ISettingPaymentMethod) => void;
  settingPaymentMethod_onDeactivate: () => void;
  settingPaymentMethod_onSubmit: () => Promise<void>;
}

export interface ISettingPaymentMethodResponse {
  data: ISettingPaymentMethod[];
}
