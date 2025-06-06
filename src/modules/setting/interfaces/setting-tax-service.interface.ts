// Interfaces
import type { Validation } from '@vuelidate/core';

export interface ISettingTaxAndService {
  id: number;
  appliedToTakeaway: boolean;
  name: string;
  percentage: number;
  type: 'tax' | 'service';
  isInclude: boolean;
  isEnabled: boolean;
}

export interface ISettingTaxAndServiceFormData {
  appliedToTakeaway: boolean;
  name: string;
  isEnabled: boolean;
  isInclude: boolean;
  percentage: number;
  chargeType: 'tax' | 'service';
}

export interface ISettingTaxAndServiceResponse {
  data: ISettingTaxAndService[];
}

export interface ISettingTaxAndServiceProvided {
  settingTaxService_fetchListCharges: () => Promise<void>;
  settingTaxService_formDataOfTax: ISettingTaxAndServiceFormData;
  settingTaxService_formDataOfService: ISettingTaxAndServiceFormData;
  settingTaxService_formValidationsOfService: globalThis.Ref<Validation>;
  settingTaxService_formValidationsOfTax: globalThis.Ref<Validation>;
  settingTaxService_isLoading: globalThis.Ref<boolean>;
  settingTaxService_onSubmit: (type: 'service' | 'tax') => Promise<void>;
}
