// Interfaces
import type { Validation } from '@vuelidate/core';

export interface ISettingPaymentMethod {
  id: number;
  name: string;
  type: string;
  image?:string | null | undefined;
  iconName: string;
  isAvailable: boolean;
  sortNo: number;
}

export interface ISettingPaymentMethodFormData {
  name: string;
  iconName: string;
  type: string;
  image?:string | null | undefined;
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
  settingQris_onClose:()=> void;
  settingPaymentMethod_onCreateOrEdit: (id?: ISettingPaymentMethod) => void;
  settingQris_onCreateOrEdit:(id?:ISettingPaymentMethod) => void;
  settingPaymentMethod_onDeactivate: (value: boolean) => void;
  settingPaymentMethod_onSubmit: () => Promise<void>;
  settingPaymentMethod_toggleAvailability: (value: boolean) => void;
}

export interface ISettingPaymentMethodResponse {
  data: ISettingPaymentMethod[];
}
