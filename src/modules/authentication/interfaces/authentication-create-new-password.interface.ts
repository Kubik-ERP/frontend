// Interfaces
import type { Validation } from '@vuelidate/core';

export interface IAuthenticationCreateNewPasswordFormData {
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface IAuthenticationCreateNewPasswordProvided {
  authenticationCreateNewPassword_formData: IAuthenticationCreateNewPasswordFormData;
  authenticationCreateNewPassword_formValidations: globalThis.Ref<Validation>;
  authenticationCreateNewPassword_isLoading: globalThis.Ref<boolean>;
  authenticationCreateNewPassword_isSuccess: Ref<boolean>;
  authenticationCreateNewPassword_onSubmit: () => Promise<void>;
}
