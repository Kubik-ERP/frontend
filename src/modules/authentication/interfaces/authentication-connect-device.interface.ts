// Interfaces
import type { Validation } from '@vuelidate/core';

export interface IAuthenticationConnectDeviceFormData {
  email: string;
  deviceCode: string;
  deviceType: 'DESKTOP' | 'MOBILE';
  browser: string;
  city: string;
  country: string;
  rememberMe: boolean;
}

export interface IAuthenticationConnectDeviceResponse {
  data: {
    accessToken: string;
    storeId: string;
  };
}

export interface IAuthenticationConnectDeviceProvided {
  authenticationConnectDevice_detectLocationAndBrowser: () => Promise<void>;
  authenticationConnectDevice_formData: IAuthenticationConnectDeviceFormData;
  authenticationConnectDevice_formValidations: globalThis.Ref<Validation>;
  authenticationConnectDevice_isLoading: globalThis.Ref<boolean>;
  authenticationConnectDevice_isNotAuthenticated: globalThis.Ref<boolean>;
  authenticationConnectDevice_onSubmit: () => Promise<void>;
}
