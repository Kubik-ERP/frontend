// Interfaces
import type { Validation } from '@vuelidate/core';

export interface IAuthenticationLoginFormData {
  email: string;
  password: string;
}

export interface IAuthenticationLoginProvided {
  authenticationLogin_formData: IAuthenticationLoginFormData;
  authenticationLogin_formValidations: globalThis.Ref<Validation>;
  authenticationLogin_isLoading: globalThis.Ref<boolean>;
  authenticationLogin_onSubmit: () => Promise<void>;
}
