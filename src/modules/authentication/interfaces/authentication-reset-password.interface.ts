// Interfaces
import type { Validation } from '@vuelidate/core';

export interface IAuthenticationResetPasswordFormData {
  email: string;
}

export interface IAuthenticationResetPasswordProvided {
  authenticationResetPassword_formData: IAuthenticationResetPasswordFormData;
  authenticationResetPassword_formValidations: globalThis.Ref<Validation>;
  authenticationResetPassword_isLoading: globalThis.Ref<boolean>;
  authenticationResetPassword_isSuccess: Ref<boolean>;
  authenticationResetPassword_onSubmit: () => Promise<void>;
}
